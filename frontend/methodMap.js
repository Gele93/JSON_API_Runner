export const methodMap = {
    "imageService": [
        {
            function: "getImageByName",
            params: ["imageName"],
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
            params: ["userId"],
            format: "object"
        },
    ]
}