import * as path from "path";
import * as prettier from "prettier";

interface LanguagesFromPrettier {
	[VSCodeLanguageId: string]: {
		filenames: string[];
		extensions: string[];
		parsers: prettier.ParserOption[];
	}[];
}

const prettierLanguages = prettier.getSupportInfo().languages;
export const VSCodePluginLanguageIds = ["php", "jade", "ruby", "swift", "xml"];
const VSCodeLanguageParsers: {
	[parser: string]: prettier.AllParsers[];
} = {
	// Prettier
	mongo: ["babel", "flow"],
	javascript: ["babel", "flow"],
	javascriptreact: ["babel", "flow"],
	typescript: ["typescript", "babel-ts"],
	typescriptreact: ["typescript", "babel-ts"],
	json: ["json"],
	jsonc: ["json"],
	json5: ["json5"],
	postcss: ["css"],
	css: ["css"],
	less: ["less"],
	scss: ["scss"],
	graphql: ["graphql"],
	markdown: ["markdown"],
	mdx: ["mdx"],
	html: ["html"],
	vue: ["vue"],
	yaml: ["yaml"],
	// Plugins
	php: ["php"],
	jade: ["pug"],
	ruby: ["ruby"],
	swift: ["swift"],
	xml: ["xml"],
};

export function getParserByLangIdAndFilename(
	languageId: string,
	filepath?: string
): prettier.AllParsers {
	if (!filepath) {
		return getParserByLangId(languageId);
	}

	const supportedLanguage = allLanguagesFromPrettier[languageId];
	if (!supportedLanguage) {
		return getParserByLangId(languageId);
	}

	const basename = path.basename(filepath);
	const extname = path.extname(filepath);
	let filenamesAndExtensionsEmptyParser: prettier.ParserOption = "";

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

export const allVSCodeLanguageIds: string[] = [...VSCodePluginLanguageIds];
const allLanguagesFromPrettier: LanguagesFromPrettier = {};

prettierLanguages.forEach((lang) => {
	const {
		filenames = [],
		extensions = [],
		parsers = [],
		vscodeLanguageIds = [],
	} = lang;

	if (vscodeLanguageIds.length > 0) {
		allVSCodeLanguageIds.push(...vscodeLanguageIds);
	}

	vscodeLanguageIds.forEach((vscodeLangId) => {
		if (allLanguagesFromPrettier[vscodeLangId]) {
			allLanguagesFromPrettier[vscodeLangId].push({
				filenames,
				extensions,
				parsers,
			});
		} else {
			allLanguagesFromPrettier[vscodeLangId] = [
				{ filenames, extensions, parsers },
			];
		}
	});
});

function getParserByLangId(languageId: string): prettier.AllParsers {
	const parsers = VSCodeLanguageParsers[languageId];
	return parsers?.[0] ?? "";
}
