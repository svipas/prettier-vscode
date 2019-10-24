import * as path from 'path';
import * as readPkgUp from 'read-pkg-up';
import * as resolve from 'resolve';

/**
 * Recursively search for a `package.json` upwards containing given package as a dependency or devDependency.
 * @param fspath file system path to start searching from
 * @param pkgName package's name to search for
 * @returns resolved path to prettier
 */
function findPkg(fspath: string, pkgName: string): string | undefined {
  const res = readPkgUp.sync({ cwd: fspath, normalize: false });
  if (!res) {
    return undefined;
  }

  if (
    res.packageJson &&
    ((res.packageJson.dependencies && res.packageJson.dependencies[pkgName]) ||
      (res.packageJson.devDependencies && res.packageJson.devDependencies[pkgName]))
  ) {
    return resolve.sync(pkgName, { basedir: res.path });
  }

  if (res.path) {
    const parent = path.resolve(path.dirname(res.path), '..');
    const { root } = path.parse(fspath);
    if (parent !== root) {
      return findPkg(parent, pkgName);
    }
  }
}

/**
 * Require package explicitly installed relative to given path.
 * Fallback to bundled one if no pacakge was found bottom up.
 * @param fspath file system path starting point to resolve package
 * @param pkgName package's name to require
 * @returns module
 */
export function requireLocalPrettier(fspath: string): typeof import('prettier') | undefined {
  try {
    const modulePath = findPkg(fspath, 'prettier');
    if (modulePath) {
      return require(modulePath);
    }
  } catch {}
}
