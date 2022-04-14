import express from 'express'
import logger from 'morgan'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'

// error handler
import error from './error-handler.js'

// routes
import mewsRouter from './routes/mews.router.js'
import userRouter from './routes/user.router.js'
import authRouter from './routes/auth.router.js'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(logger('dev'))
app.use(cors())
app.use(helmet())
app.use(compression())

// routes
app.use('/api/v1/mews', mewsRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/auth', authRouter)

app.get('/', async (req, res) => {
    res.status(418).send('*confuse*')
})

app.use(error)

export default app
