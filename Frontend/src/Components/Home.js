import { makeStyles } from "@material-ui/core";
import { Avatar, Button, IconButton, MenuItem, Typography, Menu } from "@mui/material";
import React, { useEffect, useState } from "react";
import styles from "../Styles/home.modules.css";
import AddUser from "./AddUser";
import Users from "./Users";
import handleError from "../handleErrors";
import { AXIOS } from "../axios";
import Activities from "./Activities";
import { UseMainContext } from "../context";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles({
    container: {
        width: "90%",
        margin: "5% auto",
    },
});

function Home() {
    const classes = useStyles();
    const [activitiesModalOpen, setActivitiesModalOpen] = useState(false);
    const [addUserModalOpen, setAddUserModalOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const { user } = UseMainContext();
    const navigate = useNavigate()

    useEffect(() => {
        getAllUsers();
    }, [user]);

    const getAllUsers = async () => {
        try {
            const response = await AXIOS.get("/user");
            setUsers(response.data.message);
        } catch (error) {
            console.log(error);
        }
    };

    const handleAddUserModalOpen = () => {
        setAddUserModalOpen(true);
    };
    const handleAddUserModalClose = () => {
        setAddUserModalOpen(false);
    };

    const handleActivitiesModalOpen = () => {
        setActivitiesModalOpen(true);
    };
    const handleActivitiesModalClose = () => {
        setActivitiesModalOpen(false);
    };

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async() => {
        try {
            await AXIOS.post('/user/logout');
            localStorage.removeItem('token')
            navigate('/')
        } catch (error) {
            handleError(error);
        }
    }

    return (
        <div>
            {activitiesModalOpen && (
                <Activities
                    open={activitiesModalOpen}
                    handleClose={handleActivitiesModalClose}
                />
            )}
            {addUserModalOpen && (
                <AddUser
                    open={addUserModalOpen}
                    handleOpen={handleAddUserModalOpen}
                    handleClose={handleAddUserModalClose}
                    getAllUsers={getAllUsers}
                />
            )}
            <header style={styles.header}>
                <Typography variant="h4" color="primary">
                    ADMIN DASHBOARD
                </Typography>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-around",
                        alignItems: "center",
                    }}
                >
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleAddUserModalOpen}
                    >
                        Add new user
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleActivitiesModalOpen}
                    >
                        View activities
                    </Button>
                    <div>
                        <Avatar onClick={handleMenu}>
                            {user?.name?.charAt(0)}
                        </Avatar>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem disabled>Zainuddin</MenuItem>
                            <MenuItem onClick={handleLogout}>
                                Logout
                            </MenuItem>
                        </Menu>
                    </div>
                </div>
            </header>
            <div className={classes.container}>
                <Users rows={users} getAllUsers={getAllUsers} />
            </div>
        </div>
    );
}

export default Home;
