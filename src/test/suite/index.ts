import glob from "glob";
import Mocha from "mocha";
import * as path from "path";

export function run(
	cwd: string,
	cb: (error: any, failures?: number) => void
): void {
	const mocha = new Mocha({
		ui: "tdd",
		useColors: true,
		timeout: 20_000,
	});

	glob("**/**.test.js", { cwd }, (err, files) => {
		if (err) {
			return cb(err);
		}

		files.forEach((f) => mocha.addFile(path.resolve(cwd, f)));

		try {
			mocha.run((failures) => cb(null, failures));
		} catch (err) {
			cb(err);
		}
	});
}
