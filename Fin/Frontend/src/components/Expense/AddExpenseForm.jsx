import React, { useState } from 'react'
import Input from '../inputs/Input'
import EmojiPickerPopup from '../EmojiPickerPopup'; 

const AddExpenseForm = ({ onAddExpense }) => {
    const [expense, setExpense] = useState({
        catagory: "",
        amount: "",
        date: "",
        icon: "",
    });

    const handelChange = (key, value) => setExpense({ ...expense, [key]: value });
    return (
        <div>

            <EmojiPickerPopup
                icon={expense.icon}
                onSelect={(selectedIcon) => handelChange('icon', selectedIcon)}
            />

            <Input
                value={expense.catagory}
                onChange={({ target }) => handelChange("catagory", target.value)}
                label="expense source"
                placeholder="Bills,Loans, etc.."
                type="text"
            />
            <Input
                value={expense.amount}
                onChange={({ target }) => handelChange("amount", target.value)}
                label="Amount"
                placeholder=""
                type="number"
            />
            <Input
                value={expense.date}
                onChange={({ target }) => handelChange("date", target.value)}
                label="Date"
                placeholder=""
                type="date"
            />

            <div className='flex justify-end mt-6'>
                <button type='button' className='add-btn add-btn-fill' onClick={() => onAddExpense(expense)}>Add Expense</button>
            </div>

        </div>
    )
}

export default AddExpenseForm