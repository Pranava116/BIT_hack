import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function getInvestmentAdvice(req, res) {
    try {
        const { salary, monthlyBills, spending, savings } = req.body;

        // Validate input
        if (salary === undefined || monthlyBills === undefined || spending === undefined || savings === undefined) {
            return res.status(400).json({ message: 'All fields (salary, monthlyBills, spending, savings) are required' });
        }

        const salaryNum = parseFloat(salary);
        const billsNum = parseFloat(monthlyBills);
        const spendingNum = parseFloat(spending);
        const savingsNum = parseFloat(savings);

        if (isNaN(salaryNum) || isNaN(billsNum) || isNaN(spendingNum) || isNaN(savingsNum)) {
            return res.status(400).json({ message: 'All values must be valid numbers' });
        }

        // Get user information from JWT token (set by verifyJWT middleware)
        const userInfo = req.user || {};
        const username = userInfo.username || 'User';
        const email = userInfo.email || '';

        // Calculate savings rate
        const savingsRate = salaryNum > 0 ? (savingsNum / salaryNum) * 100 : 0;

        // Create a comprehensive prompt for investment advice
        const investmentPrompt = `You are a professional financial advisor. ${username} has provided the following financial information:
        
Monthly Salary: ₹${salaryNum.toFixed(2)}
Monthly Bills (fixed expenses like rent, utilities): ₹${billsNum.toFixed(2)}
Monthly Spending (variable expenses like food, entertainment): ₹${spendingNum.toFixed(2)}
Monthly Savings: ₹${savingsNum.toFixed(2)}
Savings Rate: ${savingsRate.toFixed(2)}%

Based on this information, provide personalized investment advice. Your response should include:

1. **Assessment**: Evaluate their current financial situation and savings rate
2. **Investment Options**: Suggest 3-5 specific investment options suitable for their savings amount and risk profile (e.g., Mutual Funds, Fixed Deposits, Stocks, PPF, SIP, etc.)
3. **Allocation Strategy**: Recommend how they should allocate their monthly savings across different investment vehicles
4. **Risk Analysis**: Explain the risk level of each suggested investment
5. **Long-term Benefits**: Explain how these investments can help them achieve financial goals
6. **Next Steps**: Provide actionable steps they can take immediately

Make your advice practical, clear, and tailored to their specific situation. Consider that they are saving ₹${savingsNum.toFixed(2)} per month. Keep the response comprehensive but concise (around 200-250 words). Use Indian Rupee (₹) for all monetary references.`;

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ message: 'Gemini API key is not configured' });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

        const result = await model.generateContent(investmentPrompt);
        const response = await result.response;
        const text = response.text();

        res.status(200).json({
            savings: savingsNum,
            savingsRate: savingsRate.toFixed(2),
            advice: text,
        });
    } catch (error) {
        console.error('Error getting investment advice:', error);
        res.status(500).json({
            message: 'Failed to get investment advice',
            error: error.message,
        });
    }
}

