const gulp = require('gulp');
const shell = require('gulp-shell');

gulp.task('test:build-html', (cb) => {
	const through = require('through2');
	const rename = require('gulp-rename');
	const path = require('path');
	const minifyHtml = require("gulp-minify-html");
	const glob = require('glob');
	const packages = [];
	const keys = new Set();
	packages.forEach((p) => {
		keys.add(p.name);
	});
	glob('./node_modules/**/amd.json', (err, files) => {
		files.forEach((file) => {
			const pkgs = require(file);
			pkgs.forEach((p) => {
				const name = p.name;
				if (!!name && keys.has(name) === false) {
					keys.add(name);
					packages.push(p);
				}
			});
		});
		const head = Buffer.from(`<!DOCTYPE html>
				<html>

				<head>
					<meta charset="UTF-8">
					<meta name="viewport" content="width=device-width,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no" />
					<meta name="apple-mobile-web-app-capable" content="yes" />
					<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
					<meta name="renderer" content="webkit">
					<link rel="stylesheet" type="text/css" href="../css/iconfont.css">
					<link rel="stylesheet" type="text/css" href="../css/daoke.css">
					<script src="https://cdn.jsdelivr.net/npm/katex"></script>
					<script src="../../node_modules/@dojo/loader/loader.js"></script>
					<script type="text/javascript">
(function(){
	require.config({
		baseUrl: '../../node_modules/',
		packages: ${JSON.stringify(packages, null, '\t')}
	});
})();
					</script>
				</head>
				<body>`, 'utf8');
		gulp.src('./src/**/html.ts')
			.pipe(rename((file) => {
				const page_no = file.dirname;
				file.basename = page_no;
				file.extname = '.html';
				file.dirname = '../pages';
			}))
			.pipe(through.obj((chunk, enc, callback) => {
				const page_no = path.basename(chunk.path, '.html');
				const tail = Buffer.from(`
				<script type="text/javascript">
					function uuid(){
						return Math.random().toString().substr(2);
					}
					(function(){
						window.host = \`http://\${window.location.hostname}:8889\`;
						window.mqtt_uri = '';
						require(['daoke/${page_no}/n'],function(main){
							var url = window.location.href;
							main.default(url, {cookie:{}}, {
								actionid: uuid()
							}).then(function(res){
								// 去掉n返回页面的头部内容，只留body内容
								const data = res.data;
								const content = data.match(/<body[\\s|\\S]+>([\\s|\\S]+)<\\/body>/);
								document.body.innerHTML = content[0];
								require(['daoke/${page_no}/b']);
							});
						});
					})();
				</script>
				</body></html>`, 'utf8');
				// const body = chunk.contents.toString('utf8');
				chunk.contents = Buffer.concat([head, /*Buffer.from(body.substring(body.indexOf('`') + 1, body.lastIndexOf('`'))), */tail]);
				// this.push(chunk);
				// callback();
				callback(null, chunk);
			}))	// through.obj
			.pipe(minifyHtml()) //压缩
			.pipe(gulp.dest('./dist/pages/'))
			.on('end', cb);
	});	// glob
});

gulp.task('test:browser-sync', () => {
	const browserSync = require('browser-sync').create();
	browserSync.init({
		files: ['./dist/'],
		server: {
			baseDir: './dist/pages',
			directory: true
		},
		online: false,
		host: '127.0.0.1',
		open: 'external',
		serveStatic: ['./'],
		port: 8000
	});
});

gulp.task('test:watch-tpl', () => {
	const fs = require('fs');
	return gulp.watch('src/**/*.tpl')
		.on('change', (file) => {
			console.debug('bbbbblalala', file);
			const tpl = file.replace('.tpl', '.ts');
			lazy(file, tpl, 0);
		})
		.on('add', (file) => {
			console.debug('lalala', file);
			const tpl = file.replace('.tpl', '.ts');
			const content = fs.readFileSync(file, 'utf8');
			fs.writeFileSync(tpl, `export default \`${content}\`;\n`);
		});
});

function lazy(file, tpl, time) {
	const fs = require('fs');
	const content = fs.readFileSync(file, 'utf8');
	if (time > 50) {
		return;
	}
	if (!content) {
		setTimeout(() => {
			lazy(file, tpl, time + 1);
		}, 50);
	} else {
		fs.writeFileSync(tpl, `export default \`${content}\`;\n`);
	}
}

gulp.task('test:ts', shell.task(`npm run test:ts`));

gulp.task('test:server', shell.task(`mm-server`));

gulp.task('build:tpl', () => {
	const through = require('through2');
	const rename = require('gulp-rename');
	return gulp.src('src/**/*.tpl')
		.pipe(rename((file) => {
			const page_no = 'tpl';
			file.extname = '.ts';
			file.basename = page_no;
		}))
		.pipe(through.obj((chunk, enc, callback) => {
			const content = chunk.contents.toString('utf8');
			chunk.contents = Buffer.from(`export default \`${content}\`;\n`);
			callback(null, chunk);
		}))
		.pipe(gulp.dest('./src'));
});

gulp.task('build:n.ts', () => {
	const through = require('through2');
	const fs = require('fs');
	const path = require('path');
	const time = new Date().getTime();
	return gulp.src('src/*/n.ts')
		.pipe(through.obj(function (file, encode, callback) {
			let str = file.contents.toString();
			const name = path.dirname(file.path).replace(/.*src\//, '');
			const newExp = new RegExp(`t.src\.*${name}\.js.*`);
			str = str.replace(/<script.*mm.js.*<\/script>/, `<script src="./dist/js/mm.js?v=${time}"></script>`);
			str = str.replace(newExp, `t.src = './dist/js/${name}.js?v=${time}';`)
			fs.writeFileSync(file.path, str);
			callback();
		}))
});

gulp.task('test', gulp.series('build:tpl', 'test:build-html', gulp.parallel('test:ts', 'test:server', 'test:watch-tpl', 'test:browser-sync')));

gulp.task('build:webpack', (cb) => {
	const dest = './dist/js/';
	const pack_file_path = `./dist/*/b.js`;
	const path = require('path');
	const webpack = require('webpack');
	const through = require('through');
	const ws = require('webpack-stream');
	return gulp.src([pack_file_path])
		.pipe(((opts) => {
			return through(function (file) {
				file.named = path.basename(path.dirname(file.path));
				this.queue(file);
			});
		})())
		.pipe(ws({
			mode: 'production',
			// mode: 'development',
			plugins: [new webpack.ProvidePlugin({
				$: 'jquery',
				jQuery: 'jquery'
			})],
			optimization: {
				splitChunks: {
					name: 'mm',
					chunks: 'all'
				}
			},
			externals: [
				// "nools" // this is a bad js file
			],
			output: {
				filename: '[name].js',
				globalObject: 'window',
				publicPath: dest
			},
			module: {
				rules: [{
					test: /\.js$/,
					// exclude: /(node_modules|bower_components)/,
					exclude: /core-js|babel|tus-js-client/,
					use: {
						loader: 'babel-loader'
					}
				}]
			}
		}, webpack))
		.on('error', (e) => {
			cb(e);
		})
		.pipe(gulp.dest(dest));
});

gulp.task('build:drop-console', () => {
	const uglify = require('gulp-uglify-es').default;

	return gulp.src('dist/**/*.js')
		.pipe(uglify({
			compress: {
				drop_console: true
			},
			output: {
				comments: false
			}
		}))
		.pipe(gulp.dest(`dist/`));
});

gulp.task('default', gulp.series('build:drop-console', 'build:webpack'));
