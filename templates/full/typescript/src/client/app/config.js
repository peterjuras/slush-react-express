System.config({
  defaultJSExtensions: true,
  transpiler: "babel",
  babelOptions: {
    "optional": [
      "runtime",
      "optimisation.modules.system"
    ]
  },
  typescriptOptions: {
    "jsx": "react",
    "typeCheck": true,
    "noLib": true,
    "files": [
      "typings/browser.d.ts",
      "jspm_packages/npm/typescript@1.7.5/lib/lib.d.ts"
    ]
  },
  paths: {
    "github:*": "jspm_packages/github/*",
    "npm:*": "jspm_packages/npm/*"
  },

  packages: {
    "src": {
      "main": "index.tsx",
      "defaultExtension": "tsx",
      "meta": {
        "*.js": {
          "loader": "ts"
        },
        "*.jsx": {
          "loader": "ts"
        },
        "*.ts": {
          "loader": "ts"
        },
        "*.tsx": {
          "loader": "ts"
        }
      }
    }
  },

  map: { }
});
