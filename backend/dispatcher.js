import { error } from "console"

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

        const result = await currentModule[method](...params)
        return result
    } catch (error) {
        console.error(error)
    }
}