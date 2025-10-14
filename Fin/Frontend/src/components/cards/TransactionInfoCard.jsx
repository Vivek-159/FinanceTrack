import React from 'react';
import { LuUtensils, LuTrendingUp, LuTrendingDown, LuTrash2 } from 'react-icons/lu';

const TransactionInfoCard = ({ 
    title, icon, date, amount, type, hideDeleteBtn, onDelete
}) => {

    const getAmounstyle = () =>
        type == 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600';


    return <div className='group relative flex items-center gap-4 mt-2 p-3 rounded-lg hover:bg-gray-100/60 dark:hover:bg-gray-700/60'>
        <div className='w-12 h-12 flex items-center justify-center text-xl text-gray-800 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-full'>
            {icon ? (
                <img src={icon} alt={title} className='w-6 h-6' />
            ) : (
                <LuUtensils />
            )}
        </div>
        <div className='flex-1 flex items-center justify-between '>
            <div>
                <p className='text-sm text-gray-400 dark:text-white-300 font-medium'>{title}</p>
                <p className='text-xs text-gray-400 dark:text-white-500 mt-1'>{date}</p>
            </div>

            <div className='flex items-center gap-2'>
                {!hideDeleteBtn && (
                    <button className='text-black-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer ' onClick={onDelete}>
                        <LuTrash2 size={18} />
                    </button>
                )}

                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md ${getAmounstyle()} `}>
                    <h6 className='text-xs font-medium '>{type === 'icome' ? '+' : '-'} ₹{amount}</h6>
                    {type == 'income' ? <LuTrendingUp /> : <LuTrendingDown />}
                </div>
            </div>
        </div>
    </div>
}

export default TransactionInfoCard