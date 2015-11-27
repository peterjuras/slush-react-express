require('should');
var childProcess = require('child_process');
var mkdirp = require('mkdirp');
var del = require('del');
var path = require('path');
var mock_1 = require('./util/mock');
var exec = childProcess.exec;
var slushfile_1 = require('../slushfile');
var buildPath = path.join(__dirname, 'full-builds');
describe('slush-react-express', function () {
    this.timeout(1000 * 60 * 30);
    before(function (done) {
        process.chdir(__dirname);
        del.sync('full-builds');
        mkdirp(buildPath, done);
    });
    describe('Minimal generator', function () {
        beforeEach(function () {
            process.chdir(buildPath);
            mock_1["default"]({
                'appname': 'Minimal js',
                'type': 'Minimal',
                'createDir': true
            });
        });
        it('should scaffold without error', function (done) {
            slushfile_1["default"](done);
        });
    });
    describe('Full generator', function () {
        beforeEach(function () {
            process.chdir(buildPath);
        });
        describe('JavaScript template', function () {
            beforeEach(function () {
                process.chdir(buildPath);
            });
            it('css', function (done) {
                mock_1["default"]({
                    'appname': 'FULL JS CSS',
                    'type': 'Full',
                    'ts': 'JavaScript',
                    'sass': 'CSS',
                    'createDir': true
                });
                var templateDest = 'full-js-css';
                slushfile_1["default"](function () {
                    process.chdir(path.join(buildPath, templateDest));
                    exec('node_modules/.bin/gulp', function (error, stdout, stderr) {
                        console.log('stdout: ' + stdout);
                        console.log('stderr: ' + stderr);
                        if (error) {
                            console.log('exec error: ' + error);
                            done(error);
                        }
                        if (stderr) {
                            var onlyWarnings = stderr.toString().split('\n')
                                .every(function (line) { return line.indexOf('npm WARN') === 0 || !/\S/.test(line); });
                            done(!onlyWarnings);
                        }
                    });
                });
            });
            it('sass', function (done) {
                mock_1["default"]({
                    'appname': 'FULL JS SASS',
                    'type': 'Full',
                    'ts': 'JavaScript',
                    'sass': 'SASS',
                    'createDir': true
                });
                var templateDest = 'full-js-sass';
                slushfile_1["default"](function () {
                    process.chdir(path.join(buildPath, templateDest));
                    exec('node_modules/.bin/gulp', function (error, stdout, stderr) {
                        console.log('stdout: ' + stdout);
                        console.log('stderr: ' + stderr);
                        if (error) {
                            console.log('exec error: ' + error);
                            done(error);
                        }
                        if (stderr) {
                            var onlyWarnings = stderr.toString().split('\n')
                                .every(function (line) { return line.indexOf('npm WARN') === 0 || !/\S/.test(line); });
                            done(!onlyWarnings);
                        }
                    });
                });
            });
        });
        describe('TypeScript template', function () {
            beforeEach(function () {
                process.chdir(buildPath);
            });
            it('css', function (done) {
                mock_1["default"]({
                    'appname': 'FULL TS CSS',
                    'type': 'Full',
                    'ts': 'TypeScript',
                    'sass': 'CSS',
                    'createDir': true
                });
                var templateDest = 'full-ts-css';
                slushfile_1["default"](function () {
                    process.chdir(path.join(buildPath, templateDest));
                    exec('node_modules/.bin/gulp', function (error, stdout, stderr) {
                        console.log('stdout: ' + stdout);
                        console.log('stderr: ' + stderr);
                        if (error) {
                            console.log('exec error: ' + error);
                            done(error);
                        }
                        if (stderr) {
                            var onlyWarnings = stderr.toString().split('\n')
                                .every(function (line) { return line.indexOf('npm WARN') === 0 || !/\S/.test(line); });
                            done(!onlyWarnings);
                        }
                    });
                });
            });
            it('sass', function (done) {
                mock_1["default"]({
                    'appname': 'FULL TS SASS',
                    'type': 'Full',
                    'ts': 'TypeScript',
                    'sass': 'SASS',
                    'createDir': true
                });
                var templateDest = 'full-ts-sass';
                slushfile_1["default"](function () {
                    process.chdir(path.join(buildPath, templateDest));
                    exec('node_modules/.bin/gulp', function (error, stdout, stderr) {
                        console.log('stdout: ' + stdout);
                        console.log('stderr: ' + stderr);
                        if (error) {
                            console.log('exec error: ' + error);
                            done(error);
                        }
                        if (stderr) {
                            var onlyWarnings = stderr.toString().split('\n')
                                .every(function (line) { return line.indexOf('npm WARN') === 0 || !/\S/.test(line); });
                            done(!onlyWarnings);
                        }
                    });
                });
            });
        });
    });
});
