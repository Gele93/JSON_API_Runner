export const getFibonacci = (params) => {
    console.log("get fibonacci")
    let result = "get fibonacci"
    params.map(p => result += p.name + "-" + p.value)
    return result
}

export const multiplyMatrices = (params) => {
    console.log("multiply Matrices")
    let result = "multiply Matrices"
    params.map(p => result += p.name + "-" + p.value)
    return result
}