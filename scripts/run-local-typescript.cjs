/* eslint-disable @typescript-eslint/no-require-imports -- Node's CommonJS loader hook requires require(). */
// Small local runner for content checks on systems where tsx cannot access
// the OS temporary-user directory. Type checking remains tsc's responsibility.
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const Module = require('node:module');
const resolve = Module._resolveFilename;
Module._resolveFilename = function (request, ...args) {
  return resolve.call(this, request.startsWith('@/') ? path.join(__dirname, '../src', request.slice(2)) : request, ...args);
};
for (const extension of ['.ts', '.tsx']) {
  require.extensions[extension] = (mod, filename) => {
    const result = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020,
        jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
    });
    mod._compile(result.outputText, filename);
  };
}
if (!process.argv[2]) throw new Error('Usage: node scripts/run-local-typescript.cjs <file.ts> [flags]');
require(path.resolve(process.argv[2]));
