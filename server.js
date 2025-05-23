import express from "express"
import { log } from "./backend/logger.js"
import { join, dirname } from "path"
import { fileURLToPath } from "url"
import { readFile, writeFile } from "node:fs/promises"
import { dispatchCalls } from "./backend/dispatcher.js"

const app = express()
const PORT = 3000
const __dirname = dirname(fileURLToPath(import.meta.url))
const staticDir = join(__dirname, "frontend")

app.use("/static", express.static(staticDir))
app.use(express.json())

app.get("/", (req, res) => {
    res.sendFile(join(staticDir, "/index.html"))
})

app.post("/api", async (req, res) => {
    try {
        const calls = req.body

        log(`resolving ${calls.length} incoming api calls`)
        const result = await dispatchCalls(calls)

        if (!result)
            throw new error("Failed to get API results")

        log("Calls resolved successfully")
        res.send(result)
    } catch (error) {
        log(error)
    }
})

app.listen(PORT, function () {
    console.log(`server is running on http://localhost:${PORT}`)
})
