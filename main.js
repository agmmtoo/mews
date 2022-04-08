import { createServer } from 'http'
import { config } from 'dotenv'
import mongoose from 'mongoose'

import app from './express.js'

// load .env
config()

const PORT = process.env.PORT || 3000
const MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/mews'

// set mongoose
mongoose.Promise = global.Promise
mongoose.connect(MONGO_URL)
mongoose.connection.on('error', e => { throw new Error(`Cannot connect database at ${MONGO_URL}\n ${e}`) })

// create server
const server = createServer(app)

server.listen(PORT)
// server.on('error', console.error)
server.on('listening', () => console.log(`server started on ${PORT}`))