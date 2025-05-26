import { methodMap } from "./methodMap.js"
const body = document.getElementById("body")
const root = document.getElementById("root")
const api = "http://localhost:3000/api"

const dataState = {
    inputType: "manual",
    module: "",
    manual: {
        JSON: "",
        params: []
    },
    dropDown: {
        method: "",
        params: []
    }
}

const responseState = {
    data: []
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

const createTextArea = () => `<textarea id="data-input-text" rows="10" cols="50" placeholder='Insert JSON manually eg.: ["getFibonacci", "multiplyMatrices"]'></textarea>`


const handleMethodSelection = (e) => {
    const dataInputContainer = document.getElementById("data-input-container")
    const currentParamsContainer = document.getElementById("params-selector-container")
    if (currentParamsContainer)
        dataInputContainer.removeChild(currentParamsContainer)

    const element = `
<div id="params-selector-container" class="selector-line">
<label for="params">Enter params:</label>
<input type="text" id="params" name="params" placeholder="Params separated by commas">
</div>
`
    dataState.dropDown.method = e.target.value
    dataInputContainer.insertAdjacentHTML("beforeend", element)
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
    const currentMethodSelectorContainer = document.getElementById("method-selector-container")
    const currentParamsContainer = document.getElementById("params-selector-container")
    const manualParamContainer = document.getElementById("manual-params-selector-container")

    if (currentMethodSelectorContainer)
        dataInputContainer.removeChild(currentMethodSelectorContainer)

    if (currentParamsContainer)
        dataInputContainer.removeChild(currentParamsContainer)

    if (manualParamContainer) {
        dataInputContainer.removeChild(manualParamContainer)
    }

    const moduleName = e.target.value
    dataState.module = moduleName

    if (dataState.inputType === "dropdown") {
        const element = createMethodSelector(moduleName)
        dataInputContainer.insertAdjacentHTML("beforeend", element)
        const methodSelector = document.getElementById("method-selector")
        methodSelector.addEventListener("change", handleMethodSelection)
    } else if (dataState.inputType === "manual") {
        const element = createManualParamsSelector(moduleName)
        dataInputContainer.insertAdjacentHTML("beforeend", element)

    }
}

const createMethodSelector = (moduleName) => {
    let element = `
<div id="method-selector-container" class="selector-line">
<label for="method-selector">Choose a method:</label>
<select id="method-selector" name="method-selector">
<option value="">--Please choose a method--</option>
`

    for (const method of methodMap[moduleName]) {
        element += `<option value="${method.function}">${method.function}</option>
        `
    }

    element += `
</select>
</div>
`
    return element
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

const handleManualSelection = (dataInputContainer) => {
    createApiSelector()
    dataInputContainer.insertAdjacentHTML("beforeend", createTextArea())
    const textarea = document.getElementById("data-input-text")
    textarea.addEventListener("input", handleJsonChange)
}

const handleInputTypeChange = (e) => {
    const inputType = e.target.value
    const dataInputContainer = document.getElementById("data-input-container")
    switch (inputType) {
        case "dropdown":
            dataInputContainer.innerHTML = ""
            dataState.inputType = "dropdown"
            createApiSelector()
            break;
        case "manual":
            dataInputContainer.innerHTML = ""
            dataState.inputType = "manual"
            handleManualSelection(dataInputContainer)
            break;

        default:
            break;
    }
}

const collectDropDownParams = () => {
    dataState.dropDown.params = []
    const paramsString = document.getElementById("params").value
    paramsString
        .split(",")
        .map(p => p.trim())
        .filter(p => p !== "")
        .forEach(param => {
            dataState.dropDown.params.push(param)
        });
}


const fetchPostApiCall = async (callData) => {
    try {
        const response = await fetch(`${api}/call`, {
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

const handleDropDownRun = async () => {
    collectDropDownParams()
    responseState.data = []
    const callData = {
        module: dataState.module,
        method: dataState.dropDown.method,
        params: dataState.dropDown.params
    }
    console.log(callData)
    //const responseData = await fetchPostApiCall(JSON.stringify(callData))
    //responseState.data = responseData
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

const createResults = () => {
    return `
    <div id="results">
    ${responseState.data}
    </div>
`
}

const drawResults = () => {
    const resultContainer = document.getElementById("result-container")
    resultContainer.insertAdjacentHTML("beforeend", createResults())
}

const handleRun = async () => {
    switch (dataState.inputType) {
        case "dropdown":
            await handleDropDownRun()
            drawResults()
            break;

        case "manual":
            await handleManualRun()
            drawResults()
            break;

        default:
            break;
    }
}

const main = async () => {
    const themeButton = document.getElementById("theme-selector")
    themeButton.addEventListener("click", handleThemeToggle)

    const alignButton = document.getElementById("align-selector")
    alignButton.addEventListener("click", handleAlignToggle)

    const inputTypeForm = document.getElementById("input-type-form")
    inputTypeForm.addEventListener("change", handleInputTypeChange)

    createApiSelector()
    const dataInputContainer = document.getElementById("data-input-container")
    dataInputContainer.insertAdjacentHTML("beforeend", createTextArea())

    const textarea = document.getElementById("data-input-text")
    textarea.addEventListener("input", handleJsonChange)

    const runButton = document.getElementById("run")
    runButton.addEventListener("click", handleRun)
}

main()