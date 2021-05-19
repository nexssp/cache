const { cache1, cache2 } = require('./cache.config')
const assert = require('assert')

const cachePath = cache2.start()

const DEFAULT_CACHE_PATH = require('path').normalize(`${require('os').homedir()}/.nexss/cache`)

assert.deepStrictEqual(cachePath, DEFAULT_CACHE_PATH, 'During setup function')

const file1 = 'myfilesaved'
const content1 = 'mycontent 12345'

cache2.write(file1, content1)
cache2.write(file1, content1)

const readContent2 = cache2.read(file1)
assert.deepStrictEqual(readContent2, content1, 'Content read by cache.read does not match')
console.log(readContent2)

cache1.start()
const readContent1 = cache1.read(file1)
console.log(readContent1)

let cacheContent
// Automatically reads the content during checking
if ((cacheContent = cache2.exists(file1, '1d', true))) {
  console.log('content: ', cacheContent)
}

// console.log(cache1.setup(true));
// cache1.writeJSON('test1', { x: 1 });

// console.log(cache2.setup(true));
// cache2.writeJSON('test234', { x: 1 });

// cache1.writeJSON('test1', { x: 1 });
