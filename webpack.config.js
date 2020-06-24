const path = require("path");

/**@type {import('webpack').Configuration}*/
const config = {
	target: "node",
	node: {
		__dirname: false, // leave the __dirname-behaviour intact
	},
	resolve: {
		extensions: [".ts", ".js"],
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				exclude: /node_modules/,
				use: [
					{
						loader: "ts-loader",
					},
				],
			},
		],
	},
	externals: {
		vscode: "commonjs vscode",
		ignore: "commonjs ignore",
		prettier: "commonjs prettier",
		"prettier-eslint": "commonjs prettier-eslint",
		"prettier-stylelint": "commonjs prettier-stylelint",
		"prettier-tslint": "commonjs prettier-tslint",
	},
	entry: "./src/main.ts",
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "main.js",
		libraryTarget: "commonjs2",
		devtoolModuleFilenameTemplate: "../[resource-path]",
	},
	devtool: "source-map",
};

module.exports = config;
