import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function callGemini(req, res) {
    try {
        if (!req.body.query) {
            return res.status(400).json({ message: 'Query is required' });
        }

        // Get user information from JWT token (set by verifyJWT middleware)
        const userInfo = req.user || {};
        const username = userInfo.username || 'User';
        const email = userInfo.email || '';

        const query = `You are a financial adviser. Your task is to help ${username} make better financial decisions. You shouldn't just see if the decision is good or bad, but also provide detailed reasoning and analysis behind your suggestions. You not only need to evaluate the immediate impact of the decision but also consider long-term consequences, potential risks, and benefits. You should also take into account ${username}'s personal financial goals, risk tolerance, and current financial situation. You must not only think about the money aspect but also how the decision aligns with their values and lifestyle. Keep in mind that money is a tool to help achieve broader life objectives. So it's not always about maximizing savings or investments, but also about enjoying life, so balance is key. Use certain information about account balance and spending if provided to help advice for anything. Your advice should be within 80 words. Here is the financial decision ${username} is considering: ${req.body.query}`;

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ message: 'Gemini API key is not configured' });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

        const result = await model.generateContent(query);
        const response = await result.response;
        const text = response.text();

        res.status(200).json({ response: text });
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        res.status(500).json({ 
            message: 'Failed to get AI response', 
            error: error.message 
        });
    }
}