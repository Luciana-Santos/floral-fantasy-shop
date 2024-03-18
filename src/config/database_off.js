const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb")
const appEnv = require("./env")
const logger = require("../utils/logger")

let _dbPool

const client = new MongoClient(appEnv.MONGO_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})

const mongoConnect = async () => {
  try {
    const connection = await client.connect()
    logger.info("mongo connection success")
    _dbPool = connection.db()
  } catch (err) {
    logger.fatal(err, `[${err.name}] ${err.message}`)
  }
}

const getDb = () => {
  if (_dbPool) {
    return _dbPool
  }

  throw "No database found"
}

const parseIdFromHexString = (id) => {
  return ObjectId.createFromHexString(id)
}

exports.parseIdFromHexString = parseIdFromHexString
exports.mongoConnect = mongoConnect
exports.getDb = getDb
