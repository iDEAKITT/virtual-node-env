var Promise = require('bluebird');
var os = require('os');
var exec = require('child_process').exec;
var wget = require('wget-improved');

var checkExists = function(path){
  return new Promise(function(resolve, reject){
    return require('fs').stat(path, function(err, stats){
      if(err) {
        if(err.code === "ENOENT") {
          return resolve(false);
        } else {
          reject(err);
        }
      }
      return resolve(true);
    });
  });
};
var osSuffix = os.type() === "Darwin" ? "darwin-x64" : "linux-x64";

var NODE = "/bin/node";
var NPM = "/bin/npm";
var TARGZ = ".tar.gz";


exports.version = "v4.4.2";

exports.downloadBaseURL = "https://nodejs.org/dist";

exports.node = function(){
  var argv = normalizeOptions(arguments);
  return Promise.resolve()
    .then(fetchNode.bind(null, argv[1].NODE_ROOT))
    .then(function(){
      return node.apply(null, argv);
    });
};

exports.npm = function(){
  var argv = normalizeOptions(arguments);
  return Promise.resolve()
    .then(fetchNode.bind(null, argv[1].NODE_ROOT))
    .then(function(){
      return npm.apply(null, argv);
    });
};

exports.fetch = _fetchNode;

function url(){
  return exports.downloadBaseURL + "/" + exports.version;
}

function version(){
  return exports.version;
}

function normalizeOptions(argv){
  var opts = argv["1"] || {};
  return [argv["0"], opts];
}

function env(){
  var NAME = "node-" + exports.version + "-" + osSuffix;
  var NODE_PATH = process.cwd() + "/" + NAME + NODE;
  var NPM_PATH = process.cwd() + "/" + NAME + NPM;

  return {
    NAME: NAME,
    NODE_PATH: NODE_PATH,
    NPM_PATH: NPM_PATH
  };
}

function pexec(cmd){
  return new Promise(function(resolve, reject){
    exec(cmd, function(error, stdout, stderr){
      if(error) {
        return reject(error);
      }
      resolve({
        stdout: stdout,
        stderr: stderr
      });
    });
  });
}

function fetchNode(root){
  if(root) {
    return Promise.resolve();
  }
  return _fetchNode();
}

function _fetchNode(dir){
  var cwd = dir || process.cwd();

  var e = env();
  return checkExists(cwd + "/" + e.NAME).then(function(yes){
    if(!yes) {
      return new Promise(function(resolve, reject){
        var download = wget.download(url() + "/" + e.NAME + TARGZ, cwd + "/" + e.NAME + TARGZ);
        download.on('error', reject);

        download.on('start', function(fileSize) {
          console.log("Downloading... " + url() + "/" + e.NAME + TARGZ);
        });

        download.on('end', function(){
          extractTarGZ(cwd + "/" + e.NAME, cwd).then(function(){
            resolve();
          });
        });
      });
    }
  });
}

function node(cmd, opts){
  if(opts.NODE_ROOT) {
    opts.NODE_ROOT+=NODE;
  }

  return normalizeCommand(opts.NODE_ROOT || env().NODE_PATH, cmd, opts);
}

function npm(cmd, opts){
  if(opts.NODE_ROOT) {
    opts.NODE_ROOT+=NPM;
  }

  return normalizeCommand(opts.NODE_ROOT || env().NPM_PATH, cmd, opts);
}

function normalizeCommand(cmd, arg, opts){
  if(!opts.workingDir) {
    opts.workingDir = process.cwd();
  }

  return pexec([
    "cd",
    opts.workingDir,
    "&&",
    cmd,
    arg
  ].join(" "));
}

function extractTarGZ(path, outDir){
  return pexec("tar zxvf " + path + TARGZ + " -C " + outDir + " >/dev/null 2>&1");
}
