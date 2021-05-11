# @nexssp/cache

- Just EASY basic caching.. **(experimental version)**

Check how old cache is with: `2 days`, `1d`, `5m`, `2y`, `3.5 hrs`, `1s`. See below for examples.

```js
const myCachePath = cache.setup();
console.log(myCachePath); // Displays setup cache folder.

// Use your own folder for caching like below:
const myCachePath = cache.setup(`${require("os").home()}/mycustomcache`);
console.log(myCachePath);

// Write Object as JSON. keep in mind that this cache will save functions if you have them in your object!
cache.writeJSON(cacheTestFile2, { a: 1, b: 2, c3: 3 });

// check if cache is not older then 1day)
let cacheContent;
if ((cacheContent = cache.exists(cacheTestFile, "1d", true))) {
  // ok we use cache content: cacheContent
}

// Or without true will only check
if (cache.exists(cacheTestFile, "1d")) {
  // ok cache exists and is notread yet
  const cacheContent = cache.read(cacheTestFile);

  // or JSON directly to the object
  const test = cache.readJSON(cacheTestFile);
}

cache.write("my new cache standard file", "Just standard file.. no JSON");

cache.writeJSON("my new cache standard file", { x: 1, y: 2 });
```
