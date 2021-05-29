'use strict'
/* eslint-disable space-before-function-paren, comma-dangle */

/**
 * Copyright © 2018-2021 Nexss.com / Marcin Polak mapoart@gmail.com. All rights reserved.
 * This source code is governed by MIT license, please check LICENSE file.
 */

/**
 * Creates functionality for Nexss Cache.
 * @constructor
 * @param {string} cachePath - Cache path
 * @param {string} recreateCache - It will recreate cache (disable caching)
 * @param {string} bucket - It will just create subfolder inside cache
 * @param {string} auto - If folder does not exist, it will autocreate it
 */

function nexssCache({ cachePath, recreateCache, bucket, auto } = {}) {
  let _log
  let _fs
  let _path
  let _recreateCacheFlag = !!recreateCache // when flag is true, cache will be reacreated.
  let _cachePath
  const { JSONstringify, JSONparse } = require('@nexssp/extend/json')
  function start() {
    _log = require('@nexssp/logdebug')
    _fs = require('fs')
    _path = require('path')

    const DEFAULT_CACHE_PATH = `${require('os').homedir()}/.nexss/cache`
    _cachePath = cachePath || DEFAULT_CACHE_PATH

    if (bucket) {
      _cachePath += `/${bucket}`
    }

    try {
      _cachePath = _path.normalize(_cachePath)
    } catch (error) {
      throw new TypeError('Path is not the right format.')
    }

    if (!_fs.existsSync(_cachePath)) {
      if (_cachePath && !auto) {
        _log.error(
          `${_cachePath} does not exist. To auto create use cache({auto:true}) and cache1.start()`
        )
      } else {
        _fs.mkdirSync(_cachePath, { recursive: true })
      }
    }

    return _cachePath
  }

  const check = () => {
    if (!_fs) {
      throw new Error('Please use cache.start() first.')
    }
  }

  function recreate(v = true) {
    _recreateCacheFlag = v
  }

  function fileCachePath(p = '') {
    return `${_cachePath}/${p}`
  }

  const getFileUpdatedDate = (path) => {
    const stats = _fs.statSync(path)
    return stats.mtime
  }

  // Clean return list of cache files to delete
  // We think this function can be unsafe.
  // So we just return files to delete.
  const clean = (glob = '*') => {
    const globToClean = `${_cachePath}/${glob}`.replace(/\\/g, '/')

    const fg = require('fast-glob')
    const files = fg.sync(globToClean)

    // files.forEach((file) => {
    //   _fs.unlinkSync(file);
    // });

    return files
  }

  const exists = (path, duration, readCacheContent) => {
    if (_recreateCacheFlag) {
      clean(path)
      return false
    }
    if (duration) {
      const pathToCache = fileCachePath(path)
      if (_fs.existsSync(pathToCache)) {
        const cacheExpiryDate = require('ms')(duration) + getFileUpdatedDate(pathToCache).getTime()
        _recreateCacheFlag = cacheExpiryDate < Date.now()
      } else {
        _recreateCacheFlag = true
      }

      if (_recreateCacheFlag) {
        _log.dy('Cache not found or is not valid:', pathToCache)
      } else if (_fs.existsSync(pathToCache)) {
        if (!readCacheContent) {
          return true
        }
        let resultToString
        // Cache exists so we get result from cache
        resultToString = _fs.readFileSync(pathToCache)
        resultToString = resultToString.toString()
        if (_path.extname(pathToCache) === '.json') {
          resultToString = JSONparse(resultToString)
        }

        return resultToString
      }
    }
  }

  const write = (writePath, content) => {
    check()
    const pathToCache = fileCachePath(writePath)
    _fs.writeFileSync(pathToCache, content)
  }

  const writeJSON = (filename, content) => {
    write(filename, JSONstringify(content))
  }

  const read = (path) => {
    check()
    const pathToCache = fileCachePath(path)
    try {
      const content = _fs.readFileSync(pathToCache)
      return content.toString()
    } catch (error) {
      return new Error('Cache not found.')
    }
  }

  function readJSON(filename) {
    const data = read(filename)
    return JSONparse(data)
  }

  const del = (path) => {
    const pathToCache = fileCachePath(path)
    setImmediate(() => {
      if (_fs.existsSync(pathToCache)) {
        return _fs.unlinkSync(pathToCache)
      }
    })
  }

  return {
    recreate,
    start,
    del,
    fileCachePath,
    clean,
    exists,
    write,
    writeJSON,
    read,
    readJSON,
    getFileUpdatedDate,
  }
}

module.exports = nexssCache
