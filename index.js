function createFsTraverser (lib) {
  'use strict';
  var q = lib.q,
    TreeTraverser = require('allex_treetraversinglowlevellib')(lib.isArray,q),
    Node = require('allex_nodehelpersserverruntimelib')(lib),
    FsUtils = require('allex_fsutilsserverruntimelib')(lib),
    Path = Node.Path,
    fs = Node.Fs;

  function FsTraverser (rootname, depth, cb, filemask) {
    if (lib.isVal(filemask) && !lib.isString(filemask)) {
      throw new lib.Error('FILEMASK_NOT_A_STRING', 'filemask supplied must be a string like "df"');
    }
    TreeTraverser.call(this, FsUtils.surePath(rootname), depth, cb);
    this.filemask = filemask;
  }
  lib.inherit(FsTraverser, TreeTraverser);
  FsTraverser.prototype.destroy = function () {
    this.filemask = null;
    TreeTraverser.prototype.destroy.call(this);
  };
  FsTraverser.prototype.fetchNodes = function (nodearry) {
    var path = FsUtils.surePath(nodearry),
      d = q.defer(),
      ret = d.promise;
    fs.readdir(path, onReadDir.bind(null, path, this.filemask, d));
    return ret;
  };

  function onReadDir (path, filemask, defer, err, list) {
    if (err) {
      defer.resolve(null);
      defer = null;
      return;
    }
    if (filemask && lib.isArray(list)) {
      return q.all(list.map(fileTypeChecker.bind(null, filemask, path))).
        then(
          onFileTypeChecked.bind(null, defer)
        );
    }
    defer.resolve(list);
    defer = null;
  }

  function fileTypeChecker (filemask, path, diritem) {
    return FsUtils.fileTypePromised(FsUtils.pathForFilename(path,diritem)).then(
      onFileType.bind(null, filemask, diritem)
    );
  }

  function onFileType (filemask, item, type) {
    return q(filemask.indexOf(type)>=0 ? item : null);
  }

  function onFileTypeChecked (defer, list) {
    defer.resolve(list.filter(lib.isString.bind(lib)));
    defer = null;
  }

  return FsTraverser;
}

module.exports = createFsTraverser;
