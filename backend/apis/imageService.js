import fs from "fs/promises";
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))

export const getImageByName = async (params) => {
    const imageName = params.find(p => p.name === "image").value

    try {
        const imagePath = join(__dirname, "..", "images", imageName);
        const imageBuffer = await fs.readFile(imagePath);
        const base64Image = imageBuffer.toString("base64");
        return base64Image
    } catch (err) {
        throw new Error("Image not found");
    }
}