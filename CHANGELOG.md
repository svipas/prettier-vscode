## [Unreleased]

## 4.2.2 (July 7, 2020)

- Update all dependencies across whole project.
- Change project file names convention.
- Update `README`.

## 4.2.1 (June 25, 2020)

- Update `.vscodeignore`.

## 4.2.0 (June 24, 2020)

- Update all dependencies across whole project.
- Use Yarn instead of npm.
- Use webpack instead of Parcel.
- Fix `Cannot find module 'core-js/modules/es.array.iterator'` by adding `core-js` dependency manually.

## 4.1.2 (June 9, 2020)

- Update all dependencies across whole project including `prettier-eslint` to `11.0.0`.

## 4.1.1 (May 26, 2020)

- Update script for fixing prettier integrations and add it to `.vscodeignore`.
- Fix formatting of VS Code `settings.json` file by adding special language selector.

## 4.1.0 (May 25, 2020)

- Add missing `scope` parameter for several configs.
- Update all dependencies across whole project including `prettier-eslint` to `10.1.1`.

## 4.0.2 (May 17, 2020)

- Simplify script to fix prettier integrations.
- Reformat project with new settings.
- Update all dependencies.
- Add `vscode:publish` script.
- Update `README`.

## 4.0.1 (April 30, 2020)

- Update `README`.

## 4.0.0 (April 29, 2020)

- Change project indentation to tabs.
- Update all dependencies across whole project including Prettier to `2.0.5` version (https://prettier.io/blog/2020/03/21/2.0.0.html).
- Change project filename convention to kebab-case.
- Create utils for tests instead of `ExtensionTest` class with static methods.
- Change default value for `trailingComma` to `es5`.
- Change default value for `arrowParens` to `always`.
- Change default value for `endOfLine` to `lf`.
- Remove the `version` parameter from `prettier.getSupportInfo()`.
- Add `babel-ts` parser.
- Fix `prettier-stylelint` parser by manually changing it from `postcss` to `css`.
- Fix `prettier-tslint` peer dependency `prettier` by manually changing it from `^1.7.4` to `^2.0.0`.

## 3.6.6 (March 9, 2020)

- Update all dependencies across whole project.
- Change filename convention to use camelCase and hyphen for folders.
- Refactor extension.

## 3.6.5 (February 25, 2020)

- Update all dependencies across whole project including TypeScript to 3.8

## 3.6.4 (February 13, 2020)

- Update all dependencies across whole project.
- Update `README`.
- Refactor extension.

## 3.6.3 (January 19, 2020)

- Update all dependencies across whole project.
- Fix tests and increase tests timeout from 10s to 20s.
- Rename `test` dir to `test-fixtures` dir.
- Properly return `exitCode` after tests.

## 3.6.2 (December 22, 2019)

- Update all dependencies.
- Fix `prettier.eslintIntegration` by using npm instead of Yarn.

## 3.6.1 (December 18, 2019)

- Update all dependencies.
- Publish extension with `--yarn` flag in `vsce` command.

## 3.6.0 (December 13, 2019)

- Update all dependencies.
- Set `target` in `tsconfig.json` to `ES2017` instead of `es6` and remove `lib` key.
- Refactor extension logic to make it easier to maintain and to reduce some boilerplate.

## 3.5.2 (December 9, 2019)

- Set `extensionKind` to `["workspace"]` in `package.json`.

## 3.5.1 (December 7, 2019)

- Update all dependencies across whole project.

## 3.5.0 (December 4, 2019)

- Update all dependencies across whole project.
- Update `LICENSE` year.
- Increase minimum VS Code version to `1.30.0`.
- Set `extensionKind` to `["ui"]` in `package.json`.
- Refactor extension to newer TypeScript features and replace \*Sync to async API.
- Rename `extension.ts` to `main.ts`.
- Rename all files to use hyphen (`-`).
- Add global node modules paths of Yarn and npm while searching for plugin dirs.
- Disable tests for macOS since they are failing without any proper reason.

## 3.4.0 (November 18, 2019)

- Add support for official `XML` plugin.

## 3.3.0 (November 18, 2019)

- Update all dependencies across whole project including `prettier-eslint` to `9.0.1` which fixes issues with ESLint 6.

## 3.2.0 (November 15, 2019)

- Update all dependencies across whole project including Prettier to [1.19.1](https://prettier.io/blog/2019/11/09/1.19.0.html).
- Add `postcss` and `mongo` language parsers.
- Add new `vueIndentScriptAndStyle` setting which was introduced in Prettier 1.19.0.

## 3.1.0 (October 29, 2019)

- Register `graphql` and `vue` languages.
- Add tests for `graphql` and `vue` languages.
- Add `.editorconfig` to config file watches.
- Move check for disabled languages upper in `PrettierEditProvider.format()`.

## 3.0.0 (October 27, 2019)

- Update all dependencies across whole project.
- Move `setUsedModule()` to `sendToOutput()` in `PrettierEditProvider`.
- Update `azure-pipelines.yml` to use Node 12 and fix triggers.
- Change status bar text from `Prettier` to `Prettier+`.
- Set `extensionKind` to `workspace` in `package.json`.
- Update `README.md` to include bundled dependencies url, improve documentation of supported languages, integrations, plugins, etc.
- Remove `vue` from `disableLanguages` because Vue is supported in Prettier 1.15 version.
- Move `eslint`, `tslint` and `stylelint` integrations to separate file `integrations.ts` (out from `utils.ts`) and `require()` (load) dependency only when it's needed and cache it in-memory.
- Remove local prettier support.
- Remove unnecessary settings from `test.code-workspace` file.
- Add support for official plugins.
- Refactor tests to contain `actual` and `expected` file instead of having expected result hard-coded into tests.

## 2.0.0 (August 16, 2019)

- Refactor output message to include filename, language id and parser after every format.
- Change default parser from `'none'` to `''` (empty string).
- Refactor `requireLocalPrettier()` to return only local prettier module otherwise return `undefined`.
- Fix prettier resolution by first checking if local prettier exists and only after that use bundled version.
- Refactor `getSupportedLanguages()` to properly get local prettier.
- Refactor whole get parser implementation, now it should format way more Untitled files and resolve to a better parser which means it will format code way better and output would be as expected.
- Refactor whole get Prettier config implementation it wouldn't double check Prettier config file and even if `requireConfig` would be true and config file is missing it will fallback to default settings which means instead of error and returned existing text your code will be formatted.
- Update some dependencies.
- Remove `rangeStart` and `rangeEnd` support which was never used.
- Rename `resolveConfig()` to `resolvePrettierConfig()`.
- Use production build in tests instead of development.

## 1.2.0 (August 13, 2019)

- Replace webpack with parcel.
- Keep `node_modules` because of bundled dependencies, but ignore unnecessary files as much as possible in `.vscodeignore`.

## 1.1.1 (August 11, 2019)

- Remove some `externals` from webpack (bundle everything).

## 1.1.0 (August 11, 2019)

- Add `.eslintignore` and `azure-pipelines.yml` to `.vscodeignore`.
- Update `README.md`.
- Remove message from `requireLocalPkg()` and rename it to `requireLocalPrettier()`.
- Fix messages after format in `PrettierEditProvider.format()`.
- Bundle extension with webpack.
- Declare types for `prettier`, `prettier-eslint`, `prettier-tslint`, `prettier-stylelint` modules.
- Remove Windows from Azure Pipelines because even if everything is OK some tests are failing and issues is unknown.

## 1.0.0 (August 4, 2019)

- Fork [prettier-vscode](https://github.com/prettier/prettier-vscode) (1.8.1).
- Overall project cleanup.
- Replace NPM with Yarn.
- Change `rootDir` from `.` to `src` in `tsconfig.json`.
- Fix all descriptions and add more parsers to `prettier.parser` and set default parser to `none` in `package.json`.
- Refactor `README.md`.
- Refactor whole `src` directory.

### Dependencies

- Update all dependencies across whole project including Prettier to [1.18.2](https://prettier.io/blog/2019/06/06/1.18.0.html) and fix vulnerability issues.
- Remove `vscode` dependency and add `@types/vscode` with `vscode-test`, this is a new approach for extension usage [#70175](https://github.com/microsoft/vscode/issues/70175).
- Add `glob` and `@types/glob` dependencies for `mocha` tests.
- Remove `cross-env` dependency because it's unnecessary since we are using now `vscode-test`.

### Scripts

- Create `watch` script for `tsc --watch` and use `compile` script only for compiling with `tsc` without `--watch` flag.
- Create `pretest` script to compile and install dependencies.
- Refactor `test` script to run `./out/test/runTest.js` instead of `./node_modules/vscode/bin/test`.
- Remove `version` script.

### Tests

- Replace Travis with Azure Pipelines (Mac, Windows, Linux).
- Add tests for `stylelint`.
- Replace `assert.equal` (deprecated) to `assert.strictEqual`.
- Refactor `format()` in `format.test.ts` to properly reject if Thenable rejected.
- Minor refactor for `eslint`, `ignore` and `tslint` tests.
- Refactor and fix tslint (`testTslint`) and eslint (`testEslint`) configs.
- Move all `test*` directories to `test/*` directory.
