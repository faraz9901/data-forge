import express from "express";
import path from "path";
import http from 'http';
import { Server } from 'socket.io';
import { RateLimiterMemory } from 'rate-limiter-flexible'
import dataServices from "./services/data.services.js";

const __dirname = import.meta.dirname

const app = express();

const rateLimiter = new RateLimiterMemory(
    {
        points: 3, // 3 requests
        duration: 1000, // per second
    })

const server = http.createServer(app);

const io = new Server(server);

app.use(express.static("public"))

io.on('connection', (socket) => {
    socket.on('summarize', async (data) => {

        try {
            //consume the rate limiter
            await rateLimiter.consume(socket.handshake.address).catch((error) => {
                throw new Error("Rate limit exceeded")
            })

            const result = await dataServices.getSummarizedText(data)
            socket.emit('summarized', result)
        } catch (error) {
            socket.emit('error', error.message)
        }
    })

    socket.on('create-mock-data', async (data) => {
        try {
            await rateLimiter.consume(socket.handshake.address).catch((error) => {
                throw new Error("Rate limit exceeded")
            })

            const result = await dataServices.getMockdata(data.schema, data.count)
            socket.emit('mock-data', result)
        } catch (error) {
            socket.emit('error', error.message)
        }
    })
});


app.get("/", (req, res) => {

    const filePath = path.join(__dirname, "..", 'public', "index.html")

    res.sendFile(filePath)
})

export default server