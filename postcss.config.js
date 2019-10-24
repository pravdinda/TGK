const path = require('path');
const postcssPresetEnv = require('postcss-preset-env');

const isDebug = process.env.NODE_ENV !== 'production';

module.exports = () => ({

  plugins: {
    'postcss-import': {
      path: [path.resolve(`${__dirname}/src`)],
    },
    'postcss-preset-env': { browsers: 'last 2 versions', stage: 1 },

  }
});

/**

 'cssnano': {},
 'postcss-cssnext': {},
 */
