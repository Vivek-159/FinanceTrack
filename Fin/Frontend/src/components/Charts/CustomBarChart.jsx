import React from 'react'
import {
    BarChart,
    Bar,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from "recharts";

const CustomBarChart = ({ data }) => {

    const getBarColor = (index) => {
        return index % 2 == 0 ? '#875cf5' : '#cfbefb';
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-2 border border-gray-300 dark:border-gray-700">
                    <p className="text-xs font-semibold text-purple-800 dark:text-purple-400 mb-1">{payload[0].payload.catagory}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Amount: <span className='text-sm font-medium text-gray-900 dark:text-gray-100'>₹{payload[0].payload.amount}</span></p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className='bg-white dark:bg-gray-900 mt-6'>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid stroke='none' />
                    <YAxis tick={{ fontSize: 12, fill: "var(--text-secondary-color, #555)" }} stroke='none' /> 

                    <Tooltip content={CustomTooltip} />

                    <Bar
                        dataKey="amount"
                        fill="#875cf5"
                        radius={[10, 10, 0, 0]}
                        activeDot={{ r: 8, fill: 'yellow' }}
                        activeStyle={{ fill: 'green' }}
                    >
                        {data.map((entry, index) => {
                            <Cell key={index} fill={getBarColor(index)} />
                        })}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

export default CustomBarChart