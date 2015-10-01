var should = require('should'),
  inquirer = require('inquirer'),
  gulp = require('gulp'),
  path = require('path'),
  mockGulpDest = require('mock-gulp-dest')(gulp);

var generator = require('../slushfile');

describe('slush-react-express', function () {
  this.timeout(10000);

  before(function () {
    process.chdir(__dirname);
  });

  describe('minimal generator', function () {
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

    it('should add the client files to the public folder', function (done) {
      generator.generate(function () {
        mockGulpDest.assertDestContains([
          'public/index.html',
          'public/stylesheets/index.css',
          'public/javascripts/main.jsx'
        ]);
        done();
      });
    });

    it('should add the node server file to the root folder', function (done) {
      generator.generate(function () {
        mockGulpDest.assertDestContains('server.js');
        done();
      });
    });
  });

  describe('full generator', function () {
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

    it('should add a gulpfile to project root', function (done) {
      gulp.start('default').once('stop', function () {
        mockGulpDest.assertDestContains('gulpfile.js');
        done();
      });
    });

    it('should add static files to src', function (done) {
      generator.generate(function () {
        mockGulpDest.assertDestContains([
          'src/favicon.ico',
          'src/index.html'
        ]);
        done();
      });
    });

    describe('css', function () {
      beforeEach(function () {
        mockPrompt({ 'appname': 'Test Name', 'type': 'Full', 'ts': 'JavaScript', 'sass': 'CSS', 'createDir': false });
      });

      it('should add css file to src by default', function (done) {
        generator.generate(function () {
          mockGulpDest.assertDestContains('src/stylesheets/index.css');
          mockGulpDest.assertDestNotContains('src/stylesheets/index.scss');
          done();
        });
      });
    });

    describe('sass', function () {
      beforeEach(function () {
        mockPrompt({ 'appname': 'Test Name', 'type': 'Full', 'ts': 'JavaScript', 'sass': 'SASS', 'createDir': false });
      });

      it('should add sass file to src', function (done) {
        generator.generate(function () {
          mockGulpDest.assertDestNotContains('src/stylesheets/index.css');
          mockGulpDest.assertDestContains('src/stylesheets/index.scss');
          done();
        });
      });
    });

    describe('javascript', function () {
      beforeEach(function () {
        mockPrompt({ 'appname': 'Test Name', 'type': 'Full', 'ts': 'JavaScript', 'sass': 'CSS', 'createDir': false });
      });

      it('should add javascript files by default', function (done) {
        generator.generate(function () {
          mockGulpDest.assertDestContains('routes/index.js');
          mockGulpDest.assertDestContains('src/react/main.jsx');
          mockGulpDest.assertDestContains('tests/test.js');
          mockGulpDest.assertDestContains('app.js');
          mockGulpDest.assertDestContains('server.js');
        
          // Should not contain Typescript files
          mockGulpDest.assertDestNotContains('routes/index.ts');
          mockGulpDest.assertDestNotContains('src/react/main.tsx');
          mockGulpDest.assertDestNotContains('tests/test.ts');
          mockGulpDest.assertDestNotContains('app.ts');
          mockGulpDest.assertDestNotContains('server.ts');
          mockGulpDest.assertDestNotContains('tsconfig.json');
          mockGulpDest.assertDestNotContains('tsd.json');
          done();
        });
      });
    });

    describe('typescript', function () {
      beforeEach(function () {
        mockPrompt({ 'appname': 'Test Name', 'type': 'Full', 'sass': 'CSS', 'ts': 'TypeScript', 'createDir': false });
      });

      it('should add typescript files', function (done) {
        generator.generate(function () {
          mockGulpDest.assertDestNotContains('routes/index.js');
          mockGulpDest.assertDestNotContains('src/react/main.jsx');
          mockGulpDest.assertDestNotContains('tests/test.js');
          mockGulpDest.assertDestNotContains('app.js');
          mockGulpDest.assertDestNotContains('server.js');
        
          // Should contain Typescript files
          mockGulpDest.assertDestContains('routes/index.ts');
          mockGulpDest.assertDestContains('src/react/main.tsx');
          mockGulpDest.assertDestContains('tests/test.ts');
          mockGulpDest.assertDestContains('app.ts');
          mockGulpDest.assertDestContains('server.ts');
          mockGulpDest.assertDestContains('tsconfig.json');
          mockGulpDest.assertDestContains('tsd.json');
          done();
        });
      });
    });
  });
});

function mockPrompt(answers) {
  inquirer.prompt = function (prompts, done) {

    [].concat(prompts).forEach(function (prompt) {
      if (!(prompt.name in answers)) {
        answers[prompt.name] = prompt.default;
      }
    });

    done(answers);
  };
} 