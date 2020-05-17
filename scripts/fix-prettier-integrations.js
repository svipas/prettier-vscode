const fs = require("fs");
const path = require("path");

/**
 * @param {string} modulePath
 * @param {string} searchValue
 * @param {string} replaceValue
 */
async function monkeyPatchNodeModule(modulePath, searchValue, replaceValue) {
	modulePath = path.resolve(modulePath);
	const fileContent = (await fs.promises.readFile(modulePath, "utf-8")).replace(
		searchValue,
		replaceValue
	);
	await fs.promises.writeFile(modulePath, fileContent);
}

(async function main() {
	// Prettier 2.0.0 removed postcss parser and prettier-stylelint is still using it.
	await monkeyPatchNodeModule(
		"node_modules/prettier-stylelint/src/index.js",
		"postcss",
		"css"
	);
	console.log("prettier-stylelint parser was changed from postcss to css");

	// prettier-tslint contains peer dependency of prettier ^1.7.4 which fails with "npm ERR! peer dep missing".
	await monkeyPatchNodeModule(
		"node_modules/prettier-tslint/package.json",
		'"prettier": "^1.7.4"',
		'"prettier": "^2.0.0"'
	);
	console.log(
		"prettier-tslint peer dependency prettier was changed from ^1.7.4 to ^2.0.0"
	);
})();
