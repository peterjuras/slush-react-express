var should = require('should'),
  gulp = require('gulp'),
  mockPrompt = require('./util/mock'),
  mockGulpDest = require('mock-gulp-dest')(gulp);

var generator = require('../slushfile');

describe('slush-react-express', function () {
  this.timeout(5000);

  before(function () {
    process.chdir(__dirname);
  });

  describe('Minimal generator', function () {
    beforeEach(function () {
      mockPrompt({ 'appname': 'Test Name', 'type': 'Minimal', 'createDir': false });
    });

    it('should put files in current working directory', function (done) {
      generator.generate(function () {
        mockGulpDest.cwd().should.equal(__dirname);
        mockGulpDest.basePath().should.equal(__dirname);
        done();
      });
    });

    it('should add package.json to project root', function (done) {
      generator.generate(function () {
        mockGulpDest.assertDestContains('package.json');
        done();
      });
    });

    it('should add .gitignore to project root', function (done) {
      generator.generate(function () {
        mockGulpDest.assertDestContains('.gitignore');
        done();
      });
    });

    describe('should add the client files to the public folder', function () {
      it('should add index.html', function (done) {
        generator.generate(function () {
          mockGulpDest.assertDestContains('public/index.html');
          done();
        });
      });

      it('should add index.css', function (done) {
        generator.generate(function () {
          mockGulpDest.assertDestContains('public/stylesheets/index.css');
          done();
        });
      });

      it('should add main.jsx', function (done) {
        generator.generate(function () {
          mockGulpDest.assertDestContains('public/javascripts/main.jsx');
          done();
        });
      });
    });

    it('should add the node server file to the root folder', function (done) {
      generator.generate(function () {
        mockGulpDest.assertDestContains('server.js');
        done();
      });
    });
  });

  describe('Full generator', function () {
    beforeEach(function () {
      mockPrompt({ 'appname': 'Test Name', 'type': 'Full', 'ts': 'JavaScript', 'sass': 'CSS', 'createDir': false });
    });

    it('should put files in current working directory', function (done) {
      generator.generate(function () {
        mockGulpDest.cwd().should.equal(__dirname);
        mockGulpDest.basePath().should.equal(__dirname);
        done();
      });
    });

    it('should add package.json to project root', function (done) {
      generator.generate(function () {
        mockGulpDest.assertDestContains('package.json');
        done();
      });
    });

    it('should add .gitignore to project root', function (done) {
      generator.generate(function () {
        mockGulpDest.assertDestContains('.gitignore');
        done();
      });
    });

    describe('should add static files', function () {
      it('should add favicon.ico', function (done) {
        generator.generate(function () {
          mockGulpDest.assertDestContains('src/client/static/favicon.ico');
          done();
        });
      });

      it('should add index.html', function (done) {
        generator.generate(function () {
          mockGulpDest.assertDestContains('src/client/static/index.html');
          done();
        });
      });
    });

    describe('CSS', function () {
      beforeEach(function () {
        mockPrompt({ 'appname': 'Test Name', 'type': 'Full', 'ts': 'JavaScript', 'sass': 'CSS', 'createDir': false });
      });

      it('should add css file to src by default', function (done) {
        generator.generate(function () {
          mockGulpDest.assertDestContains('src/client/app/style/index.css');
          mockGulpDest.assertDestNotContains('src/client/app/style/index.scss');
          done();
        });
      });
    });

    describe('Sass', function () {
      beforeEach(function () {
        mockPrompt({ 'appname': 'Test Name', 'type': 'Full', 'ts': 'JavaScript', 'sass': 'SASS', 'createDir': false });
      });

      it('should add sass file to src', function (done) {
        generator.generate(function () {
          mockGulpDest.assertDestNotContains('src/client/app/style/index.css');
          mockGulpDest.assertDestContains('src/client/app/style/index.scss');
          done();
        });
      });
    });

    describe('JavaScript', function () {
      beforeEach(function () {
        mockPrompt({ 'appname': 'Test Name', 'type': 'Full', 'ts': 'JavaScript', 'sass': 'CSS', 'createDir': false });
      });

      it('should add the correct gulpfile to project root', function (done) {
        gulp.start('default').once('stop', function () {
          mockGulpDest.assertDestContains('gulpfile.js');
          mockGulpDest.assertDestNotContains('gulpfile.ts');
          done();
        });
      });

      it('should add the correct gulpconfig to project root', function (done) {
        gulp.start('default').once('stop', function () {
          mockGulpDest.assertDestContains('gulpconfig.js');
          mockGulpDest.assertDestNotContains('gulpconfig.ts');
          done();
        });
      });

      it('should add server index.js', function (done) {
        generator.generate(function () {
          mockGulpDest.assertDestContains('src/server/route/index.js');
          // Should not contain Typescript files
          mockGulpDest.assertDestNotContains('src/server/route/index.ts');
          done();
        });
      });

      it('should add client index.js', function (done) {
        generator.generate(function () {
          mockGulpDest.assertDestContains('src/client/app/index.js');
          // Should not contain Typescript files
          mockGulpDest.assertDestNotContains('src/client/app/src/index.tsx');
          done();
        });
      });

      describe('should add tests', function () {
        it('appname test', function (done) {
          generator.generate(function () {
            mockGulpDest.assertDestContains('test/server/appname.js');
            // Should not contain Typescript files
            mockGulpDest.assertDestNotContains('test/server/appname.ts');
            done();
          });
        });

        it('listening test', function (done) {
          generator.generate(function () {
            mockGulpDest.assertDestContains('test/server/listening.js');
            // Should not contain Typescript files
            mockGulpDest.assertDestNotContains('test/server/listening.ts');
            done();
          });
        });


        it('test utils', function (done) {
          generator.generate(function () {
            mockGulpDest.assertDestContains('test/server/util/address.js');
            // Should not contain Typescript files
            mockGulpDest.assertDestNotContains('test/server/util/address.ts');
            done();
          });
        });
      });

      it('should add server.js', function (done) {
        generator.generate(function () {
          mockGulpDest.assertDestContains('src/server/server.js');
          // Should not contain Typescript files
          mockGulpDest.assertDestNotContains('src/server/server.ts');
          done();
        });
      });

      it('should not contain tsconfig.json', function (done) {
        generator.generate(function () {
          mockGulpDest.assertDestNotContains('tsconfig.json');
          done();
        });
      });

      it('should not contain tsd.json', function (done) {
        generator.generate(function () {
          mockGulpDest.assertDestNotContains('tsd.json');
          done();
        });
      });
    });

    describe('TypeScript', function () {
      beforeEach(function () {
        mockPrompt({ 'appname': 'Test Name', 'type': 'Full', 'sass': 'CSS', 'ts': 'TypeScript', 'createDir': false });
      });

      it('should add the correct gulpfile to project root', function (done) {
        gulp.start('default').once('stop', function () {
          mockGulpDest.assertDestNotContains('gulpfile.js');
          mockGulpDest.assertDestContains('gulpfile.ts');
          done();
        });
      });

      it('should add the correct gulpconfig to project root', function (done) {
        gulp.start('default').once('stop', function () {
          mockGulpDest.assertDestNotContains('gulpconfig.js');
          mockGulpDest.assertDestContains('gulpconfig.ts');
          done();
        });
      });

      it('should add index.ts', function (done) {
        generator.generate(function () {
          mockGulpDest.assertDestContains('src/server/route/index.ts');
          // Should not contain JavaScript files
          mockGulpDest.assertDestNotContains('src/server/route/index.js');
          done();
        });
      });

      it('should add index.tsx', function (done) {
        generator.generate(function () {
          mockGulpDest.assertDestContains('src/client/app/src/index.tsx');
          // Should not contain JavaScript files
          mockGulpDest.assertDestNotContains('src/client/app/index.js');
          done();
        });
      });

      describe('should add tests', function () {
        it('appname test', function (done) {
          generator.generate(function () {
            mockGulpDest.assertDestContains('test/server/appname.ts');
            // Should not contain JavaScript files
            mockGulpDest.assertDestNotContains('test/server/appname.js');
            done();
          });
        });

        it('listening test', function (done) {
          generator.generate(function () {
            mockGulpDest.assertDestContains('test/server/listening.ts');
            // Should not contain JavaScript files
            mockGulpDest.assertDestNotContains('test/server/listening.js');
            done();
          });
        });


        it('test utils', function (done) {
          generator.generate(function () {
            mockGulpDest.assertDestContains('test/server/util/address.ts');
            // Should not contain JavaScript files
            mockGulpDest.assertDestNotContains('test/server/util/address.js');
            done();
          });
        });
      });

      it('should add app.ts', function (done) {
        generator.generate(function () {
          mockGulpDest.assertDestContains('src/server/app.ts');
          // Should not contain JavaScript files
          mockGulpDest.assertDestNotContains('server/app/app.js');
          done();
        });
      });

      it('should add server.ts', function (done) {
        generator.generate(function () {
          mockGulpDest.assertDestContains('src/server/server.ts');
          // Should not contain JavaScript files
          mockGulpDest.assertDestNotContains('src/server/server.js');
          done();
        });
      });

      it('should add tsconfig.json', function (done) {
        generator.generate(function () {
          mockGulpDest.assertDestContains('tsconfig.json');
          done();
        });
      });

      it('should add tsd.json', function (done) {
        generator.generate(function () {
          mockGulpDest.assertDestContains('tsd.json');
          done();
        });
      });
    });
  });
});
