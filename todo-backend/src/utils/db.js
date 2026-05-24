import mongoose from 'mongoose'

export async function connectDB() {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/todo_mern'

    if (mongoose.connection.readyState === 1) {
        return mongoose.connection
    }

    return mongoose.connect(mongoURI)
}
