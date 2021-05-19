/* eslint-disable comma-dangle */

const cache = require('../src/cache')
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
