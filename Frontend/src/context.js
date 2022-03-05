import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AXIOS } from "./axios";

const mainContext = createContext();

const token = localStorage.getItem("token");

//{userId: null, name: null, admin: false} - user state values

const MainContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const verifyToken = async () => {
            try {
                if (token) {
                    const response = await AXIOS.get("/user/decodeVerifyToken");
                    const { name, userId, admin } = response.data.payload;
                    setUser({ name, userId, admin });
                    if (!admin) {
                        navigate("/user");
                    }
                } else {
                    navigate("/");
                }
            } catch (error) {
                navigate("/");
            }
        };

        verifyToken();
    }, []);

    return (
        <mainContext.Provider value={{ user, setUser }}>
            {children}
        </mainContext.Provider>
    );
};

const UseMainContext = () => {
    return useContext(mainContext);
};

export { UseMainContext, MainContextProvider };
