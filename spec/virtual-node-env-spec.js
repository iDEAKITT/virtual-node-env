var vne = require('../index');
var node = vne.node;
var npm = vne.npm;
var expect = require('chai').expect;

describe('Virtual Node Env Spec', function(){
  it('node version should be shown', function(){
    vne.version = "v4.4.2";
    return node("-v").then(function(outputs){
      expect(outputs.stdout).to.eq("v4.4.2\n");
    });
  });

  it('npm version should be shown', function(){
    vne.version = "v4.4.2";
    return npm("-v").then(function(outputs){
      expect(outputs.stdout).to.eq("2.15.0\n");
    });
  });
});
