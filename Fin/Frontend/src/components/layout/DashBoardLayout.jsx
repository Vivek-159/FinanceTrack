import React, { Children, useContext } from 'react'
import { UserContext } from '../../context/Usercontext'
import Navbar from './Navbar';
import Sidemenu from './Sidemenu';

const DashBoardLayout = ({ children, activeMenu }) => {
    const { user } = useContext(UserContext);
    return (
        <div className=''>
            <Navbar activeMenu={activeMenu} />

            {user && (
                <div className='flex'>
                    <div className='hidden lg:block'>
                        <Sidemenu activeMenu={activeMenu} />
                    </div>
                    <div className='grow mx-5'>{children}</div>
                </div>
            )}
        </div>
    )
}

export default DashBoardLayout