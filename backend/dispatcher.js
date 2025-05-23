import { log } from "./logger.js"

/**
 * dispatching incoming calls and calling needed methods from chosen modules 
 * @param {call[]} calls - array of calls ({module:string, method:string, params:string[]})
 */
export const dispatchCalls = async (calls) => {
    const results = []

    for (const call of calls) {
        const result = await handleCall(call)
        results.push(result)
    }

    return results
}

/**
 * handle one call on the apis
 * @param {call} call - {module, method, params[]} 
 */
const handleCall = async (call) => {
    const { module, method, params } = call
    const modulePath = `./apis/${module}.js`

    try {
        const currentModule = await import(modulePath)

        if (typeof currentModule[method] !== "function")
            throw new error(`Method ${method} was not found in ${currentModule} module`)

        log(`awaiting response from ${method} method of ${modulePath} module with params: ${params}`)
        const result = await currentModule[method]()

        if (!result)
            throw new error(`failed to get result of the ${modulePath} module`)

        log("response received successfully!")
        return result
    } catch (error) {
        log(error)
    }
}