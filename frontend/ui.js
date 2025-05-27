import { methodMap } from "./utilities/methodMap.js";

export const createTextArea = () => `
<div id="text-area-with-button">
    <textarea id="data-input-text" rows="10" cols="50" placeholder='Insert JSON manually eg.: ["getFibonacci", "multiplyMatrices"]'></textarea>
    <button id="auto-fill">Auto Fill</button>
</div>
`

export const createManualParamsSelector = (moduleName) => {
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

 export const createModuleSelector = () => {
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





export const createNumberResult = (resultData) => `
<div class="result-line">
${resultData.data}
</div>
`

export const create2dArrayResult = (resultData) => {
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

export const createImageResult = (resultData) => {
    return `
<div class="result-line">
    <img src="data:image/png;base64,${resultData.data}">
</div>
`
}

export const createArrayOfObjectsResult = (resultData) => {
    let element = '<div class="result-line">'

    for (const object of resultData.data) {
        for (const key in object) {
            element += `<div>${key}: ${object[key]}</div>`
        }
    }
    element += "</div>"

    return element
}