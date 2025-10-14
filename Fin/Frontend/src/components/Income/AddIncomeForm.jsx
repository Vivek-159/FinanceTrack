import React, { useState } from 'react'
import Input from '../inputs/Input'
import EmojiPickerPopup from '../EmojiPickerPopup'; 

const AddIncomeForm = ({ onAddIncome }) => {
    const [income, setIncome] = useState({
        source: "",
        amount: "",
        date: "",
        icon: "",
    });

    const handelChange = (key, value) => setIncome({ ...income, [key]: value });
    return (
        <div>

            <EmojiPickerPopup
                icon={income.icon}
                onSelect={(selectedIcon) => handelChange('icon', selectedIcon)}
            />

            <Input
                value={income.source}
                onChange={({ target }) => handelChange("source", target.value)}
                label="income source"
                placeholder="Freelancing, salary, etc"
                type="text"
            />
            <Input
                value={income.amount}
                onChange={({ target }) => handelChange("amount", target.value)}
                label="Amount"
                placeholder=""
                type="number"
            />
            <Input
                value={income.date}
                onChange={({ target }) => handelChange("date", target.value)}
                label="Date"
                placeholder=""
                type="date"
            />

            <div className='flex justify-end mt-6'>
                <button type='button' className='add-btn add-btn-fill' onClick={() => onAddIncome(income)}>Add Income</button>
            </div>

        </div>
    )
}

export default AddIncomeForm