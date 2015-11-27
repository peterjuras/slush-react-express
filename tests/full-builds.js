var should = require('should'),
  exec = require('child_process').exec,
  mkdirp = require('mkdirp'),
  del = require('del'),
  path = require('path'),
  mockPrompt = require('./util/mock');

var generator = require('../slushfile');
var buildPath = path.join(__dirname, 'full-builds')

describe('slush-react-express', function() {
  this.timeout(1000 * 60 * 30);

  before(function(done) {
    process.chdir(__dirname);
    del.sync('full-builds');
    mkdirp(buildPath, done);
  });

  describe('Minimal generator', function() {
    beforeEach(function() {
      generator.destination = './';
      process.chdir(buildPath);

      mockPrompt({
        'appname': 'Minimal js',
        'type': 'Minimal',
        'createDir': true
      });
    });

    it('should scaffold without error', function(done) {
      generator.generate(done);
    });
  });

  describe('Full generator', function() {
    beforeEach(function() {
      generator.destination = './';
      process.chdir(buildPath);
    });

    describe('JavaScript template', function() {
      beforeEach(function() {
        process.chdir(buildPath);
      });

      it('css', function(done) {
        mockPrompt({
          'appname': 'FULL JS CSS',
          'type': 'Full',
          'ts': 'JavaScript',
          'sass': 'CSS',
          'createDir': true
        });
        var templateDest = 'full-js-css';
        generator.generate(function() {
          process.chdir(path.join(buildPath, templateDest));
          exec('node_modules/.bin/gulp', function(error, stdout, stderr) {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if (error) {
              console.log('exec error: ' + error);
              done(error);
            }
            if (stderr) {
              var onlyWarnings = stderr.split('\n').every(function (line) {
                return line.indexOf('npm WARN') === 0 || !/\S/.test(line);
              });
              done(!onlyWarnings);
            }
          });
        });
      });

      it('sass', function(done) {
        mockPrompt({
          'appname': 'FULL JS SASS',
          'type': 'Full',
          'ts': 'JavaScript',
          'sass': 'SASS',
          'createDir': true
        });
        var templateDest = 'full-js-sass';
        generator.generate(function() {
          process.chdir(path.join(buildPath, templateDest));
          exec('node_modules/.bin/gulp', function(error, stdout, stderr) {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if (error) {
              console.log('exec error: ' + error);
              done(error);
            }
            if (stderr) {
              var onlyWarnings = stderr.split('\n').every(function (line) {
                return line.indexOf('npm WARN') === 0 || !/\S/.test(line);
              });
              done(!onlyWarnings);
            }
          });
        });
      });
    });

    describe('TypeScript template', function() {
      beforeEach(function() {
        process.chdir(buildPath);
      });

      it('css', function(done) {
        mockPrompt({
          'appname': 'FULL TS CSS',
          'type': 'Full',
          'ts': 'TypeScript',
          'sass': 'CSS',
          'createDir': true
        });
        var templateDest = 'full-ts-css';
        generator.generate(function() {
          process.chdir(path.join(buildPath, templateDest));
          exec('node_modules/.bin/gulp', function(error, stdout, stderr) {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if (error) {
              console.log('exec error: ' + error);
              done(error);
            }
            if (stderr) {
              var onlyWarnings = stderr.split('\n').every(function (line) {
                return line.indexOf('npm WARN') === 0 || !/\S/.test(line);
              });
              done(!onlyWarnings);
            }
          });
        });
      });

      it('sass', function(done) {
        mockPrompt({
          'appname': 'FULL TS SASS',
          'type': 'Full',
          'ts': 'TypeScript',
          'sass': 'SASS',
          'createDir': true
        });
        var templateDest = 'full-ts-sass';
        generator.generate(function() {
          process.chdir(path.join(buildPath, templateDest));
          exec('node_modules/.bin/gulp', function(error, stdout, stderr) {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if (error) {
              console.log('exec error: ' + error);
              done(error);
            }
            if (stderr) {
              var onlyWarnings = stderr.split('\n').every(function (line) {
                return line.indexOf('npm WARN') === 0 || !/\S/.test(line);
              });
              done(!onlyWarnings);
            }
          });
        });
      });
    });
  });
});
