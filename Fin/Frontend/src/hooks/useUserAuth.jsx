import { useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosinstance";
import { API_PATHS } from "../utils/apiPaths";
import { UserContext } from "../context/Usercontext";

export const useUserAuth = () => {
    const { user, updateUser, clearUser } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) return;

        let ismounted = true;

        const fetchuserinfo = async () => {
            try {
                const response = await axiosInstance.get(API_PATHS.AUTH.GET_USER_INFO);
                if (ismounted && response.data) {
                    updateUser(response.data);
                }
            } catch (err) {
                console.error("failed to fetch user", err);
                if (ismounted) {
                    clearUser();
                    console.log("User not found, redirecting to login");
                    navigate("/login");
                }
            }
        };

        fetchuserinfo();

        return () => {
            ismounted = false;
        };
    }, [updateUser, clearUser, navigate]);
}