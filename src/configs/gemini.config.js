const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
const modelAi = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

module.exports = modelAi