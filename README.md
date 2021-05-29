# @nexssp/cache

- Just EASY basic caching..

Check how old cache is with: `2 days`, `1d`, `5m`, `2y`, `3.5 hrs`, `1s`. See below for examples.

```js
// Example config.js - setup 2 caches. Nothing is done yet.
const cache = require('@nexssp/cache')
const os = require('os')

const cache1 = cache({
  bucket: 'languages',
  cachePath: os.tmpdir(),
  recreateCache: process.argv.includes('--nocache'),
  auto: true, // It will create directory if does not exist.
})

const cache2 = cache({
  recreateCache: process.argv.includes('--nocache'),
})

module.exports = { cache1, cache2 }
```

```js
// program.js - they will only be initialised after cache.start()
// cache.start() returns the path to the cache
const cachePath = cache1.start()

// Write Object as JSON. keep in mind that this cache will save functions if you have them in your object!
cache.writeJSON('mycache.json', { a: 1, b: 2, c3: 3 })

// check if cache is not older then 1day)
// true means that it will return the cache content with the exists method, otherwise true/false
let cacheContent
if ((cacheContent = cache.exists(cacheTestFile, '1d', true))) {
  // ok we use cache content: cacheContent
}

// Or without true will only check
if (cache.exists(cacheTestFile, '1d')) {
  // ok cache exists and is notread yet
  const cacheContent = cache.read(cacheTestFile)

  // or JSON directly to the object
  const test = cache.readJSON(cacheTestFile)
}

cache.write('my new cache standard file', 'Just standard file.. no JSON')

cache.writeJSON('my new cache standard file', { x: 1, y: 2 })
```
