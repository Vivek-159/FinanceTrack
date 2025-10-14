import React, { useState } from 'react';
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi'
import Sidemenu from './Sidemenu';
import ThemeToggle from '../ThemeToggle';

const Navbar = ({ activeMenu }) => {
    const [opensidemenu, setOpensidemenu] = useState(false);
    return (
        <div className='flex gap-5 bg-white dark:bg-gray-800 border border-b border-gray-200/50 dark:border-gray-700 backdrop-blur=[2px] py-4 px-7 sticky top-0 z-30'>
            <button
                className='block lg:hidden text-black dark:text-white'
                onClick={() => {
                    setOpensidemenu(!opensidemenu);
                }}
            >{opensidemenu ? (<HiOutlineX className='text-2xl' />) : (<HiOutlineMenu className='text-2xl' />)}
            </button>

            <h2 className='text-lg font-medium text-black dark:text-white'>BudgetBee 🐝💸</h2>
            
            <div className="ml-auto">
                <ThemeToggle />
            </div>

            {opensidemenu && (
                <div className='fixed top-[61px] -ml-4 bg-white dark:bg-gray-800'>
                    <Sidemenu activeMenu={activeMenu} />
                </div>
            )}
        </div>
    )
}

export default Navbar