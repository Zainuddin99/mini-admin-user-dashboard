import React, { useEffect, useState } from "react";
import styles from "../Styles/home.modules.css";
import { Alert, Button, Typography, Avatar, MenuItem, Menu } from "@mui/material";
import ProductCard from "./ProductCard";
import AddProduct from "./AddProduct";
import handleError from "../handleErrors";
import { AXIOS } from "../axios";
import { UseMainContext } from "../context";
import { useLocation, useNavigate } from "react-router-dom";

function UserData() {
    const [addProductModalOpen, setAddProductModalOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [productModalType, setProductModalType] = useState("add");
    const [modalData, setModalData] = useState(null)
    const { user } = UseMainContext();
    const { state: viewId } = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        getProducts();
    }, [user]);

    const getProducts = async () => {
        try {
            let userId = user?.userId;
            if (user?.admin && viewId) {
                userId = viewId;
            }
            if (userId) {
                const response = await AXIOS.get("products/" + userId);
                setProducts(response.data.message);
            }
        } catch (error) {
            handleError(error);
        }
    };

    const handleAddProductModalOpen = (type, data) => {
        setAddProductModalOpen(true);
        if(type === "add"){
            setProductModalType("add")
        }else{
            setProductModalType("update")
            setModalData(data)
        }
    };
    const handleAddProductModalClose = () => {
        setAddProductModalOpen(false);
    };

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        try {
            await AXIOS.post("/user/logout");
            localStorage.removeItem("token");
            navigate("/");
        } catch (error) {
            handleError(error);
        }
    };

    return (
        <div>
            {addProductModalOpen && (
                <AddProduct
                    open={addProductModalOpen}
                    handleClose={handleAddProductModalClose}
                    getProducts={getProducts}
                    productModalType={productModalType}
                    modalData={modalData}
                    productModalType={productModalType}
                    modalData={modalData}
                    viewId={viewId}
                />
            )}
            <header style={styles.header} style={{ padding: "2%" }}>
                <Typography variant="h4" color="primary">
                    User
                </Typography>
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
                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </Menu>
                </div>
            </header>
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    margin: "1.5% 2%",
                }}
            >
                <Typography variant="h5">
                    Products ({products.length} found)
                </Typography>
                {!user?.admin && user && (
                    <Button
                        variant="contained"
                        onClick={() => handleAddProductModalOpen("add")}
                    >
                        Add new
                    </Button>
                )}
            </div>
            <hr />
            {products.length > 0 ? (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        flexWrap: "wrap",
                    }}
                >
                    {products.map((product, index) => (
                        <ProductCard
                            product={product}
                            key={product._id}
                            getProducts={getProducts}
                            handleAddProductModalOpen={
                                handleAddProductModalOpen
                            }
                            viewId={viewId}
                        />
                    ))}
                </div>
            ) : (
                <Alert style={{ width: "70%", margin: "auto" }} severity="info">
                    No product added
                </Alert>
            )}
        </div>
    );
}

export default UserData;
