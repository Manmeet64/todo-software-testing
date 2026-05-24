import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDB } from './utils/db.js'
import todoRoutes from './routes/todoRoutes.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.get('/health', (_req, res) => {
    res.json({ status: 'ok' })
})

app.use('/todos', todoRoutes)

app.use((_req, res) => {
    res.status(404).json({ message: 'Route not found' })
})

async function startServer() {
    try {
        await connectDB()
        app.listen(port, () => {
            console.log(`Todo server running on http://localhost:${port}`)
        })
    } catch (error) {
        console.error('Failed to start server:', error)
        process.exit(1)
    }
}

startServer()
