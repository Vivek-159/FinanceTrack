import React from 'react'

const Infocard = ({ icon, label, value, color }) => {
    return <div className='flex gap-6 card'>
        <div className={`w-14 h-14 flex items-center justify-center text-[26px] text-grey ${color} rounded-full drop-shadow-xl`}>
            {icon}
        </div>
        <div>
            <h6 className='text-sm text-gray-500 dark:text-white-100'>{label}</h6>
            <span className='text-[22px] text-grey dark:text-white-300'>₹{value}</span>
        </div>
    </div>;
}

export default Infocard