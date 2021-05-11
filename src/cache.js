require("@nexssp/extend")("json");

var baseCachePath = require("os").homedir() + "/.nexss/cache";
var recreateCacheFlag = false;
const log = require("@nexssp/logdebug");
const fs = require("fs"),
  { extname } = require("path");

function fileCachePath(p) {
  return `${baseCachePath}/${p}`;
}

function recreateCache(v = true) {
  recreateCacheFlag = v;
}

function setup(cacheLocation, mkdir) {
  if (cacheLocation) baseCachePath = cacheLocation;
  if (!fs.existsSync(baseCachePath)) {
    if (baseCachePath && !mkdir) {
      log.error(
        `${baseCachePath} does not exist. To auto create use second parameter cache(path, true)`
      );
    } else {
      fs.mkdirSync(baseCachePath, { recursive: true });
    }
  }
  return require("path").normalize(baseCachePath);
}

const getFileUpdatedDate = (path) => {
  const stats = fs.statSync(path);
  return stats.mtime;
};

const clean = (glob) => {
  if (!glob) {
    throw "specify glob for cache.clean";
  }
  const globToClean = `${baseCachePath}/${glob}`.replace(/\\/g, "/");

  const fg = require("fast-glob");
  fg.sync(globToClean).forEach((file) => {
    fs.unlinkSync(file);
  });

  return true;
};

const exists = (path, duration, readCacheContent) => {
  if (recreateCacheFlag) {
    return false;
  }
  if (duration) {
    const pathToCache = fileCachePath(path);
    if (fs.existsSync(pathToCache)) {
      const cacheExpiryDate =
        require("ms")(duration) + getFileUpdatedDate(pathToCache).getTime();
      recreateCache = cacheExpiryDate < Date.now();
    } else {
      recreateCache = true;
    }

    if (recreateCache) {
      log.dy("Cache not found or is not valid.");
    } else if (fs.existsSync(pathToCache)) {
      if (!readCacheContent) {
        return true;
      }
      let resultToString;
      //Cache exists so we get result from cache
      if (extname(pathToCache) !== ".json") {
        resultToString = fs.readFileSync(pathToCache);
        resultToString = resultToString.toString();
      } else {
        resultToString = fs.readFileSync(pathToCache);
        resultToString = resultToString.toString().JSONparse();
      }

      return resultToString;
    }
  }
};

const write = (path, content) => {
  const pathToCache = fileCachePath(path);
  setImmediate(() => {
    fs.writeFileSync(pathToCache, content);
  });
};

const writeJSON = (filename, content) => {
  setImmediate(() => {
    write(filename, content.JSONstringify());
  });
};

const read = (path) => {
  let pathToCache;
  pathToCache = fileCachePath(path);
  const content = fs.readFileSync(pathToCache);
  return content.toString();
};

function readJSON(filename) {
  let data = read(filename);
  return data.JSONparse();
}

const del = (path, { sure } = {}) => {
  const pathToCache = fileCachePath(path);

  if (!sure) {
    log.warn(
      `cache.del function needs to have second parameter as {sure:true} eg. cache.del("abc",{sure:true}) to allow for deletion.`,
      `Check if ${pathToCache} is the right cache file to delete and add missing option. It's just for safe development.`
    );
    return;
  }

  setImmediate(() => {
    if (fs.existsSync(pathToCache)) {
      return fs.unlinkSync(pathToCache);
    }
  });
};

module.exports = {
  recreateCache,
  setup,
  del,
  fileCachePath,
  clean,
  exists,
  write,
  writeJSON,
  read,
  readJSON,
  getFileUpdatedDate,
};
