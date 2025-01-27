import express from 'express'
import logger from 'morgan'
import cors from 'cors'
import moment from 'moment/moment.js'
import router from './routes/api/contacts.js'
import fs from 'fs/promises'
import dotenv from 'dotenv'

import authRouter from './routes/api/auth-router.js'

dotenv.config()
const app = express()

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json())

app.use('/api/users', authRouter)

app.use(async (req, res, next) => {
  const {method, url} = req
  const date = moment().format('DD-MM-YYYY_hh:mm:ss');
  await fs.appendFile("./public/server.log", `\n ${method}, ${url}, ${date}`)
  next()

})

app.use('/api/contacts', router)


app.use((req, res, next) => {
  res.status(404).json({ message: 'Not found' })
  next()
})

app.use((err, req, res, next) => {
  const {status = 500, message = "Server error"} = err;
  res.status(status).json({ message, })
})

export default app
