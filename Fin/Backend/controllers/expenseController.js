const xlsx = require('xlsx');
const Expense = require('../models/expense');


exports.addExpense = async (req, res) => {
    const userId = req.user.id;

    try {
        const { icon, catagory, amount, date } = req.body;

        if (!catagory || !amount || !date) {
            return res.status(400).json({ message: "all fields are required.." });
        }

        const newExpense = new Expense({
            userId,
            icon,
            catagory,
            amount,
            date: new Date(date)
        });

        await newExpense.save();
        res.status(200).json(newExpense);
    } catch (err) {
        res.status(500).json({ message: "error accure storing income", error: err })
    }
}
exports.getAllExpense = async (req, res) => {
    const userId = req.user.id;

    try {
        const expense = await Expense.find({ userId }).sort({ date: -1 });
        res.json(expense);

    } catch (err) {
        res.status(500).json({ messgae: "no income found" })
    }

}
exports.deleteExpense = async (req, res) => {
    try {
        await Expense.findByIdAndDelete(req.params.id);
        res.json({message: "deleted successfully.."})
    } catch (error) {
       res.status(500).json({message:"error accure in deleting"}) 
    }
}
exports.downloadExpenseExcel = async (req, res) => {
    const userId = req.user.id;

    try {
        const expense = await Expense.find({userId}).sort({date: -1});  

        const data = expense.map((item)=>({
            catagory: item.catagory,
            Amount: item.amount,
            Date: item.date
        }));

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb,ws,"Expense");
        xlsx.writeFile(wb, 'expense_details.xlsx');
        res.download('expense_details.xlsx');
    } catch (err) {
        res.status(500).json({message:"error in downloading..."})
    }
}