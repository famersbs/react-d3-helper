var path = require('path');

module.exports = {
    entry: path.resolve(__dirname, 'src', 'browser.js'),
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, 'public/js/'),
    },
	module: {
		/*
		preLoaders:[
			{
			  test: /\.js$/,
			  loaders: [ 'eslint-loader'],
			  include: [
			    path.join(__dirname, 'src')
			  ]
			}
		],*/
		loaders: [
			{
			  test: /\.js$/,
			  loader: 'babel',
			  include: [
			    path.join(__dirname, 'src')
			  ],
			  query: {
			  	presets: [ 'react', 'es2015' ]
			  }
			}
		]
	}
};
