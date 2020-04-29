import * as path from 'path';
import * as prettier from 'prettier';

interface LanguagesFromPrettier {
	[vsCodeLanguageId: string]: {
		filenames: string[];
		extensions: string[];
		parsers: prettier.ParserOption[];
	}[];
}

export const pluginVSCodeLanguageIds = ['php', 'jade', 'ruby', 'swift', 'xml'];
const prettierLanguages = prettier.getSupportInfo().languages;
const allVSCodeLanguageParsers: {
	[parser: string]: (prettier.ParserOption | prettier.PluginParserOption)[];
} = {
	// Prettier
	mongo: ['babel', 'flow'],
	javascript: ['babel', 'flow'],
	javascriptreact: ['babel', 'flow'],
	typescript: ['typescript', 'babel-ts'],
	typescriptreact: ['typescript', 'babel-ts'],
	json: ['json'],
	jsonc: ['json'],
	json5: ['json5'],
	postcss: ['css'],
	css: ['css'],
	less: ['less'],
	scss: ['scss'],
	graphql: ['graphql'],
	markdown: ['markdown'],
	mdx: ['mdx'],
	html: ['html'],
	vue: ['vue'],
	yaml: ['yaml'],
	// Plugins
	php: ['php'],
	jade: ['pug'],
	ruby: ['ruby'],
	swift: ['swift'],
	xml: ['xml']
};

export function getParserByLangIdAndFilename(
	languageId: string,
	filepath?: string
): prettier.ParserOption | prettier.PluginParserOption {
	if (!filepath) {
		return getParserByLangId(languageId);
	}

	const supportedLanguage = allLanguagesFromPrettier[languageId];
	if (!supportedLanguage) {
		return getParserByLangId(languageId);
	}

	const basename = path.basename(filepath);
	const extname = path.extname(filepath);
	let filenamesAndExtensionsEmptyParser: prettier.ParserOption = '';

	for (const lang of supportedLanguage) {
		if (lang.filenames.includes(basename)) {
			return lang.parsers[0];
		}
		if (lang.extensions.includes(extname)) {
			return lang.parsers[0];
		}
		if (lang.filenames.length === 0 && lang.extensions.length === 0) {
			filenamesAndExtensionsEmptyParser = lang.parsers[0];
		}
	}

	if (filenamesAndExtensionsEmptyParser) {
		return filenamesAndExtensionsEmptyParser;
	}

	return getParserByLangId(languageId);
}

export const allVSCodeLanguageIds: string[] = [
	...prettierLanguages.reduce((ids: string[], lang) => {
		if (lang.vscodeLanguageIds) {
			ids.push(...lang.vscodeLanguageIds);
		}
		return ids;
	}, []),
	...pluginVSCodeLanguageIds
];

function getParserByLangId(languageId: string): prettier.ParserOption | prettier.PluginParserOption {
	const parsers = allVSCodeLanguageParsers[languageId];
	return parsers?.[0] ?? '';
}

const allLanguagesFromPrettier: LanguagesFromPrettier = prettierLanguages.reduce((obj: any, prettierLang) => {
	const { filenames = [], extensions = [], parsers = [], vscodeLanguageIds = [] } = prettierLang;

	vscodeLanguageIds.forEach(vscodeLangId => {
		if (obj[vscodeLangId]) {
			obj[vscodeLangId].push({ filenames, extensions, parsers });
		} else {
			obj[vscodeLangId] = [{ filenames, extensions, parsers }];
		}
	});

	return obj;
}, {});
