import React, { useState, useEffect } from 'react';
import { LuRefreshCw } from 'react-icons/lu';
import { GoogleGenerativeAI } from '@google/generative-ai';
import axiosInstance from '../../utils/axiosinstance';
import { API_PATHS } from '../../utils/apiPaths';
import DashBoardLayout from '../../components/layout/DashBoardLayout';
import { useUserAuth } from '../../hooks/useUserAuth';

const Ai = () => {
    useUserAuth();

    const [dashboardData, setDashboardData] = useState(null);
    const [aiResponse, setAiResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [userQuestion, setUserQuestion] = useState('');

    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

    const fetchDashboardData = async () => {
        try {
            const response = await axiosInstance.get(API_PATHS.DASHBOARD.GET_DATA);
            setDashboardData(response.data);
            if (response.data) {
                generateAiAdvice(response.data);
            }
        } catch (err) {
            setError('Failed to fetch dashboard data');
            console.error(err);
        }
    };

    const generateAiAdvice = async (data) => {
        try {
            setLoading(true);
            const model = genAI.getGenerativeModel({ model: "models/gemini-2.5-flash" });

            const prompt = `You are a financial advisor. Based on the following financial summary (All summery is in INR), provide concise and easy-to-read advice.
                            Do not use markdown. Break down your advice into clear sections with headings and bullet points where appropriate.

                           Financial Summary:
                           - Total Income: ₹${data.totalIncome}
                           - Total Expenses: ₹${data.totalExpense}
                           - Current Balance: ₹${data.totalBalance}

                           Please provide:
                           1. Tips for saving more money if current spending is not ideal also point where should cutoff the spending.
                           2. Recommendations for an emergency fund (if one is needed) and how much to save (atleast of ₹3,600 to ₹6,500).
                           3. Suggestions on where to invest the current balance with highlighted ammount and try to create table.
                         `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            setAiResponse(response.text());
        } catch (err) {
            setError('Failed to generate AI advice');
            console.error(err);
        } finally {
            setLoading(false);
            setError(null)
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const handleRefresh = async () => {
        if (dashboardData) {
            setAiResponse('');
            await generateAiAdvice(dashboardData);
        }
    };

    const handleSendMessage = async () => {
        if (!userQuestion.trim() || !dashboardData) return;
        setLoading(true);
        try {
            const model = genAI.getGenerativeModel({ model: "models/gemini-2.5-flash" });
            const prompt = `You are a financial advisor. Based on the following financial summary and details which you get of the user, answer the user's question concisely and directly related to their finances. Do not use markdown. Provide detailed breakdowns if the user asks for them.

Financial Summary:
- Total Income: ₹${dashboardData.totalIncome}
- Total Expenses: ₹${dashboardData.totalExpense}
- Current Balance: ₹${dashboardData.totalBalance}
- Income Sources: ${dashboardData.incomeSources?.map(s => `${s.source}: ₹${s.total}`).join(', ') || 'None'}
- Expense Categories: ${dashboardData.expenseCategories?.map(c => `${c.category}: ₹${c.total}`).join(', ') || 'None'}
- Recent Expenses (last 30 days): ${dashboardData.last30DaysExpense?.transactions?.map(t => `${t.catagory}: ₹${t.amount}`).join(', ') || 'None'}

User Question: ${userQuestion}

Answer:`;
            const result = await model.generateContent(prompt);
            const response = await result.response;
            setChatMessages(prev => [...prev, { user: userQuestion, ai: response.text() }]);
            setUserQuestion('');
        } catch (err) {
            setError('Failed to send message');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashBoardLayout activeMenu="ai-advisor">
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-bold dark:text-gray-500">Meet Your 🅰🅸🤖 Financial Advisor</h2>
                    <button
                        className="add-btn flex items-center gap-2"
                        onClick={handleRefresh}
                        disabled={loading}
                    >
                        <LuRefreshCw className={`text-lg ${loading ? 'animate-spin' : ''}`} />
                        Refresh Advice
                    </button>
                </div>

                {loading && (
                    <div className="animate-pulse text-center p-4 dark:text-black-300">
                        Analyzing your financial data...
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 p-4 rounded-lg mb-4">
                        {error}
                    </div>
                )}

                {aiResponse && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4 dark:text-gray-100">Financial Analysis & Recommendations</h3>
                        <div className="prose max-w-none text-black dark:text-white">
                            <p className="whitespace-pre-wrap">{aiResponse}</p>
                        </div>
                    </div>
                )}

                {/* Chat Column */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mt-6">
                    <h3 className="text-lg font-semibold mb-4 dark:text-gray-100">Ask a Question from AI 🤖</h3>
                    <div className="mb-4 max-h-60 overflow-y-auto border border-gray-300 dark:border-gray-700 rounded p-3">
                        {chatMessages.length === 0 && (
                            <p className="text-lg font-semibold mb-4 dark:text-gray-300">No messages yet. Ask a question 👇.</p>
                        )}
                        {chatMessages.map((msg, index) => (
                            <div key={index} className="mb-3">
                                <p className="font-semibold dark:text-gray-200">You:</p>
                                <p className="whitespace-pre-wrap mb-1 dark:text-gray-300">{msg.user}</p>
                                <p className="font-semibold dark:text-gray-200">AI:</p>
                                <p className="whitespace-pre-wrap bg-gray-100 dark:bg-gray-700 p-2 rounded dark:text-gray-300">{msg.ai}</p>
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            className="flex-grow border border-gray-300 dark:border-gray-700 rounded p-2 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
                            placeholder="Ask a question about your finances..."
                            value={userQuestion}
                            onChange={(e) => setUserQuestion(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleSendMessage();
                                }
                            }}
                            disabled={loading}
                        />
                        <button
                            className="add-btn"
                            onClick={handleSendMessage}
                            disabled={loading || !userQuestion.trim()}
                        >
                            Send
                        </button>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                        <button
                            className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded text-sm hover:bg-gray-300 dark:hover:bg-gray-600"
                            onClick={() => {
                                setUserQuestion("Show me category-wise spending or income sources");
                                handleSendMessage();
                            }}
                            disabled={loading}
                        >
                            Category-wise spending or income sources
                        </button>
                        <button
                            className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded text-sm hover:bg-gray-300 dark:hover:bg-gray-600"
                            onClick={() => {
                                setUserQuestion("On which category did I spend most in the past 30 days with rupees?");
                                handleSendMessage();
                            }}
                            disabled={loading}
                        >
                            On which I spent most in past 30 days
                        </button>
                        <button
                            className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded text-sm hover:bg-gray-300 dark:hover:bg-gray-600"
                            onClick={() => {
                                setUserQuestion("On which category did I spend least in the past 30 days with rupees?");
                                handleSendMessage();
                            }}
                            disabled={loading}
                        >
                            On which I spent least in past 30 days
                        </button>
                    </div>
                </div>
            </div>
        </DashBoardLayout>
    );
};

export default Ai;