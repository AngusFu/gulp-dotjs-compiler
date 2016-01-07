// based on gulp-dot
// https://github.com/vohof/gulp-dot
module.exports = function(config) {
  'use strict';

  var stream = require('stream'),
      doT = require('dot'),
      gutil = require('gulp-util'),
      _ = require('lodash'),
      fs = require('fs'),
      fm = require('json-front-matter'),
      path = require('path'),
      Transform = stream.Transform,
      dot = new Transform({objectMode: true}),
      PluginError = gutil.PluginError,
      base = '',
      out,
      compiled,
      str;

  config = config || {};
  
  if (typeof config.it !== 'undefined') config.useString = true;
  if (!config.dict) config.dict = 'render';
 
  var ext = config.ext || 'html',
      regex = new RegExp('/\.' + ext + '$/');

  _.merge(config, {it: {}, def: {
    loadfile: function(filename) {
      filename = filename.replace(regex,'');
      var file = fs.readFileSync(path.resolve(base, filename + '.' + ext));
      out = fm.parse(file.toString());
      _.extend(config.def, out.attributes);

      return out.body;
    }
  }});

  dot._transform = function(file, encoding, next) {
    if (file.isStream()) {
      this.emit(
        'error', new PluginError('gulp-dot', 'Streaming not supported')
      );
    } else if (file.isNull()) {
      this.push(file); // pass along
      return next();
    }

    base = file.base;

    if (config.hasOwnProperty('layout')) {
      out = fm.parse(file.contents.toString());
      _.extend(config.def, {content: out.body});
      _.extend(config.def, out.attributes);
      str = fs.readFileSync(config.layout);

      if ((new RegExp(path.basename(config.layout))).test(file.path)) {
        this.push(file);
        return next();
      }
    } else {
      out = fm.parse(file.contents.toString());
      _.extend(config.def, out.attributes);
      str = out.body;
    }

    compiled = doT.template(
      str,
      null,
      config.def
    );
    
    var relatiive = file.path.replace(base, '');
    relatiive = relatiive.slice(0, relatiive.lastIndexOf('.')).replace(/\\|\//, '.');

    var compiledString = config.dict + '[\'' + relatiive + '\'] = '
                          + compiled.toString() + ';';
    
    file.path = gutil.replaceExtension(file.path, !config.useString ? '.js' : '.html');
    file.contents = new Buffer(!config.useString ? compiledString :  compiled(config.it));
    this.push(file);
    next();
  };

  return dot;
};
