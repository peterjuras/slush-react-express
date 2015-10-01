slush-react-express
==============

> A [slush](http://slushjs.github.io) generator for a [React](https://facebook.github.io/react/) app served by [Express](http://expressjs.com/).

## Installation

Install `slush-react-express` globally:

```bash
npm install -g slush-react-express
```

Remember to install `slush` globally as well, if you haven't already:

```bash
npm install -g slush
```

## Usage

Create a new folder for your project:

```bash
mkdir my-react-express-app
```

Run the generator from within the new folder:

```bash
cd my-react-express-app

slush react-express
```

You will now be prompted to give your new React/Express app a name, which will be dasherized and used in its `package.json` file. The chosen name will be used within the server's route and react component as well.

The generator supplies two templates: A [minimal template](Minimal Template) and a [full template](Full Template) which includes advanced parts such as gulp builds, tests and more.

## Minimal Template 

The minimal template is the quickest way to get started with your React/Express app, and only includes the minimum files that are required to get you started. React (.jsx) files are compiled on the fly in the browser, which means that you don't have to compile them yourself.

### Project structure

```
my-react-express-app/
├── .gitignore
├── package.json
├── server.js                               # Main node entry point
└── public
    └── javascripts
        └── main.jsx                        # Main react component and entry point
    └── stylesheets
        └── index.css                       # Main app stylesheet
    └── index.html                          # Main browser entry point
```
### Running the project

You can start your app by running:

```bash
npm start
```

Then head to `http://localhost:3000` in your browser.

## Full Template

The full template is a great starting point if you want to kickstart a big project with an advanced build system.

### Features
* Automatic gulp builds
* Production builds with minified/stripped files
* Typescript support
* SASS support

### Project structure

```
my-react-express-app/
├── .gitignore
├── package.json
├── gulpfile.js                             # See gulp section below
├── app.js/ts                               # Express app definition
├── server.js/ts                            # Main node entry point
├── (tsconfig.json)                         # Typescript only - compile options for typescript
├── (tsd.json)                              # Typescript only - type information for typescript
├── routes                                  # Express routes go here
    └── index.js/ts                         # Sample route
└── src
    └── react
        └── main.jsx/tsx                    # Main react component and entry point
    └── stylesheets
        └── index.css                       # Main app stylesheet
    └── index.html                          # Main browser entry point
└── tests                                   # Mocha tests go here
    └── test.js/ts                          # Sample test
```

### CSS Preprocessor

You can choose between `CSS` and `SASS` to use as the CSS Preprocessor for your project.

### Typescript

You can choose between `TypeScript` and `Javascript`. React components will be written in .tsx files if you choose to use TypeScript. 

### Running the project

You can start your app by running:

```bash
gulp build

npm start
```

Then head to `http://localhost:3000` in your browser.

### Gulpfile

#### Builds

A full build can be triggered by running:

```bash
gulp build
```

You can automate the builds by starting the watch task. Builds will be kicked off when any .jsx/.tsx or .ts file changes: 

```bash
gulp watch
```
If you want to minify your files and strip debug messages, you can make a production build:

```bash
gulp build --production
```

#### Tests

To run tests run:

```bash
gulp test
```

By default, the test task will run a full build. You can skip the build by running the command with the `--skip-build` flag.

## License

MIT