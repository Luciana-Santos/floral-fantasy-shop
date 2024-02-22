const path = require('node:path')

const rootdir = path.dirname(require.main.filename)

module.exports = {
  pathTo: (...paths) => path.join(rootdir, ...paths),
}
