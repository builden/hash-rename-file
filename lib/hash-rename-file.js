var gulp = require('gulp');
var md5 = require('gulp-md5');
var rename = require('gulp-rename');
var replace = require('gulp-replace');

var fs = require('fs');
var path = require('path');
var async = require('async');
var glob = require('glob-all');
var s = require('underscore.string');
var log = require('debug')('hash-rename-file');
var _ = require('lodash');

module.exports = function hashRenameFile(srcGlob, destPath, opt, cb) {
  if (typeof opt === 'function') {
    cb = opt;
    opt = {};
  }
  opt.num = opt.num || 7;

  if (opt.type === 'tp') {
    handleDep('.plist', srcGlob, destPath, opt, cb);
  } else if (opt.type === 'fnt') {
    handleDep('.fnt', srcGlob, destPath, opt, cb);
  } else if (opt.type === 'spine') {
    handleDep('.atlas', srcGlob, destPath, opt, cb);
  } else {
    gulp.src(srcGlob, { base: opt.base })
      .pipe(md5(opt.num))
      .pipe(gulp.dest(destPath))
      .on('finish', cb);
  }
};

function getFileListByExt(globList, ext) {
  var fileList = glob.sync(globList);
  _.remove(fileList, function (file) {
    return (path.extname(file) !== ext);
  });
  return fileList;
}

// 处理有依赖的文件
//   1. 先找到对应的图片资源
//   2. 对图片进行hash，并修改图片的文件名
//   3. 修改关联文件的文件名，hash值同图片
//   4. 替换关联文件中图片名
function handleDep(ext, srcGlob, destPath, opt, cb) {
  var files = getFileListByExt(srcGlob, ext);
  async.map(files, function (relatedFile, callback) {
    log('handle file: ' + relatedFile);
    var info = path.parse(relatedFile);
    var png = path.join(info.dir, info.name + '.png');
    if (!fs.existsSync(png)) {
      log('%s match [%s] not exist', ext, png);
      return callback();
    }
    hashFile(relatedFile, png, destPath, opt, callback, ext);
  }, cb);
}

function hashFile(relatedFile, imgPath, destPath, opt, cb, ext) {
  function hashRelatedFile(f, callback) {
    if (ext === '.atlas') {
      async.series({
        'atlas': function (ccb) {
          renameAndreplaceFile(relatedFile, imgPath, f.path, destPath, opt, ccb);
        },
        'json': function (ccb) {
          var jsonFile = s.strLeftBack(relatedFile, '.') + '.json';
          renameAndreplaceFile(jsonFile, imgPath, f.path, destPath, opt, ccb);
        }
      }, callback)
    } else {
      renameAndreplaceFile(relatedFile, imgPath, f.path, destPath, opt, callback);
    }
  }

  async.series([
    function (callback) {
      gulp.src(imgPath)
        .pipe(md5(opt.num))
        .on('data', function (f) {
          hashRelatedFile(f, callback);
        });
    },
    function (callback) {
      gulp.src(imgPath, { base: opt.base })
        .pipe(md5(opt.num))
        .pipe(gulp.dest(destPath))
        .on('finish', callback);
    }
  ], cb);
}

// 修改关联文件的文件名，并修改文件中的图片名
function renameAndreplaceFile(file, srcImgPath, destImgPath, destPath, opt, cb) {
  console.log(file);
  var hash = getHash(destImgPath);
  gulp.src(file, { base: opt.base })
    .pipe(rename(function (path) {
      path.basename += '_' + hash;
      console.log(path.basename);
    }))
  .pipe(replace(path.basename(srcImgPath), path.basename(destImgPath)))
    .pipe(gulp.dest(destPath))
    .on('finish', cb);
}

function getHash(filename) {
  var info = path.parse(filename);
  return s.strRightBack(info.name, '_');
}