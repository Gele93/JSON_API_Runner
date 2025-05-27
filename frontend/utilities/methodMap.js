export const methodMap = {
    "imageService": [
        {
            function: "getImageByName",
            params: ["image"],
            format: "image"
        },
    ],
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
    ],
    "userService": [
        {
            function: "getUserProfile",
            params: ["user"],
            format: "arrayOfObjects"
        },
        {
            function: "createUserProfile",
            params: ["name", "email", "age"],
            format: "arrayOfObjects"
        },
    ]
}