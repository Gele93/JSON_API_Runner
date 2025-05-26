import { log } from "../logger.js"

const fib = {
    0: 0,
    1: 1
}


export const getFibonacci = async (params) => {
    const n = Number(params.find(p => p.name === "n").value)
    if (!n) return 0
    const result = calculateFibonacci(n)
    log("Fibonacci calculated successfully")
    return result
}

const calculateFibonacci = (n) => {
    if (fib.hasOwnProperty(n)) {
        return fib[n];
    }

    else {
        const num = calculateFibonacci(n - 1) + calculateFibonacci(n - 2);
        fib[n] = num;
        return num;
    }
}


export const multiplyMatrices = (params) => {
    const array1 = JSON.parse(params.find(p => p.name === "array1").value)
    const array2 = JSON.parse(params.find(p => p.name === "array2").value)

    if (!array1 || !array2)
        throw new Error("missing parameter for multiply Matrices")

    checkArraysValidity(array1, array2)

    const result = Array.from({ length: array1.length }, () => Array(array2[0].length).fill(0))

    for (let r = 0; r < result.length; r++) {
        for (let c = 0; c < result[r].length; c++) {
            const a = array1[r]
            const b = getColumn(array2, c)
            result[r][c] = multiplyArrays(a, b)
        }
    }
    
    log("Matrices Multiplied successfully!")
    return result
}

const getColumn = (array, c) => {
    const column = []
    for (let r = 0; r < array.length; r++) {
        column.push(array[r][c])
    }
    return column
}

const multiplyArrays = (a1, a2) => {
    let result = 0
    for (let i = 0; i < a1.length; i++) {
        result += a1[i] * a2[i]
    }
    return result
}



const checkArraysValidity = (array1, array2) => {
    if (!array1.length)
        throw new Error("missing array")

    if (!array1[0].length)
        throw new Error("missing array")

    if (array1.some(a => a.length !== array1[0].length) || array2.length !== array1[0].length)
        throw new Error("array lengths not matching")
}