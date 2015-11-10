module.exports = {
	options: {
		livereload: true
	},
	js: {
		files: ['example/**/*.*', '!**/*.scss'],
	},
	sass: {
		files: ['**/*.scss'],
		tasks: ['sass']
	}
};
