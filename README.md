slush-react-express
==============

[![npm version](https://badge.fury.io/js/slush-react-express.svg)](http://badge.fury.io/js/slush-react-express) [![Build Status](https://travis-ci.org/peterjuras/slush-react-express.svg?branch=master)](https://travis-ci.org/peterjuras/slush-react-express)

> A [slush](http://slushjs.github.io) generator for a [React](https://facebook.github.io/react/) app served by [Express](http://expressjs.com/).

#### Changelog

Click [here](CHANGELOG.md) to see recent changes.

## Requirements

Since the generated plain-JavaScript projects are written in ES6 you need to have [node](https://nodejs.org/) v4 or higher and [npm](https://www.npmjs.com/package/npm) v3 or higher for TypeScript projects.

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

Create a new folder for your project. Alternatively, you can also let slush-react-express create a new folder for you automatically.

```bash
mkdir my-react-express-app

cd my-react-express-app
```

Run the generator:

```bash

slush react-express
```

You will now be prompted to give your new React/Express app a name, which will be dasherized and used in its `package.json` file. The chosen name will be used within the server's route and react component as well.

The generator supplies two templates: A minimal template and a full template which includes advanced parts such as gulp builds, tests and more.

## Minimal Template

The minimal template is the quickest way to get started with your React/Express app, and only includes the minimum files that are required to get you started. React (.jsx) files are compiled on the fly in the browser, which means that you don't have to compile them yourself.

### Project structure

```
my-react-express-app/
├── .gitignore
├── package.json
├── server.js                               # Main node entry point
└── public
    ├── javascripts
        ├── main.jsx                        # Main react component and entry point
        └── vendor                          # Vendor folder for babel and React
    ├── stylesheets
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
* No builds required during development! No matter whether you use plain JavaScript, Babel or TypeScript. You will never have to compile during development because everything is compiled on the fly!
* Automatic server reloading and **hot-reloading** of the browser on file changes
* Production builds with minified/stripped files
* TypeScript support
* SASS support
* Sourcemaps support

### Project structure

```
my-react-express-app/
├── .gitignore
├── package.json
├── gulpconfig.js/ts                        # Easy gulpfile configuration
├── gulpfile.js/ts                          # See gulp section below
├── (tsconfig.json)                         # Typescript only - compile options for typescript
├── (tsd.json)                              # Typescript only - type information for typescript
├── src
    ├── client                              # Client side files go here
        ├── app                             # Script files
            ├── config.js                   # Configuration file for jspm
            ├── index.js/tsx                # Main react component and entry point (TypeScript file in src/)
            ├── view
                └── NameLoaderView.js/tsx   # Sample react component (TypeScript file in src/)
            └── style
                └── index.css/scss          # Main app stylesheet
        └── static                          # Static files
            ├── index.html                  # Main browser entry point
            └── favicon.ico                          
    └── server                              # Server side files go here
        ├── route                           # Express routes go here
            └── index.js/ts                 # Sample route
        ├── lib                             #
            └── error-message.js/ts         # Class that describes a server error
        ├── view                            # Express routes go here
            ├── error.js/ts                 # Error React component
            └── layout.js/ts                # Layout React component to generate valid HTML
        ├── app.js/ts                       # Express app definition
        └── server.js/ts                    # Main node entry point
└── test                                    # Mocha tests go here
    └── server
        ├── util                                
            └── address.js/ts               # Sample test util
        ├── appname.js/ts                   # Sample test
        └── listening.js/ts                 # Sample test
```

### Styling

You can choose to use `SASS` or plain `CSS` for the styling in your project.

### Typescript

You can choose between `TypeScript` and `Javascript`. React components will be written in .tsx files if you choose to use TypeScript.

### Running the project

Make sure gulp is installed globally:

```bash
npm install -g gulp
```

You can start your app by running:

```bash
gulp watch
```

Then head to `http://localhost:3000` in your browser. The server will **automatically restart** whenever a server file changes and any client side modification will be **hot-reloaded** without reloading the browser!

### Gulpfile

#### Builds

Builds copy/compile & bundle all your code, put it into a destination folder and run all tests for you. A production build can be triggered by running:

```bash
gulp

# same as running "gulp test"
```

During development, everything can be automated by watching over your source files. The server will be restarted if server side code changes and the browser modules will be **hot-reloaded** in case any client side code changes. This means that you don't even have to reload the browser to see your changes!
You can start watching over your files by running:

```bash
gulp watch
```

#### Tests

To run tests run:

```bash
gulp test
```

By default, the test task will run a full build. To run tests without going through the build process you can run the following command: (Currently JavaScript only)

```bash
npm test
```

## License

MIT
