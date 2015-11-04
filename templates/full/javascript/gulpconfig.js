// This config file enables you to adjust the default locations and plugin
// behaviors of the gulpfile.
// ----
// The gulpfile offers the following important tasks for you:
// 
// ---- Default ----
// Run "gulp"
// (equals to running "gulp build")
// ----
// Default build task that bundles and copies all source files and moves them to a destination
// location. This task is implicitly called by the test task.
// 
// Parameters:
// --production: Runs a production build which influences the plugins (see below)
// --skip-build: All build actions are skipped
// 
// ---- Watch ----
// Run "gulp watch"
// ----
// Watch task which will incrementally build the app when a file has been modified
// and automatically restarts the express server if necessary.
// 
// Parameters:
// --production: Runs a production build which influences the plugins (see below)
// 
// ---- Test ----
// Run "gulp test"
// ----
// Test task which builds the project and runs the tests in the tests folder through mocha.
// 
// Parameters:
// --production: Runs a production build which influences the build plugins (see below)
// --skip-build: All build actions are skipped
// --skip-del: Compiled JavaScript files will not be deleted from the test directory
//
// Refer to the following readme for more information about these and all other tasks in the gulpfile
// https://github.com/peterjuras/slush-react-express/blob/master/README.md

var config = {
	// Location where the build output will be put
	// default: "build"
	"buildOutDir": "build",
	
	// Client side source files location
	// default: "src"
	"clientSourceDir": "src",
	
	// Client side source files destination
	// default: "public" 
	"clientOutDir": "public",
	
	// React source files location
	// default: "react"
	"clientReactDir": "react",
	
	// Tests source files location
	// default: "tests"
	"testDir": "tests",

	// Node.JS entry point
	// default: "server.js"
	"start": "server.js",
	
	// Specify which plugins are activated for each build
	// type. You can choose between the following values:
	// ----
	// "never": Plugin is never applied
	// "development": Plugin is only applied in a normal build:  "gulp build"
	// "production": Plugin is only applied in a production build: "gulp build --production"
	// "always": Plugin is applied in all build types
	"plugins": {
		// Writes inline sourcemaps to enable debugging
		// default: "development"
		"sourcemaps": "development",
		
		// Removes debug output like 'console.log()' from scripts
		// default: "production"
		"stripDebug": "production",
		
		// Minifies, refactors and strips comments from scripts
		// default: "production"
		"uglify": "production",
		
		// Minifies HTML
		// default: "production"
		"minifyHtml": "production",
		
		// Minifies CSS
		// default: "production"
		"minifyCss": "production"
	},
	
	// React options
	"react": {
		// React entry points. Each entry point will be seperately bundled with the components that it
		// requires
		// ---
		// default: [
		// 	'main.jsx'
		// ]
		"entrypoints": [
			'main.jsx'
		],
		
		// Loads the .min.js React libraries instead of the .js versions from the cdn
		// default: "production"
		"minimizeReactLibraries": "production",
	},
	
	// Browserify options
	"browserify": {
		
		// Specify global libraries that are not bundled by
		// browserify but loaded from a cdn/other location
		// ----
		// You can use them in your React.JS source code via
		// "var React = require('react');"
		// ---
		// default: {
		// 	"react": "React",
		// 	"react-dom": "ReactDOM"
		// }
		"globals": {
			"react": "React",
			"react-dom": "ReactDOM"
		}
	}
}

module.exports = config;