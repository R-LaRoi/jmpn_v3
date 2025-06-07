import express from 'express'
import mongoose from 'mongoose'
import authRoutes from './routes/auth'

const app = express()
app.use(express.json())

app.use('/api/auth', authRoutes)

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/jmpn-fit')

app.listen(4000, () => console.log('API listening on :4000'))