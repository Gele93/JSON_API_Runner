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

const fetchPostApiCallStack = async (callData) => {
    try {
        const response = await fetch(`${api}/callstack`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: callData
        })

        if (!response.ok)
            throw new Error("failed to fetch")

        const data = await response.json()
        return data

    } catch (error) {
        console.error(error)
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

const handleAutoFill = () => {
    switch (dataState.module) {
        case "imageService":
            dataState.manual.JSON = `["getImageByName"]`
            document.getElementById("data-input-text").textContent = `["getImageByName"]`
            break;
        case "mathService":
            dataState.manual.JSON = `["getFibonacci", "multiplyMatrices"]`
            document.getElementById("data-input-text").textContent = `["getFibonacci", "multiplyMatrices"]`
            break;
        case "userService":
            dataState.manual.JSON = `["getUserProfile"]`
            document.getElementById("data-input-text").textContent = `["getUserProfile"]`
            break;

        default:
            break;
    }
}

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
            <input type"text" id="${param}" name="${param}" placeholder=${param}></input >        
            `
        }).join(" ")}
        </div>
    </div>
    `
    }).join(" ")}
    </div>
    `
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
    const responseData = await fetchPostApiCallStack(JSON.stringify(callStackData))
    responseState.data = responseData
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
const createImageResult = () => {

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

const handleRun = async () => {
    await handleManualRun()
    drawResults()
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