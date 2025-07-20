import fp from 'fastify-plugin'
import mongoose from 'mongoose'
import { config } from '../config/config'

export default fp(async (fastify) => {
    try {
        await mongoose.connect(config.mongoose.url)
        console.log('Database connected ✅')
    } catch (err) {
        console.error(err, 'MongoDB connection error')
        process.exit(1)
    }
})
