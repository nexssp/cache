const cache = require("../src/cache");

//   cache,
//   del,
//   fileCachePath,
//   clean,
//   exists,
//   write,
//   writeJSON,
//   read,
//   readJSON,
//   getFileUpdatedDate,

const myCachePath = cache.setup();
console.log("Cache Path", myCachePath);

const cacheTestFile = "mycache1";
console.log(cache.exists(cacheTestFile, "2d", true)); // true means read the cache content
cache.writeJSON(cacheTestFile, { a: 1, b: 2 });
console.log(cache.exists(cacheTestFile, "2d")); // just check without reading
cache.del(cacheTestFile, { sure: true });

const cacheTestFile2 = "mycache2";
cache.writeJSON(cacheTestFile2, { a: 1, b: 2, c3: 3 });
(async () => {
  setTimeout(() => {
    console.log("check cache after 2s");
    console.log(cache.exists(cacheTestFile, "1s")); // check if cache is 1second old
    // Check last updated date
    console.log(cache.getFileUpdatedDate(cache.fileCachePath(cacheTestFile)));

    const newPath = cache.setup(
      require("os").homedir() + "/.nexss/anotherFolderWithCache",
      true // if true, will create folder automatically. Make sure you are at the right path first as it will create all subfolder also.
    );
    cache.write("my new cache standard file", "Just standard file.. no JSON");
    console.log(newPath);
  }, 2000);
})();

// By default cache will use HOME/.nexss/cache dir but you can easly change
// However this library is best to use one cache folder per app.
