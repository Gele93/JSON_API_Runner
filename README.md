# JSON API Runner Documentation

## Project Overview
**Name:** JSON API Runner  

**Description:**  
*JSON API Runner* is a web application used for dinamicly invoking different methods from different api modules.

##  1. Main features:
  ### 1.1 Modules:
-  **Math Service**: Calculating fibonacci sequences & multiplying matrixes
-  **Image Service**: Getting images stored on the backend
-  **User Service**: Getting user informations from a database

  ### 1.2 Methods:
-  **getImageByName**:  image= *cat.jpg*
-  **getFibonacci**:  n= *10*
-  **multiplyMatrices**:  array1= *[[1,2,3],[3,4,5]]* , array2= *[[1,2,5,7],[3,4,2,5],[5,6,2,4]]*
-  **getUserProfile**:  user= *2* / *Alice* / *eve@example.com*

  ### 1.3 Dynamic Method Configuration:
  -  The app uses a centralized `methodMap.js` to define backend modules, their methods, required parameters, and response formats.
  - Example:
```js
export const methodMap = {
    "mathService": [
        {
            function: "getFibonacci",
            params: ["n"],
            format: "number"
        },
        {
            function: "multiplyMatrices",
            params: ["array1", "array2"],
            format: "2dArray"
        }
    ]
}
```
  -  To add new modules only methodMap needs to be extended and the service module to be implemented

  ### 1.4.1 Usage:
  -  Toggle dark mode & Align direction for convenient usage
  -  Choose a module to create a callstack on
  -  Manually write the array of methods to be invoked from the chosen module (or use auto fill to call them all)
  -  Set params for desired methods
  -  Click Run to invoke the methods

  ### 1.4.2 Data input samples
  -  Samples for usage found in `inputSamples.json`
  -  *inputFieldsData* shows examples to invoke mathService methods properly
  -  *dataSentToBackend* shows the actual data structure that will be sent to the server

##  2. Technology Stack
### 🚀 Frontend
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)  
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)  
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)  

### 🔧 Backend
[![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)

### 🗂️ Version Control
[![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)](https://git-scm.com/)  
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/)

 
## 3. Installation and Running
-  Navigate to the project folder
-  Install dependencies
```
npm i
```
-  Start the backend server
```
node server.js
```

### 3.1. Prerequisites
- npm


## 4. Contact
Developer: **[Gelecsák Tamás]**  
Email: **[gelecsak.tamas@gmail.com]**  
LinkedIn: **[https://www.linkedin.com/in/tamasgelecsak]**
