import React, { useEffect, useState } from 'react'
import { LuPlus } from 'react-icons/lu';
import CustomBarChart from '../Charts/CustomBarChart';
import { prepareExpenseBarChartData } from '../../utils/helper';

const ExpenseOverview = ({ transaction, onAddExpense }) => {
    const [chartData, setChartData] = useState([]); 

    useEffect(() => { 
        const result = prepareExpenseBarChartData(transaction);
        setChartData(result);
        return () => { };
    }, [transaction]);

    return <div className='card'>
        <div className='flex items-center justify-between '>
            <div className=''>
                <h5 className='text-lg'>Expense Overview</h5>
                <p className='text-xs text-gray-400 mt-0.5'>
                    Keep Eye on your Expenses
                </p>
            </div>

            <button className='add-btn' onClick={onAddExpense}>
                <LuPlus className='text-lg' />
                Add Expense
            </button>
        </div>

        <div className='mt-10'>
            <CustomBarChart data={chartData} />
        </div>
    </div>
}

export default ExpenseOverview