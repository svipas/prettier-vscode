# Prettier+ &middot; [![Visual Studio Marketplace](https://img.shields.io/visual-studio-marketplace/v/svipas.prettier-plus.svg)](https://marketplace.visualstudio.com/items?itemName=svipas.prettier-plus) [![Build Status](https://dev.azure.com/svipas/svipas/_apis/build/status/svipas.vscode-prettier-plus?branchName=master)](https://dev.azure.com/svipas/svipas/_build/latest?definitionId=4&branchName=master)

[Prettier](https://prettier.io) (code formatter) for the VS Code. To see the difference between [official Prettier extension](https://github.com/prettier/prettier-vscode) you can take a look at the [CHANGELOG](https://github.com/svipas/vscode-prettier-plus/blob/master/CHANGELOG.md).

## Works with the Tools You Use

<table>
  <tr align="center">
    <td>
      <strong>JavaScript</strong>
      <br />
      <a href="https://facebook.github.io/jsx">JSX</a>
      <br />
      <a href="https://flow.org">Flow</a>
      <br />
      <a href="https://www.typescriptlang.org">TypeScript</a>
      <br />
      <a href="https://json.org">JSON</a>
    </td>
    <td>
      <strong>CSS</strong>
      <br />
      <a href="http://lesscss.org">Less</a>
      <br />
      <a href="https://sass-lang.com">SCSS</a>
      <br />
      <a href="https://styled-components.com">styled-components</a>
      <br />
      <a href="https://github.com/zeit/styled-jsx">styled-jsx</a>
    </td>
    <td>
      <strong>Markdown</strong>
      <br />
      <a href="https://commonmark.org">CommonMark</a>
      <br />
      <a href="https://github.github.com/gfm">GitHub-Flavored Markdown</a>
      <br />
      <a href="https://mdxjs.com">MDX</a>
    </td>
    <td rowspan="2">
      <strong>Plugins</strong>
      <br />
      <a href="https://github.com/prettier/plugin-php">PHP</a>
      <br />
      <a href="https://github.com/prettier/plugin-pug">Pug</a>
      <br />
      <a href="https://github.com/prettier/plugin-ruby">Ruby</a>
      <br />
      <a href="https://github.com/prettier/plugin-swift">Swift</a>
      <br />
      <a href="https://github.com/prettier/plugin-xml">XML</a>
    </td>
  </tr>
  <tr align="center">
    <td>
      <strong>HTML</strong>
      <br />
      <a href="https://vuejs.org">Vue</a>
      <br />
      <a href="https://angular.io">Angular</a>
    </td>
    <td>
      <strong><a href="https://graphql.org">GraphQL</a></strong>
      <br />
      <a href="https://graphql.org/learn/schema">GraphQL Schemas</a>
    </td>
    <td>
      <strong><a href="https://yaml.org">YAML</a></strong>
    </td>
  </tr>
</table>

## Installation

Install through VS Code extensions, search for `Prettier+` by `Benas Svipas`. _If you can't find extension by name try to search by publisher name._

&#x26a0; If you have any other code formatting extensions installed they might take precedence and format your code instead of Prettier+ leading to unexpected results.

## Usage

#### Command palette

```
1. Format Document With... -> Prettier+
2. Format Selection With... -> Prettier+
```

#### Keyboard shortcuts

```
Mac: Shift + Option + F
Windows: Shift + Alt + F
Linux: Ctrl + Shift + I
```

#### Format a file on save

```json
// Format all files on save.
"editor.formatOnSave": true,

// Format per-language file on save.
"[javascript]": {
  "editor.formatOnSave": false
}
```

## Bundled dependencies

These dependencies are bundled with the extension:

- [Prettier (2.0.5)](https://github.com/prettier/prettier)
- [prettier-eslint (11.0.0)](https://github.com/prettier/prettier-eslint)
- [prettier-tslint (0.4.2)](https://github.com/azz/prettier-tslint)
- [prettier-stylelint (0.4.2)](https://github.com/hugomrdias/prettier-stylelint)

After installing this extension you can immediately start to format your code, you don't need to do anything additionally. But if you want to include some integrations or plugins, continue to read below.

## Integrations

#### [ESLint](https://github.com/prettier/prettier-eslint)

1. Install `eslint` **locally** with npm or Yarn.
2. Setup your ESLint configuration.
3. Add `"prettier.eslintIntegration": true` in VS Code settings.

#### [TSLint](https://github.com/azz/prettier-tslint)

1. Install `tslint` **locally** with npm or Yarn.
2. Setup your TSLint configuration.
3. Add `"prettier.tslintIntegration": true` in VS Code settings.

#### [stylelint](https://github.com/hugomrdias/prettier-stylelint)

1. Install `stylelint` **locally** with npm or Yarn.
2. Setup your stylelint configuration.
3. Add `"prettier.stylelintIntegration": true` in VS Code settings.

<hr>

If you have both `"prettier.eslintIntegration"` and `"prettier.tslintIntegration"` enabled in your VS Code settings, then TSLint will be used to lint your TypeScript code. If you would rather use ESLint, disable the TSLint integration by setting `"prettier.tslintIntegration"` to `false`.

## Plugins

&#x26a0; The plugin API is in a beta state. This extension supports only [official plugins](https://prettier.io/docs/en/plugins.html#official-plugins).

- **[PHP](https://github.com/prettier/plugin-php)**: install `prettier` and `@prettier/plugin-php` locally or globally with npm or Yarn.
- **[Pug](https://github.com/prettier/plugin-pug)**: install `@prettier/plugin-pug` locally or globally with npm or Yarn.
- **[Ruby](https://github.com/prettier/plugin-ruby)**: install `@prettier/plugin-ruby` locally or globally with npm or Yarn.
- **[Swift](https://github.com/prettier/plugin-swift)**: install `prettier/plugin-swift` locally or globally with npm or Yarn.
- **[XML](https://github.com/prettier/plugin-xml)**: install `@prettier/plugin-xml` locally or globally with npm or Yarn.

## Settings

<details>
<summary><strong>Prettier settings</strong></summary>

Settings will be read from (listed by priority):

1. [Prettier config file](https://prettier.io/docs/en/configuration.html)
2. `.editorconfig`

Or if there's no Prettier config file:

1. `.editorconfig`
2. VS Code settings (described below with their defaults)

#### prettier.printWidth (default: 80)

Specify the line length that the printer will wrap on. [Learn more here.](https://prettier.io/docs/en/options.html#print-width)

#### prettier.tabWidth (default: 2)

Specify the number of spaces per indentation-level. [Learn more here.](https://prettier.io/docs/en/options.html#tab-width)

#### prettier.singleQuote (default: false)

Use single quotes instead of double quotes. [Learn more here.](https://prettier.io/docs/en/options.html#quotes)

#### prettier.trailingComma (default: 'es5')

Print trailing commas wherever possible when multi-line. (A single-line array, for example, never gets trailing commas.) [Learn more here.](https://prettier.io/docs/en/options.html#trailing-commas)

Valid options:

- `"es5"` - Trailing commas where valid in ES5 (objects, arrays, etc.)
- `"none"` - No trailing commas.
- `"all"` - Trailing commas wherever possible (including function arguments). This requires node 8 or a transform.

#### prettier.bracketSpacing (default: true)

Print spaces between brackets in object literals. [Learn more here.](https://prettier.io/docs/en/options.html#bracket-spacing)

#### prettier.jsxBracketSameLine (default: false)

Put the `>` of a multi-line JSX element at the end of the last line instead of being alone on the next line (does not apply to self closing elements). [Learn more here.](https://prettier.io/docs/en/options.html#jsx-brackets)

#### prettier.parser (default: '')

Specify which parser to use. [Learn more here.](https://prettier.io/docs/en/options.html#parser)

&#x26a0; Prettier automatically infers the parser from the input file path, so you shouldn't have to change this setting.

Both the `babel` and `flow` parsers support the same set of JavaScript features (including Flow type annotations). They might differ in some edge cases, so if you run into one of those you can try `flow` instead of `babel`.

Valid options:

- `""` - Automatically infers the parser from the input file path.
- `"babel"` - Via `@babel/parser` named `babylon` until v1.16.0
- `"babel-flow"` - Same as `babel` but enables Flow parsing explicitly to avoid ambiguity. First available in v1.16.0
- `"babel-ts"` - Similar to `typescript` but uses Babel and its TypeScript plugin. First available in v2.0.0
- `"flow"` - Via `flow-parser`
- `"typescript"` - Via `@typescript-eslint/typescript-estree`. First available in v1.4.0
- `"css"` - Via `postcss-scss` and `postcss-less`, autodetects which to use. First available in v1.7.1
- `"scss"` - Same parsers as `css`, prefers `postcss-scss`. First available in v1.7.1
- `"less"` - Same parsers as `css`, prefers `postcss-less`. First available in v1.7.1
- `"json"` - Via `@babel/parser parseExpression`. First available in v1.5.0
- `"json5"` - Same parser as `json`, but outputs as `json5`. First available in v1.13.0
- `"json-stringify"` - Same parser as `json`, but outputs like `JSON.stringify`. First available in v1.13.0
- `"graphql"` - Via `graphql/language`. First available in v1.5.0
- `"markdown"` - Via `remark-parse`. First available in v1.8.0
- `"mdx"` - Via `remark-parse` and `@mdx-js/mdx`. First available in v1.15.0
- `"html"` - Via `angular-html-parser`. First available in 1.15.0
- `"vue"` - Same parser as `html`, but also formats vue-specific syntax. First available in 1.10.0
- `"angular"` - Same parser as `html`, but also formats angular-specific syntax via `angular-estree-parser`. First available in 1.15.0
- `"lwc"` - Same parser as `html`, but also formats LWC-specific syntax for unquoted template attributes. First available in 1.17.0
- `"yaml` - Via `yaml` and `yaml-unist-parser`. First available in 1.14.0

#### prettier.semi (default: true)

Print semicolons at the ends of statements. [Learn more here.](https://prettier.io/docs/en/options.html#semicolons)

#### prettier.useTabs (default: false)

Indent lines with tabs instead of spaces. [Learn more here.](https://prettier.io/docs/en/options.html#tabs)

#### prettier.proseWrap (default: 'preserve')

By default, Prettier will wrap markdown text as-is since some services use a linebreak-sensitive renderer, e.g. GitHub comment and BitBucket. In some cases you may want to rely on editor/viewer soft wrapping instead, so this option allows you to opt out with `"never"`. [Learn more here.](https://prettier.io/docs/en/options.html#prose-wrap)

Valid options:

- `"preserve"` - Wrap prose as-is. First available in v1.9.0
- `"always"` - Wrap prose if it exceeds the print width.
- `"never"` - Do not wrap prose.

#### prettier.arrowParens (default: 'always')

Include parentheses around a sole arrow function parameter. [Learn more here.](https://prettier.io/docs/en/options.html#arrow-function-parentheses)

Valid options:

- `"always"` - Always include parens. Example: `(x) => x`
- `"avoid"` - Omit parens when possible. Example: `x => x`

#### prettier.jsxSingleQuote (default: false)

Use single quotes instead of double quotes in JSX. [Learn more here.](https://prettier.io/docs/en/options.html#jsx-quotes)

#### prettier.htmlWhitespaceSensitivity (default: 'css')

Specify the global whitespace sensitivity for HTML files. [Learn more here.](https://prettier.io/docs/en/options.html#html-whitespace-sensitivity)

Valid options:

- `"css"` - Respect the default value of CSS `display` property.
- `"strict"` - Whitespaces are considered sensitive.
- `"ignore"` - Whitespaces are considered insensitive.

#### prettier.vueIndentScriptAndStyle (default: false)

Whether or not to indent the code inside `<script>` and `<style>` tags in Vue files. Some people (like the creator of Vue) don’t indent to save an indentation level, but this might break code folding in your editor. [Learn more here.](https://prettier.io/docs/en/options.html#vue-files-script-and-style-tags-indentation)

Valid options:

- `"false"` - Do not indent script and style tags in Vue files.
- `"true"` - Indent script and style tags in Vue files.

#### prettier.endOfLine (default: 'lf')

Specify the end of line used by Prettier. [Learn more here.](https://prettier.io/docs/en/options.html#end-of-line)

Valid options:

- `"lf"` - Line Feed only (`\n`), common on Linux and macOS as well as inside git repos
- `"crlf"` - Carriage Return + Line Feed characters (`\r\n`), common on Windows
- `"cr"` - Carriage Return character only (`\r`), used very rarely
- `"auto"` - Maintain existing line endings (mixed values within one file are normalised by looking at what's used after the first line)

#### prettier.quoteProps (default: 'as-needed')

Change when properties in objects are quoted. [Learn more here.](https://prettier.io/docs/en/options.html#quote-props)

Valid options:

- `"as-needed"` - Only add quotes around object properties where required.
- `"consistent"` - If at least one property in an object requires quotes, quote all properties.
- `"preserve"` - Respect the input use of quotes in object properties.

</details>

<details>
<summary><strong>VS Code specific settings</strong></summary>

These settings are specific to VS Code and need to be set in the VS Code settings file. See the [documentation](https://code.visualstudio.com/docs/getstarted/settings) for how to do that.

#### prettier.eslintIntegration (default: false)

Use [prettier-eslint](https://github.com/prettier/prettier-eslint) to format **JavaScript, TypeScript and Vue**.

#### prettier.tslintIntegration (default: false)

Use [prettier-tslint](https://github.com/azz/prettier-tslint) to format **TypeScript**.

#### prettier.stylelintIntegration (default: false)

Use [prettier-stylelint](https://github.com/hugomrdias/prettier-stylelint) to format **CSS, SCSS and Less**.

#### prettier.requireConfig (default: false)

Require a config file to format code.

#### prettier.ignorePath (default: .prettierignore)

Path to a `.prettierignore` or similar file such as `.gitignore`. Files which match will not be formatted. Set to `null` to not read ignore files. **Restart required.**

#### prettier.disableLanguages (default: [])

List of languages IDs to ignore. **Restart required.** _Disabling a language enabled in a parent folder will prevent formatting instead of letting any other formatter to run._

</details>

## Contributing

Feel free to open issues or PRs!
