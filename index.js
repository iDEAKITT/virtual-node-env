var Promise = require('bluebird');
var os = require('os');
var exec = require('child_process').exec;
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

exports.version = "v4.4.2";

exports.node = function(){
  var argv = arguments;
  return Promise.resolve()
    .then(fetchNode)
    .then(function(){
      return node.apply(null, argv);
    });
};

exports.npm = function(){
  var argv = arguments;
  return Promise.resolve()
    .then(fetchNode)
    .then(function(){
      return npm.apply(null, argv);
    });
};

function version(){
  return exports.version;
}

function env(){
  var NAME = "node-" + exports.version + "-" + osSuffix;
  var NODE_PATH = process.cwd() + "/" + NAME + "/bin/node";
  var NPM_PATH = process.cwd() + "/" + NAME + "/bin/npm";

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

function fetchNode(){
  var e = env();
  return checkExists(process.cwd() + "/" + e.NAME + ".tar.gz").then(function(yes){
    if(!yes) {
      return pexec("wget https://nodejs.org/dist/" + version() + "/" + e.NAME + ".tar.gz");
    }
  })
  .then(function(){
    return checkExists(process.cwd() + "/" + e.NAME);
  })
  .then(function(yes){
    if(!yes) {
      return extract();
    }
  });
}

function node(cmd, opts){
  return normalizeCommand(env().NODE_PATH, cmd, opts);
}

function npm(cmd, opts){
  return normalizeCommand(env().NPM_PATH, cmd, opts);
}

function normalizeCommand(cmd, arg, opts){
  if(!opts) opts = {};
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

function extract(){
  return pexec("tar zxvf " + env().NAME + ".tar.gz  >/dev/null 2>&1");
}
