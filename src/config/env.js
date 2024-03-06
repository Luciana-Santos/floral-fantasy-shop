const envalid = require('envalid')

const appEnv = envalid.cleanEnv(process.env, {
  PORT: envalid.port(),
  MONGO_URI: envalid.str(),
  PINO_LOG_LEVEL: envalid.str({
    choices: ['fatal', 'error', 'warn', 'info', 'debug', 'trace'],
    default: 'info',
  }),
})

module.exports = appEnv
