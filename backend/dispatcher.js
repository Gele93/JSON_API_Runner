import { log } from "./logger.js"
import { methodMap } from "../frontend/methodMap.js"

export const dispatchCall = async (call) => {
    const result = await handleCall()
    return result
}

/**
 * dispatching incoming calls and calling needed methods from chosen modules 
 * @param {call[]} calls - array of calls ({module:string, method:string, params:string[]})
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
                format: methodMap[module].find(m => m.function === method).format
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
 * @param {call} call - {module, method, params[]} 
 */
const handleCall = async (currentModule, method, paramsData) => {

    try {
        if (typeof currentModule[method] !== "function")
            throw new Error(`Method ${method} was not found`)

        const params = await getParamsForMethod(method, paramsData)

        log(`awaiting response from ${method} method with params: ${params}`)
        const result = await currentModule[method](params)

        if (!result)
            throw new Error(`failed to get result for ${method}`)

        log("response received successfully!")
        return result
    } catch (error) {
        log(error)
    }
}

const getParamsForMethod = async (method, paramsData) => {
    const params = paramsData.find(p => p.methodName === method)

    if (!params)
        return null

    return params.params
}