import { methodMap } from "./methodMap.js"
const body = document.getElementById("body")
const root = document.getElementById("root")
const api = "http://localhost:3000/api"

const dataState = {
    inputType: "manual",
    JSON: "",
    dropDown: {
        module: "",
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

const createTextArea = () => `<textarea id="data-input-text" rows="10" cols="50" placeholder="Insert JSON manually"></textarea>`


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

const handleApiSelection = (e) => {
    const dataInputContainer = document.getElementById("data-input-container")
    const currentMethodSelectorContainer = document.getElementById("method-selector-container")
    if (currentMethodSelectorContainer)
        dataInputContainer.removeChild(currentMethodSelectorContainer)

    const currentParamsContainer = document.getElementById("params-selector-container")
    if (currentParamsContainer)
        dataInputContainer.removeChild(currentParamsContainer)

    const moduleName = e.target.value
    const element = createMethodSelector(moduleName)
    dataState.dropDown.module = moduleName

    dataInputContainer.insertAdjacentHTML("beforeend", element)
    const methodSelector = document.getElementById("method-selector")
    methodSelector.addEventListener("change", handleMethodSelection)
}

const createMethodSelector = (moduleName) => {
    let element = `
<div id="method-selector-container" class="selector-line">
<label for="method-selector">Choose a method:</label>
<select id="method-selector" name="method-selector">
<option value="">--Please choose a method--</option>
`

    for (const method of methodMap[moduleName]) {
        element += `<option value="${method}">${method}</option>
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

const handleDropDownSelection = (dataInputContainer) => {
    const element = createModuleSelector()
    dataInputContainer.insertAdjacentHTML("beforeend", element)
    const apiSelector = document.getElementById("api-selector")
    apiSelector.addEventListener("change", handleApiSelection)
}

const handleJsonChange = (e) => {
    dataState.JSON = e.target.value
}

const handleManualSelection = (dataInputContainer) => {
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
            handleDropDownSelection(dataInputContainer)
            dataState.inputType = "dropdown"
            break;
        case "manual":
            dataInputContainer.innerHTML = ""
            handleManualSelection(dataInputContainer)
            dataState.inputType = "manual"
            break;

        default:
            break;
    }
}

const collectParams = () => {
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

const fetchPostApi = async (callData) => {
    try {
        const response = await fetch(api, {
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

const handleDropDownRun = async () => {
    collectParams()
    responseState.data = []
    const callData = []
    callData.push(dataState.dropDown)
    const responseData = await fetchPostApi(JSON.stringify(callData))
    responseState.data = responseData
}

const handleManualRun = async () => {
    responseState.data = []
    const responseData = await fetchPostApi(dataState.JSON)
    responseState.data = responseData
}

const handleRun = async () => {
    switch (dataState.inputType) {
        case "dropdown":
            await handleDropDownRun()
            break;

        case "manual":
            await handleManualRun()
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

    const textarea = document.getElementById("data-input-text")
    textarea.addEventListener("input", handleJsonChange)

    const runButton = document.getElementById("run")
    runButton.addEventListener("click", handleRun)
}

main()