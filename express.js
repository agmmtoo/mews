import express from 'express'
import logger from 'morgan'

// routes
import mewsRouter from './routes/mews.router.js'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(logger('dev'))

// routes
app.use('/api/v1/mews', mewsRouter)

app.get('/', async (req, res) => {
    res.status(204).send('welcome, hmm')
})

export default app