# gulp-dotjs-compiler

[![npm](https://img.shields.io/npm/v/gulp-dotjs-compiler.svg?style=flat-square)](https://www.npmjs.com/package/gulp-dotjs-compiler)
[![npm](https://img.shields.io/npm/dt/gulp-dotjs-compiler.svg?style=flat-square)](https://www.npmjs.com/package/gulp-dotjs-compiler)
 

## Guide
This compiler is mainly based on [vohof's](https://github.com/vohof/gulp-dot) ```gulp-dot```, with a little modification.

There are something changed:

- **supports precompiling into javascript**: we can compiler doT templates into javascript
- **supports other file extensions**: we can use a different file extension, such as ```dot``` ```jst```, etc.

## DEMO

[demo](https://github.com/AngusFu/gulp-starter)

## INSTALL

```bash
$ npm install gulp-dotjs-compiler 
```

## HOW TO USE

```javascript
/**
 * deal with js
 */
 var uglify = require('gulp-uglify'),
     concat = require('gulp-concat');

/**
 * add header and footer
 */
var header = require('gulp-header'),
    footer = require('gulp-footer');

var dotCompile = require('gulp-dotjs-compiler');

gulp.task('dot', function () {
    var wrapper = moduleWrap('dotTempl');

    gulp.src(['./src/templates/**/*.html', '!./src/templates/layout.html'])
        .pipe(dotCompile({
        	// if we transfered ```it```
        	// then will compile files into html string
        	// (如果传了it 则认为是编译为 html)
            // it: {data: [2, 4, 5,6]},
			
			// def snippet
			// (传过去的 snippet)
            def: {xxx: 2222},

            // file extension (文件扩展名)
            // ext: 'html',
	
			// exposed name
            dict: 'dotTempl',
			
			// layout
            layout: './src/templates/layout.html'
        }))
        .pipe(concat('dotTempl.js'))
        .pipe(header(wrapper[0] + 'var dotTempl = {};'))
        .pipe(footer('module.exports = dotTempl;' + wrapper[1]))
        .pipe(uglify())
        .pipe(gulp.dest('./build/'));
});

function moduleWrap(modName) {
    var begin = '' +
                '!(function(global, factory) {'+
                    'if (typeof define === \'function\' && (define.cmd || define.amd)) {'+
                        'define(factory);'+
                    '} else if (typeof exports !== \'undefined\' && typeof module !== \'undefined\'){'+
                        'factory(require, exports, module);'+
                    '} else {'+
                        'var mod = {'+
                                'exports: {}'+
                            '},'+
                            'require = function(name) {'+
                                'return global[name];'+
                            '};'+
                        'factory(require, mod.exports, mod);'+
                        'global.' + modName + '= mod.exports;'+
                    '}'+
                '})(this, function(require, exports, module) {',

        end =   '});'

    return [begin, end];
}

```

## LINKS
[https://github.com/vohof/gulp-dot](https://github.com/vohof/gulp-dot)

[https://github.com/outten45/gulp-dot](https://github.com/outten45/gulp-dot)

[https://github.com/kentliau/gulp-dot-precompiler](https://github.com/kentliau/gulp-dot-precompiler)

