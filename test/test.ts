require('should');
import gulp = require('gulp');
import mockPrompt from './util/mock';
import path = require('path');
import mockGulpDestModule = require('mock-gulp-dest');
const mockGulpDest = mockGulpDestModule(gulp);

import generate from '../slushfile';

describe('slush-react-express', function () {
  this.timeout(5000);

  before(() => {
    process.chdir(__dirname);
  });

  describe('Minimal generator', () => {
    beforeEach(() => {
      mockPrompt({ 'appname': 'Test Name', 'type': 'Minimal', 'createDir': true });
    });

    it('should put files in test-name directory', done => {
      generate(() => {
        mockGulpDest.cwd().should.equal(__dirname);
        mockGulpDest.basePath().should.equal(path.join(__dirname, 'test-name'));
        done();
      });
    });

    it('should add package.json to project root', done => {
      generate(() => {
        mockGulpDest.assertDestContains('package.json');
        done();
      });
    });

    it('should add .gitignore to project root', done => {
      generate(() => {
        mockGulpDest.assertDestContains('.gitignore');
        done();
      });
    });

    describe('should add the client files to the public folder', () => {
      it('should add index.html', done => {
        generate(() => {
          mockGulpDest.assertDestContains('public/index.html');
          done();
        });
      });

      it('should add index.css', done => {
        generate(() => {
          mockGulpDest.assertDestContains('public/stylesheets/index.css');
          done();
        });
      });

      it('should add main.jsx', done => {
        generate(() => {
          mockGulpDest.assertDestContains('public/javascripts/main.jsx');
          done();
        });
      });

      it('should add vendor libraries to the vendor folder', done => {
        generate(() => {
          mockGulpDest.assertDestContains('public/javascripts/vendor/babel-core.browser.5.8.34.js');
          mockGulpDest.assertDestContains('public/javascripts/vendor/react.0.14.3.js');
          mockGulpDest.assertDestContains('public/javascripts/vendor/react-dom.0.14.3.js');
          done();
        })
      });
    });

    it('should add the node server file to the root folder', done => {
      generate(() => {
        mockGulpDest.assertDestContains('server.js');
        done();
      });
    });
  });

  describe('Full generator', () => {
    beforeEach(() => {
      mockPrompt({ 'appname': 'Test Name', 'type': 'Full', 'ts': 'JavaScript', 'sass': 'CSS', 'createDir': true });
    });

    it('should put files in current working directory', done => {
      generate(() => {
        mockGulpDest.cwd().should.equal(__dirname);
        mockGulpDest.basePath().should.equal(path.join(__dirname, 'test-name'));
        done();
      });
    });

    it('should add package.json to project root', done => {
      generate(() => {
        mockGulpDest.assertDestContains('package.json');
        done();
      });
    });

    it('should add .gitignore to project root', done => {
      generate(() => {
        mockGulpDest.assertDestContains('.gitignore');
        done();
      });
    });

    describe('should add static files', () => {
      it('should add favicon.ico', done => {
        generate(() => {
          mockGulpDest.assertDestContains('src/client/static/favicon.ico');
          done();
        });
      });

      it('should add index.html', done => {
        generate(() => {
          mockGulpDest.assertDestContains('src/client/static/index.html');
          done();
        });
      });
    });

    describe('CSS', () => {
      beforeEach(() => {
        mockPrompt({ 'appname': 'Test Name', 'type': 'Full', 'ts': 'JavaScript', 'sass': 'CSS', 'createDir': true });
      });

      it('should add css file to src by default', done => {
        generate(() => {
          mockGulpDest.assertDestContains('src/client/app/style/index.css');
          mockGulpDest.assertDestNotContains('src/client/app/style/index.scss');
          done();
        });
      });
    });

    describe('Sass', () => {
      beforeEach(() => {
        mockPrompt({ 'appname': 'Test Name', 'type': 'Full', 'ts': 'JavaScript', 'sass': 'SASS', 'createDir': true });
      });

      it('should add sass file to src', done => {
        generate(() => {
          mockGulpDest.assertDestNotContains('src/client/app/style/index.css');
          mockGulpDest.assertDestContains('src/client/app/style/index.scss');
          done();
        });
      });
    });

    describe('JavaScript', () => {
      beforeEach(() => {
        mockPrompt({ 'appname': 'Test Name', 'type': 'Full', 'ts': 'JavaScript', 'sass': 'CSS', 'createDir': true });
      });

      it('should add the correct gulpfile to project root', done => {
        generate(() => {
          mockGulpDest.assertDestContains('gulpfile.js');
          mockGulpDest.assertDestNotContains('gulpfile.ts');
          done();
        });
      });

      it('should add the correct gulpconfig to project root', done => {
        generate(() => {
          mockGulpDest.assertDestContains('gulpconfig.js');
          mockGulpDest.assertDestNotContains('gulpconfig.ts');
          done();
        });
      });

      it('should add server index.js', done => {
        generate(() => {
          mockGulpDest.assertDestContains('src/server/route/index.js');
          // Should not contain Typescript files
          mockGulpDest.assertDestNotContains('src/server/route/index.ts');
          done();
        });
      });

      it('should add client index.js', done => {
        generate(() => {
          mockGulpDest.assertDestContains('src/client/app/index.js');
          // Should not contain Typescript files
          mockGulpDest.assertDestNotContains('src/client/app/src/index.tsx');
          done();
        });
      });

      describe('should add tests', () => {
        it('appname test', done => {
          generate(() => {
            mockGulpDest.assertDestContains('test/server/appname.js');
            // Should not contain Typescript files
            mockGulpDest.assertDestNotContains('test/server/appname.ts');
            done();
          });
        });

        it('listening test', done => {
          generate(() => {
            mockGulpDest.assertDestContains('test/server/listening.js');
            // Should not contain Typescript files
            mockGulpDest.assertDestNotContains('test/server/listening.ts');
            done();
          });
        });


        it('test utils', done => {
          generate(() => {
            mockGulpDest.assertDestContains('test/server/util/address.js');
            // Should not contain Typescript files
            mockGulpDest.assertDestNotContains('test/server/util/address.ts');
            done();
          });
        });
      });

      it('should add server.js', done => {
        generate(() => {
          mockGulpDest.assertDestContains('src/server/server.js');
          // Should not contain Typescript files
          mockGulpDest.assertDestNotContains('src/server/server.ts');
          done();
        });
      });

      it('should not contain tsconfig.json', done => {
        generate(() => {
          mockGulpDest.assertDestNotContains('tsconfig.json');
          done();
        });
      });

      it('should not contain tsd.json', done => {
        generate(() => {
          mockGulpDest.assertDestNotContains('tsd.json');
          done();
        });
      });
    });

    describe('TypeScript', () => {
      beforeEach(() => {
        mockPrompt({ 'appname': 'Test Name', 'type': 'Full', 'sass': 'CSS', 'ts': 'TypeScript', 'createDir': true });
      });

      it('should add the correct gulpfile to project root', done => {
        generate(() => {
          mockGulpDest.assertDestNotContains('gulpfile.js');
          mockGulpDest.assertDestContains('gulpfile.ts');
          done();
        });
      });

      it('should add the correct gulpconfig to project root', done => {
        generate(() => {
          mockGulpDest.assertDestNotContains('gulpconfig.js');
          mockGulpDest.assertDestContains('gulpconfig.ts');
          done();
        });
      });

      it('should add index.ts', done => {
        generate(() => {
          mockGulpDest.assertDestContains('src/server/route/index.ts');
          // Should not contain JavaScript files
          mockGulpDest.assertDestNotContains('src/server/route/index.js');
          done();
        });
      });

      it('should add index.tsx', done => {
        generate(() => {
          mockGulpDest.assertDestContains('src/client/app/src/index.tsx');
          // Should not contain JavaScript files
          mockGulpDest.assertDestNotContains('src/client/app/index.js');
          done();
        });
      });

      describe('should add tests', () => {
        it('appname test', done => {
          generate(() => {
            mockGulpDest.assertDestContains('test/server/appname.ts');
            // Should not contain JavaScript files
            mockGulpDest.assertDestNotContains('test/server/appname.js');
            done();
          });
        });

        it('listening test', done => {
          generate(() => {
            mockGulpDest.assertDestContains('test/server/listening.ts');
            // Should not contain JavaScript files
            mockGulpDest.assertDestNotContains('test/server/listening.js');
            done();
          });
        });


        it('test utils', done => {
          generate(() => {
            mockGulpDest.assertDestContains('test/server/util/address.ts');
            // Should not contain JavaScript files
            mockGulpDest.assertDestNotContains('test/server/util/address.js');
            done();
          });
        });
      });

      it('should add app.ts', done => {
        generate(() => {
          mockGulpDest.assertDestContains('src/server/app.ts');
          // Should not contain JavaScript files
          mockGulpDest.assertDestNotContains('server/app/app.js');
          done();
        });
      });

      it('should add server.ts', done => {
        generate(() => {
          mockGulpDest.assertDestContains('src/server/server.ts');
          // Should not contain JavaScript files
          mockGulpDest.assertDestNotContains('src/server/server.js');
          done();
        });
      });

      it('should add tsconfig.json', done => {
        generate(() => {
          mockGulpDest.assertDestContains('tsconfig.json');
          done();
        });
      });

      it('should add tsd.json', done => {
        generate(() => {
          mockGulpDest.assertDestContains('tsd.json');
          done();
        });
      });
    });
  });
});
