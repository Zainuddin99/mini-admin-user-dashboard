import SignIn from "./Components/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Home from "./Components/Home";
import { green, orange, purple, red } from "@mui/material/colors";
import { MainContextProvider } from "./context";
import UserData from "./Components/UserData";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const theme = createTheme({
    status: {
        danger: orange[500],
    },
    palette: {
        primary: {
            main: purple[500],
        },
        secondary: {
            main: green[500],
        },
        danger: { main: red[500] },
    },
});

function App() { 
    return (
        <ThemeProvider theme={theme}>
            <ToastContainer />
            <CssBaseline />
            <Router>
                <MainContextProvider>
                    <Routes>
                        <Route path="/" exact element={<SignIn />} />
                        <Route path="/home" element={<Home />} />
                        <Route path="/user" element={<UserData />} />
                    </Routes>
                </MainContextProvider>
            </Router>
        </ThemeProvider>
    );
}

export default App;
