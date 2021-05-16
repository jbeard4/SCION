import path from 'path';
import autoprefixer from 'autoprefixer';
import ExtractTextPlugin from 'extract-text-webpack-plugin';


const postcss = {
  loader: 'postcss-loader',
  options: {
    plugins() { return [autoprefixer({ browsers: 'last 3 versions' })]; },
    sourceMap: true,
  }
};

const styles = {
  test: /\.(scss)$/,
  use: ExtractTextPlugin.extract(['css-loader?sourceMap', postcss, 'sass-loader?sourceMap'])
};

module.exports = {
  entry: './example/_src/js/index.js',
  output: {
    filename: 'example/build/app.js',
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /(node_modules)/,
      use: [{
        loader: 'babel-loader',
        options: {
          presets: [['es2015', {modules: false}]],
        }
      }]
    },
    styles],
  },
  plugins: [
    new ExtractTextPlugin('styles.css'),
  ],
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.join(__dirname, "example/build"),
    compress: true,
    port: 9000,
    open: true,
  },
};