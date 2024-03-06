const pino = require('pino')
const appEnv = require('../config/env')

module.exports = pino({
  level: appEnv.PINO_LOG_LEVEL,
})
