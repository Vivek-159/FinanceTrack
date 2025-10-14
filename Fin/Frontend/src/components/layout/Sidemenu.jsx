import React, { useContext, useState } from 'react'
import { SIDE_MENU_DATA } from '../../utils/data'
import { UserContext } from '../../context/Usercontext'
import { useNavigate } from 'react-router-dom'
import Charavatar from '../cards/Charavatar';
import { FiEdit2, FiCheck, FiX } from 'react-icons/fi';
import axiosInstance from '../../utils/axiosinstance';
import { API_PATHS } from '../../utils/apiPaths';

const Sidemenu = ({ activeMenu }) => {
    const { user, clearUser, updateUser } = useContext(UserContext);
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(user?.fullName || "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleClick = (route) => {
        if (route == "/logout") {
            handleLogout();
            return;
        }

        navigate(route);
    };

    const handleLogout = () => {
        localStorage.clear();
        clearUser();
        navigate("/login");
    };

    const handleEditClick = () => {
        setIsEditing(true);
        setEditedName(user?.fullName || "");
        setError(null);
    };

    const handleCancelClick = () => {
        setIsEditing(false);
        setError(null);
    };

    const handleSaveClick = async () => {
        if (!editedName.trim()) {
            setError("Name cannot be empty");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.put(API_PATHS.AUTH.UPDATE_USER, { fullName: editedName });
            updateUser(response.data);
            setIsEditing(false);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update name");
        } finally {
            setLoading(false);
        }
    };

    return <div className='w-64 h-[calc(100vh-61px)] bg-white dark:bg-gray-800  dark:border-gray-700 p-5 sticky top-[61px] z-20'>
        <div className='flex flex-col items-center justify-center gap-3 mt-3 mb-7'>
            {user?.profileimageurl ? (
                <img
                    src={user?.profileimageurl || ""}
                    alt='profile'
                    className='w-20 h-20 bg-slate-400 rounded-full'
                />
            ) : <Charavatar fullName={user?.fullName} width="w-20" height="h-20" style="text-xl" />}

            {isEditing ? (
                <div className="flex flex-col items-center">
                    <input
                        type="text"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        className="text-white rounded px-2 py-1 text-center"
                        disabled={loading}
                    />
                    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                    <div className="flex gap-2 mt-2">
                        <button
                            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 disabled:opacity-50"
                            onClick={handleSaveClick}
                            disabled={loading}
                        >
                            <FiCheck />
                        </button>
                        <button
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:opacity-50"
                            onClick={handleCancelClick}
                            disabled={loading}
                        >
                            <FiX />
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <h5 className='text-gray-950 dark:text-white font-medium leading-6 flex items-center gap-2'>
                        {user?.fullName || ""}
                        <button
                            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                            onClick={handleEditClick}
                            title="Edit Name"
                        >
                            <FiEdit2 />
                        </button>
                    </h5>
                </>
            )}
        </div>
        {SIDE_MENU_DATA.map((item, index) => (
            <button
                key={`menu_${index}`}
                className={`w-full flex items-center gap-4 text-[15px] ${activeMenu == item.label ? 'text-white bg-primary' : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"} py-3 px-6 rounded-lg mb-3`}
                onClick={() => handleClick(item.path)}
            >
                <item.icon className='text-xl' />
                {item.label}
            </button>
        ))}
    </div>;

};

export default Sidemenu;