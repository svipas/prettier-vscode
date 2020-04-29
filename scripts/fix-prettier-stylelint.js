// Prettier 2.0.0 removed `postcss` parser and `prettier-stylelint` is still using it.
// The package was updated about 3 years ago, instead of waiting of merging the PR or forking it, I decided to manually change `postcss` parser to `css` parser.

const fs = require('fs');
const path = require('path');

(async function main() {
	const filePath = path.resolve('node_modules/prettier-stylelint/src/index.js');
	const fileContent = await fs.promises.readFile(filePath, 'utf-8');
	const replacedParserContent = fileContent.replace('postcss', 'css');

	await fs.promises.writeFile(filePath, replacedParserContent, { encoding: 'utf-8' });
	console.log('fix-prettier-stylelint: prettier-stylelint parser was changed from postcss to css');
})();
