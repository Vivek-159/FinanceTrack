const Income = require('../models/income');
const Expense = require('../models/expense');
const { isValidObjectId, Types } = require('mongoose');

exports.getdashboardData = async (req, res) => {
    try {
        const userId = req.user.id;
        const userObjectId = new Types.ObjectId(String(userId));

        const totalIncome = await Income.aggregate([
            { $match: { userId: userObjectId } },
            { $group: { _id: null, total: { $sum: "$amount" } } },
        ]);

        console.log("totalIncome", { totalIncome, userId: isValidObjectId(userId) });

        const totalExpense = await Expense.aggregate([
            { $match: { userId: userObjectId } },
            { $group: { _id: null, total: { $sum: "$amount" } } },
        ]);

        const incomeSources = await Income.aggregate([
            { $match: { userId: userObjectId } },
            { $group: { _id: "$source", total: { $sum: "$amount" } } },
            { $sort: { total: -1 } }
        ]);

        const expenseCategories = await Expense.aggregate([
            { $match: { userId: userObjectId } },
            { $group: { _id: "$catagory", total: { $sum: "$amount" } } },
            { $sort: { total: -1 } }
        ]);

        const last60dayIncomesTransactions = await Income.find({
            userId,
            date: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
        }).sort({ date: -1 });

        const incomeLast60Days = last60dayIncomesTransactions.reduce(
            (sum, transaction) => sum + transaction.amount, 0
        );

        const last30dayExpenseTransactions = await Expense.find({
            userId,
            date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        }).sort({ date: -1 });

        const expenseLast30Days = last30dayExpenseTransactions.reduce(
            (sum, transaction) => sum + transaction.amount, 0
        );

        const lastTransactions = [
            ...(await Income.find({ userId }).sort({ date: -1 }).limit(5)).map(
                (txn) => ({
                    ...txn.toObject(),
                    type: "income",
                })
            ),
            ...(await Expense.find({ userId }).sort({ date: -1 }).limit(5)).map(
                (txn) => ({
                    ...txn.toObject(),
                    type: "expense",
                })
            ),
        ].sort((a, b) => b.date - a.date);

        res.json({
            totalBalance:
                (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0),
            totalIncome: totalIncome[0]?.total || 0,
            totalExpense: totalExpense[0]?.total || 0,
            incomeSources: incomeSources.map(item => ({ source: item._id, total: item.total })),
            expenseCategories: expenseCategories.map(item => ({ category: item._id, total: item.total })),
            last30DaysExpense: {
                total: expenseLast30Days,
                transactions: last30dayExpenseTransactions,
            },
            last60dayIncome: {
                total: incomeLast60Days,
                transaction: last60dayIncomesTransactions
            },
            recentTransactios: lastTransactions,
        });

    } catch (err) {
        res.status(500).json({ message: "sever error" })
    }
}