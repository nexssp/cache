/* eslint-disable comma-dangle */

module.exports = {
  nexsstests: [
    {
      type: 'equal',
      params: [
        () => {
          // Just testing write,read cache, twice
          const { cache2 } = require('./cache.config')

          const cachePath = cache2.start(true)
          console.log('cachePath:', cachePath)
          const file1 = 'myfilesaved'
          const file2 = 'myfilesaved2'
          const content1 = 'mycontent 12345'

          cache2.writeJSON(file2, { a: 1 })
          const content2 = cache2.readJSON(file2)
          cache2.write(file1, content1)
          cache2.write(file1, content1)
          const readContent2 = cache2.read(file1)
          const readContent3 = cache2.read(file1)
          return readContent2 + readContent3 + JSON.stringify(content2)
        },
        /^mycontent 12345mycontent 12345{"a":1}$/,
        {
          exitCode: 12,
        },
      ],
    },
  ],
}
