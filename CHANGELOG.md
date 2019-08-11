## [Unreleased]

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
