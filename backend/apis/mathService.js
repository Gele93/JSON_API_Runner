const fib = {
    0: 0,
    1: 1
}


export const getFibonacci = async (params) => {
    const n = Number(params[0].value)
    if (!n) return 0
    const result = calculateFibonacci(n)
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
    console.log("multiply Matrices")
    let result = "multiply Matrices"
    params.map(p => result += p.name + "-" + p.value)
    return result
}