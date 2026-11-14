/* global __dirname */
const { DatabaseSync } = require('node:sqlite');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

// Expo 브리지만 대체하고 실제 TypeScript 쿼리를 SQLite에서 실행한다.
exports.createSqliteRuntime = (overrides = {}) => {
  const sqlite = new DatabaseSync(':memory:');
  const queries = [];
  const execute = (kind, sql, values = []) => {
    queries.push({ kind, sql, values });
    return sqlite.prepare(sql)[kind](...values);
  };
  const db = {
    getAllAsync: async (sql, values) => execute('all', sql, values),
    getFirstAsync: async (sql, values) => execute('get', sql, values),
    runAsync: async (sql, values) => execute('run', sql, values),
    execAsync: async (sql) => sqlite.exec(sql),
    withTransactionAsync: async (action) => {
      sqlite.exec('BEGIN');
      try {
        await action();
        sqlite.exec('COMMIT');
      } catch (error) {
        sqlite.exec('ROLLBACK');
        throw error;
      }
    },
  };
  const root = path.join(__dirname, '../..');
  const modules = new Map();
  const load = (file) => {
    const fullPath = path.resolve(root, file);
    if (modules.has(fullPath)) return modules.get(fullPath).exports;
    const module = { exports: {} };
    modules.set(fullPath, module);
    const code = ts.transpileModule(fs.readFileSync(fullPath, 'utf8'), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
      },
    }).outputText;
    new Function('require', 'module', 'exports', code)(
      (name) => {
        if (Object.hasOwn(overrides, name)) return overrides[name];
        if (
          name === '@services/database/sqlite' ||
          path.resolve(path.dirname(fullPath), name) ===
            path.join(root, 'src/services/database/sqlite')
        ) {
          return { getDatabase: async () => db };
        }
        if (name === '@utils/logger')
          return {
            default: {
              error: (message) => {
                throw Error(message);
              },
            },
          };
        if (name.startsWith('@')) {
          const resolved = name.replace(
            /^@(features|services|store)\//,
            'src/$1/',
          );
          return load(resolved + '.ts');
        }
        if (name.startsWith('.'))
          return load(path.resolve(path.dirname(fullPath), name) + '.ts');
        throw Error(`Unexpected dependency: ${name}`);
      },
      module,
      module.exports,
    );
    return module.exports;
  };
  return { sqlite, db, load, queries };
};
