require('should');
import childProcess = require('child_process');
import mkdirp = require('mkdirp');
import del = require('del');
import path = require('path');
import mockPrompt from './util/mock';

const exec = childProcess.exec;

import generate from '../slushfile';
const buildPath = path.join(__dirname, 'full-builds');

describe('slush-react-express', function () {
  this.timeout(1000 * 60 * 30);

  before(done => {
    process.chdir(__dirname);
    del.sync('full-builds');
    mkdirp(buildPath, done);
  });

  describe('Minimal generator', () => {
    beforeEach(() => {
      process.chdir(buildPath);

      mockPrompt({
        'appname': 'Minimal js',
        'type': 'Minimal',
        'createDir': true
      });
    });

    it('should scaffold without error', done => {
      generate(done);
    });
  });

  describe('Full generator', () => {
    beforeEach(() => {
      process.chdir(buildPath);
    });

    describe('JavaScript template', () => {
      beforeEach(() => {
        process.chdir(buildPath);
      });

      it('css', done => {
        mockPrompt({
          'appname': 'FULL JS CSS',
          'type': 'Full',
          'ts': 'JavaScript',
          'sass': 'CSS',
          'createDir': true
        });
        const templateDest = 'full-js-css';
        generate(() => {
          process.chdir(path.join(buildPath, templateDest));
          exec('node_modules/.bin/gulp', (error, stdout, stderr) => {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if (error) {
              console.log('exec error: ' + error);
              done(error);
            }
            if (stderr) {
              const onlyWarnings = stderr.toString().split('\n')
                .every(line => line.indexOf('npm WARN') === 0 || !/\S/.test(line));
              done(!onlyWarnings);
            }
          });
        });
      });

      it('sass', done => {
        mockPrompt({
          'appname': 'FULL JS SASS',
          'type': 'Full',
          'ts': 'JavaScript',
          'sass': 'SASS',
          'createDir': true
        });
        const templateDest = 'full-js-sass';
        generate(() => {
          process.chdir(path.join(buildPath, templateDest));
          exec('node_modules/.bin/gulp', (error, stdout, stderr) => {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if (error) {
              console.log('exec error: ' + error);
              done(error);
            }
            if (stderr) {
              const onlyWarnings = stderr.toString().split('\n')
                .every(line => line.indexOf('npm WARN') === 0 || !/\S/.test(line));
              done(!onlyWarnings);
            }
          });
        });
      });
    });

    describe('TypeScript template', () => {
      beforeEach(() => {
        process.chdir(buildPath);
      });

      it('css', done => {
        mockPrompt({
          'appname': 'FULL TS CSS',
          'type': 'Full',
          'ts': 'TypeScript',
          'sass': 'CSS',
          'createDir': true
        });
        const templateDest = 'full-ts-css';
        generate(() => {
          process.chdir(path.join(buildPath, templateDest));
          exec('node_modules/.bin/gulp', (error, stdout, stderr) => {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if (error) {
              console.log('exec error: ' + error);
              done(error);
            }
            if (stderr) {
              const onlyWarnings = stderr.toString().split('\n')
                .every(line => line.indexOf('npm WARN') === 0 || !/\S/.test(line));
              done(!onlyWarnings);
            }
          });
        });
      });

      it('sass', done => {
        mockPrompt({
          'appname': 'FULL TS SASS',
          'type': 'Full',
          'ts': 'TypeScript',
          'sass': 'SASS',
          'createDir': true
        });
        const templateDest = 'full-ts-sass';
        generate(() => {
          process.chdir(path.join(buildPath, templateDest));
          exec('node_modules/.bin/gulp', (error, stdout, stderr) => {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if (error) {
              console.log('exec error: ' + error);
              done(error);
            }
            if (stderr) {
              const onlyWarnings = stderr.toString().split('\n')
                .every(line => line.indexOf('npm WARN') === 0 || !/\S/.test(line));
              done(!onlyWarnings);
            }
          });
        });
      });
    });
  });
});
