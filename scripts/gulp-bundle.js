const through = require('through2');
const path = require('path');
const applySourceMap = require('vinyl-sourcemaps-apply');
const fs = require('fs-extra');
const rollup = require('rollup');
const rollupTypescript = require('rollup-plugin-typescript');
const typescript = require('typescript');
const rollupResolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const log = require('./utils').log;

exports.gulpBundle = function(options) {
    const opts = Object.assign(
        {
            format: 'iife',
            type: 'bundle',
            sourceMap: true,
        },
        options,
    );

    return through.obj(function(file, encoding, callback) {
        const outputPath = file.path.replace(/\.ts/, `.${opts.type}.js`);
        const name = path
            .parse(file.path)
            .name.replace(/-([a-z])/g, g => {
                return g[1].toUpperCase();
            })
            .replace(/\.ts/, '');

        rollup
            .rollup({
                input: file.path,
                plugins: [
                    rollupTypescript({
                        typescript: typescript,
                        target: 'es6',
                        lib: ['es5', 'es6', 'dom', 'es7', 'esnext'],
                        experimentalDecorators: true,
                        moduleResolution: 'node',
                        exclude: ['dist'],
                    }),
                    rollupResolve({
                        jsnext: true,
                        extensions: ['.ts', '.js', '.json'],
                    }),
                    commonjs(),
                ],
                onwarn(warning) {
                    let { code } = warning;

                    if (
                        // Suppress known error message caused by TypeScript compiled code with Rollup
                        // https://github.com/rollup/rollup/wiki/Troubleshooting#this-is-undefined
                        code === 'THIS_IS_UNDEFINED' ||
                        // Suppress errors regarding un-used exports. These may be left behind
                        // after DEBUG stripping and Rollup removed them anyway.
                        code === 'UNUSED_EXTERNAL_IMPORT'
                    ) {
                        return;
                    }

                    console.log(`Rollup warning: ${warning.message}`);
                },
            })
            .then(res => {
                res
                    .generate({
                        format: opts.format,
                        name: name,
                        sourcemap: opts.sourceMap,
                    })
                    .then(code => {
                        code.map.file = outputPath;
                        file.originalPath = file.path;
                        file.path = outputPath;
                        file.contents = new Buffer(code.code);
                        applySourceMap(file, code.map);
                        callback(null, file);
                    });
            })
            .catch(err => {
                log(`Error: ${JSON.stringify(err)}`, 4, 'Bundle');
                callback(null, file);
            });
    });
};
