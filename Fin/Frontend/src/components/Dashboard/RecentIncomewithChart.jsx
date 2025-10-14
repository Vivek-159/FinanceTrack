import React, { use, useEffect, useState } from 'react'
import CustomPieChart from '../Charts/CustomPieChart'

const COLORS = ['#875CF5','#FA2C37','#FF6900','#4f39f6']

const RecentIncomewithChart = ({data,totalIncome}) => {

    const [chartData, setChartData] = useState([]);

    const preaperChartData = () => {
        const dataArr = data?.map((item)=> ({
            name: item?.source,
            amount: item?.amount,
        }));

        setChartData(dataArr);
    };

    useEffect(() => {
        preaperChartData();

        return () => {};
    },[data]);

  return (
    <div className='card'>
        <div className='felx items-center justify-between'>
            <h5 className='text-lg '>Last 60 Days Income </h5>
        </div>

        <CustomPieChart
            data={chartData}
            label="Total Income"
            totalAmount={`₹${totalIncome}`}
            showTextAnchor
            colors={COLORS}
        />
    </div>
  )
}

export default RecentIncomewithChart