import { log } from "./logger.js"
import { methodMap } from "../frontend/utilities/methodMap.js"


/**
 * dispatching incoming calls and calling needed methods from chosen module
 * @param {string} module - chosen module to load
 * @param {string} callstack - chosen methods of the loaded module to invoke
 * @param {Array} params - possible params to invoke the proper methods with
 */
export const dispatchCalls = async (module, callstack, params) => {
    const results = []

    try {
        const modulePath = `./apis/${module}.js`
        log(`loading ${modulePath}`)
        const currentModule = await import(modulePath)

        for (const method of callstack) {
            const resultData = await handleCall(currentModule, method, params)
            const result = {
                data: resultData,
                format: methodMap[module]?.find(m => m.function === method)?.format ?? "unknown"
            }
            results.push(result)
        }
    } catch (error) {
        log(error)
    }

    return results
}

/**
 * handle one call on the apis
 * @param {module} currentModule - loaded module 
 * @param {function} method - chosen method to invoke 
 * @param {Array} paramsData - possible params for the invoked method 
 */
const handleCall = async (currentModule, method, paramsData) => {

    try {
        if (typeof currentModule[method] !== "function")
            throw new Error(`Method ${method} was not found`)

        const params = await getParamsForMethod(method, paramsData)

        log(`awaiting response from ${method}`)
        const result = await currentModule[method](params)

        if (!result)
            throw new Error(`failed to get result for ${method}`)

        log("response received successfully!")
        return result
    } catch (error) {
        throw new Error(`Could not handle call on ${method}: ${error}`)
    }
}

const getParamsForMethod = async (method, paramsData) => {
    const params = paramsData.find(p => p.methodName === method)

    if (!params)
        return []

    return params.params
}