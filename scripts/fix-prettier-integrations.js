const fs = require('fs');
const path = require('path');

(async function main() {
	// Prettier 2.0.0 removed postcss parser and prettier-stylelint is still using it.
	const prettierStylelintPath = path.resolve('node_modules/prettier-stylelint/src/index.js');
	const prettierStylelintFileContent = await fs.promises.readFile(prettierStylelintPath, 'utf-8');
	const prettierStylelintReplacedParserContent = prettierStylelintFileContent.replace('postcss', 'css');

	await fs.promises.writeFile(prettierStylelintPath, prettierStylelintReplacedParserContent, { encoding: 'utf-8' });
	console.log('prettier-stylelint parser was changed from postcss to css');

	// prettier-tslint contains peer dependency of prettier ^1.7.4 which fails with "npm ERR! peer dep missing".
	const prettierTslintPath = path.resolve('node_modules/prettier-tslint/package.json');
	const prettierTslintFileContent = await fs.promises.readFile(prettierTslintPath, 'utf-8');
	const prettierTslintReplacedPeerDependencyContent = prettierTslintFileContent.replace(
		'"prettier": "^1.7.4"',
		'"prettier": "^2.0.0"'
	);

	await fs.promises.writeFile(prettierTslintPath, prettierTslintReplacedPeerDependencyContent, { encoding: 'utf-8' });
	console.log('prettier-tslint peer dependency prettier was changed from ^1.7.4 to ^2.0.0');
})();
