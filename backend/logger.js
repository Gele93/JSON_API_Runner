import { appendFile } from "fs"

export const log = (text) => {
    const event = createLogEvent(text)

    console.log(event)

    appendFile("eventlog.log", event, (err) => {
        if (err) {
            console.error("failed to write eventlog file")
            return
        }
    })
}

const createLogEvent = (eventText) => `${new Date().toISOString()}: ${eventText}
`;
