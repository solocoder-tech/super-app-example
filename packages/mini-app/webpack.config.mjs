import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as Repack from '@callstack/repack';
import TerserPlugin from 'terser-webpack-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Webpack configuration enhanced with Re.Pack defaults for React Native.
 *
 * Learn about webpack configuration: https://webpack.js.org/configuration/
 * Learn about Re.Pack configuration: https://re-pack.dev/docs/guides/configuration
 */
const STANDALONE = Boolean(process.env.STANDALONE);

export default {
  context: __dirname,
  entry: './index.js',
  resolve: {
    ...Repack.getResolveOptions(),
  },
  module: {
    rules: [
      {
        test: /\.[cm]?[jt]sx?$/,
        use: 'babel-loader',
        type: 'javascript/auto',
      },
      ...Repack.getAssetTransformRules(),
    ],
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        test: /\.(js)?bundle(\?.*)?$/i,
        extractComments: false,
        terserOptions: {
          format: {
            comments: false,
          },
        },
      }),
    ],
  },
  plugins: [
    new Repack.RepackPlugin(),
    new Repack.plugins.ModuleFederationPlugin({
      name: 'MiniApp',
      exposes: {
        './MiniApp': './src/navigation/MainNavigator',
      },
      // 声明共享依赖
      shared: {
        react: {
          singleton: true, // 确保模块全局唯一，避免多实例冲突
          eager: STANDALONE, // 模块直接打包到入口文件，而非动态加载
          requiredVersion: '18.2.0',
        },
        'react-native': {
          singleton: true,
          eager: STANDALONE,
          requiredVersion: '0.71.3',
        },
        '@react-navigation/native': {
          singleton: true,
          eager: STANDALONE,
          requiredVersion: '6.0.14',
        },
        '@react-navigation/native-stack': {
          singleton: true,
          eager: STANDALONE,
          requiredVersion: '6.9.2',
        },
        'react-native-safe-area-context': {
          singleton: true,
          eager: STANDALONE,
          requiredVersion: '4.5.0',
        },
        'react-native-screens': {
          singleton: true,
          eager: STANDALONE,
          requiredVersion: '3.20.0',
        },
      },
    })
  ],
};