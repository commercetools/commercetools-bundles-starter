import getBabelPreset from '@commercetools-frontend/babel-preset-mc-app';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import copy from 'rollup-plugin-copy';
import builtins from 'rollup-plugin-node-builtins';
import resolve from 'rollup-plugin-node-resolve';
import external from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';
import postcssCustomProperties from 'postcss-custom-properties';
import postcssColorModFunction from 'postcss-color-mod-function';

import pkg from './package.json';

const { plugins, ...options } = getBabelPreset();

const createPlugins = format => {
  const isFormatEs = format === 'es';
  const isProduction = process.env.NODE_ENV === 'production';
  return [
    external({
      includeDependencies: true
    }),
    babel({
      ...options,
      runtimeHelpers: true,
      sourceMaps: true,
      inputSourceMap: true,
      plugins: [
        ...plugins,
        'react-intl',
        'import-graphql',
        isFormatEs && [
          'transform-rename-import',
          {
            replacements: [{ original: 'lodash', replacement: 'lodash-es' }]
          }
        ]
      ].filter(Boolean)
    }),
    commonjs({
      include: 'node_modules/**'
    }),
    resolve({
      mainFields: ['module', 'main', 'jsnext'],
      preferBuiltins: true,
      modulesOnly: true
    }),
    copy({
      targets:[
        {src: "package.json", dest: "dist/"},
        {src: "README.md", dest: "dist/"},
      ],
      flatten: false
    }),

    builtins(),
    postcss({
      include: ['**/*.mod.css'],
      exclude: ['node_modules/**/*.css'],
      modules: true,
      importLoaders: 1,
      plugins: [
        postcssCustomProperties({
          preserve: false,
          importFrom: require.resolve(
            '@commercetools-uikit/design-system/materials/custom-properties.css'
          )
        }),
        postcssColorModFunction()
      ]
    }),
    isProduction && terser()
  ].filter(Boolean);
};

const input = 'src/index.js';

const FORMAT = {
  CJS: 'cjs',
  ES: 'es'
};
export default [
  {
    input,
    output: {
      file: `dist/${pkg.main}`,
      format: FORMAT.CJS,
      sourcemap: true
    },
    plugins: createPlugins(FORMAT.CJS)
  },
  {
    input,
    output: {
      file: `dist/${pkg.module}`,
      format: FORMAT.ES,
      sourcemap: true
    },
    plugins: createPlugins(FORMAT.ES)
  },
  {
    input: 'src/util/index.js',
    output: {
      format: FORMAT.CJS,
      file: 'dist/util/index.js',
      sourcemap: true
    },
    plugins: createPlugins(FORMAT.CJS)
  },
  {
    input: 'src/constants.js',
    output: {
      format: FORMAT.CJS,
      file: 'dist/constants.js',
      sourcemap: true
    },
    plugins: createPlugins(FORMAT.CJS)
  },
  {
    input: 'src/sdk-context.js',
    output: {
      format: FORMAT.CJS,
      file: 'dist/sdk-context.js',
      sourcemap: true
    },
    plugins: createPlugins(FORMAT.CJS)
  },
  {
    input: 'src/components/index.js',
    output: {
      format: FORMAT.CJS,
      file: 'dist/components/index.js',
      sourcemap: true,
    },
    plugins: createPlugins(FORMAT.CJS)
  },
  {
    input: 'src/hooks/index.js',
    output: {
      format: FORMAT.CJS,
      file: 'dist/hooks/index.js',
      sourcemap: true
    },
    plugins: createPlugins(FORMAT.CJS)
  },
  {
    input: 'src/test-util/index.js',
    output: {
      format: FORMAT.CJS,
      file: 'dist/test-util/index.js',
      sourcemap: true
    },
    plugins: createPlugins(FORMAT.CJS)
  }
];
