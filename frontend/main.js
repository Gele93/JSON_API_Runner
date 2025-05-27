import { methodMap } from "./methodMap.js"

const body = document.getElementById("body")
const api = "http://localhost:3000/api"

const dataState = {
    module: "",
    manual: {
        JSON: "",
        params: []
    }
}

const responseState = {
    data: []
}

const startLoading = () => {
    const resultContainer = document.getElementById("result-container")
    resultContainer.innerHTML = ""
    resultContainer.insertAdjacentHTML("beforeend", "<div class='loader'></div>")
}

const stopLoading = () => {
    const resultContainer = document.getElementById("result-container")
    const loader = document.querySelector(".loader")
    resultContainer.removeChild(loader)
}

const showErrorMessage = (message) => {
    const errorContainer = document.getElementById("error-container")
    errorContainer.innerHTML = ""
    const errorElement = `
    <p class="error-message">
        ${message}
    </p>
    `
    errorContainer.insertAdjacentHTML("beforeend", errorElement)
}

const removeErrorMessage = () => document.getElementById("error-container").innerHTML = ""

const checkMethodValidity = () => {
    const errors = []
    const methods = JSON.parse(dataState.manual.JSON)
    for (const method of methods) {
        if (!methodMap[dataState.module].some(m => m.function == method))
            errors.push(method)
    }
    if (errors.length > 0) {
        let errorMsg = "The following methods were not found:"
        errors.forEach((e, i) => {
            if (i > 0)
                errorMsg += ","
            errorMsg += ` ${e}`
        })
        showErrorMessage(errorMsg)
    }
}

const fetchPostApiCallStack = async (callData) => {
    removeErrorMessage()
    checkMethodValidity()
    startLoading()
    try {
        const response = await fetch(`${api}/callstack`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(callData)
        })

        if (!response.ok)
            throw new Error("failed to fetch")

        const data = await response.json()
        stopLoading()
        return data

    } catch (error) {
        console.error(error)
        showErrorMessage(`Fetching callstack on module ${dataState.module} failed.`)
    }
}

const handleThemeToggle = (e) => {
    const button = e.target
    const currentTheme = button.dataset.theme
    if (currentTheme === "dark") {
        body.classList.remove("dark")
        button.dataset.theme = "light"
        button.textContent = "Toggle dark mode"
    } else {
        body.classList.add("dark")
        button.dataset.theme = "dark"
        button.textContent = "Toggle light mode"
    }
}

const handleAlignToggle = (e) => {
    const button = e.target
    const currentSide = button.dataset.side
    const dataContainer = document.getElementById("data-container")

    if (currentSide === "left") {
        dataContainer.classList.add("reverse")
        button.dataset.side = "right"
        button.textContent = "Align left"
    } else {
        dataContainer.classList.remove("reverse")
        button.dataset.side = "left"
        button.textContent = "Align right"
    }
}

const createTextArea = () => `
<div id="text-area-with-button">
    <textarea id="data-input-text" rows="10" cols="50" placeholder='Insert JSON manually eg.: ["getFibonacci", "multiplyMatrices"]'></textarea>
    <button id="auto-fill">Auto Fill</button>
</div>
`

const createManualParamsSelector = (moduleName) => {
    return `
    <div id="manual-params-selector-container">
    ${methodMap[moduleName].map((method) => {
        return `
    <div class="selector-line param-selector-line">
        <label>${method.function}</label>
        <div class="param-inputs">
        ${method.params.map((param) => {
            return `
            <input type="text" id="${param}" name="${param}" placeholder=${param}></input >        
            `
        }).join(" ")}
        </div>
    </div>
    `
    }).join(" ")}
    </div>
    `
}

const createModuleSelector = () => {
    let element = `
<div id="api-selector-container" class="selector-line">
<label for="api-selector">Choose a module:</label>
<select id="api-selector" name="api-selector">
<option value="">--Please choose a module--</option>
`
    for (const module in methodMap) {
        element += `<option value="${module}">${module}</option>
        `
    }

    element += `
</select>
</div>
`
    return element
}

const createApiSelector = () => {
    const dataInputContainer = document.getElementById("data-input-container")
    const element = createModuleSelector()
    dataInputContainer.insertAdjacentHTML("beforeend", element)
    const apiSelector = document.getElementById("api-selector")
    apiSelector.addEventListener("change", handleApiSelection)
}

const handleAutoFill = () => {
    switch (dataState.module) {
        case "imageService":
            dataState.manual.JSON = `["getImageByName"]`
            document.getElementById("data-input-text").value = `["getImageByName"]`
            break;
        case "mathService":
            dataState.manual.JSON = `["getFibonacci", "multiplyMatrices"]`
            document.getElementById("data-input-text").value = `["getFibonacci", "multiplyMatrices"]`
            break;
        case "userService":
            dataState.manual.JSON = `["getUserProfile"]`
            document.getElementById("data-input-text").value = `["getUserProfile"]`
            break;

        default:
            break;
    }
}

const handleApiSelection = (e) => {
    const dataInputContainer = document.getElementById("data-input-container")
    const manualParamContainer = document.getElementById("manual-params-selector-container")

    if (manualParamContainer) {
        dataInputContainer.removeChild(manualParamContainer)
    }

    const moduleName = e.target.value
    dataState.module = moduleName

    const element = createManualParamsSelector(moduleName)
    dataInputContainer.insertAdjacentHTML("beforeend", element)
}

const handleJsonChange = (e) => {
    dataState.manual.JSON = e.target.value
}

const collectManualParams = () => {
    const manualParamContainer = document.getElementById("manual-params-selector-container")
    const paramLines = manualParamContainer.children

    const paramsData = []

    for (const paramLine of paramLines) {
        const paramData = {
            methodName: "",
            params: []
        }
        paramData.methodName = paramLine.children[0].textContent
        const inputs = paramLine.children[1].children
        for (const param of inputs) {
            paramData.params.push({
                name: param.name,
                value: param.value
            })
        }
        paramsData.push(paramData)
    }

    dataState.manual.params = paramsData
}

const handleManualRun = async () => {
    collectManualParams()

    const callStackData = {
        module: dataState.module,
        callstack: JSON.parse(dataState.manual.JSON),
        params: dataState.manual.params
    }

    responseState.data = []
    const responseData = await fetchPostApiCallStack(callStackData)
    responseState.data = responseData
}

const handleRun = async () => {
    await handleManualRun()
    drawResults()
}

const createNumberResult = (resultData) => `
<div class="result-line">
${resultData.data}
</div>
`
const create2dArrayResult = (resultData) => {
    let element = '<div class="result-line">'

    for (const row of resultData.data) {
        element += "<div>"
        for (const e of row) {
            element += e.toString() + ", "
        }
        element += "</div>"
    }
    element += "</div>"

    return element
}
const createImageResult = (resultData) => {
    return `
<div class="result-line">
    <img src="data:image/png;base64,${resultData.data}">
</div>
`
}

const createArrayOfObjectsResult = (resultData) => {
    let element = '<div class="result-line">'

    for (const object of resultData.data) {
        for (const key in object) {
            element += `<div>${key}: ${object[key]}</div>`
        }
    }
    element += "</div>"

    return element
}

const createResults = (resultData) => {
    switch (resultData.format) {
        case "number":
            return createNumberResult(resultData)
        case "image":
            return createImageResult(resultData);
        case "2dArray":
            return create2dArrayResult(resultData)
        case "arrayOfObjects":
            return createArrayOfObjectsResult(resultData);
        default:
            break;
    }
}

const drawResults = () => {
    let resultsHtml = ""
    for (const resultData of responseState.data) {
        resultsHtml += createResults(resultData)
    }
    const resultContainer = document.getElementById("result-container")
    resultContainer.insertAdjacentHTML("beforeend", resultsHtml)
}


const main = async () => {
    const themeButton = document.getElementById("theme-selector")
    themeButton.addEventListener("click", handleThemeToggle)

    const alignButton = document.getElementById("align-selector")
    alignButton.addEventListener("click", handleAlignToggle)

    createApiSelector()

    const dataInputContainer = document.getElementById("data-input-container")
    dataInputContainer.insertAdjacentHTML("beforeend", createTextArea())

    const autoFillButton = document.getElementById("auto-fill")
    autoFillButton.addEventListener("click", handleAutoFill)

    const textarea = document.getElementById("data-input-text")
    textarea.addEventListener("input", handleJsonChange)

    const runButton = document.getElementById("run")
    runButton.addEventListener("click", handleRun)
}

main()