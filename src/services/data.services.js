import { GoogleGenerativeAI } from "@google/generative-ai"


const getGenerativeModel = () => {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
    return genAI.getGenerativeModel({ model: "gemini-2.0-flash" })
}


class DataService {

    constructor() { }

    refineMockData(string) {
        const startIndex = string.indexOf("[");
        const endIndex = string.lastIndexOf("]");
        const result = string.substring(startIndex, endIndex + 1);
        return result
    }

    async getSummarizedText(text) {

        if (!text || !text.trim()) return ""

        const prompt = `Summarize this whole  arcticle: ${text}`
        try {
            const model = getGenerativeModel();
            const result = await model.generateContent(prompt);
            return result.response.text();
        } catch (error) {
            console.log(error)
            throw new Error("Error generating the summarized text")
        }
    }

    async getMockdata(schema, count = 5) {

        if (!schema || !schema.trim()) return ""

        const prompt = `Generate ${count} docs of this schema ${schema} in json format`
        try {
            const model = getGenerativeModel();
            const result = await model.generateContent(prompt);
            return this.refineMockData(result.response.text())
        } catch (error) {
            console.log(error)
            throw new Error("Error generating the summarized text")
        }
    }

}

export default new DataService();