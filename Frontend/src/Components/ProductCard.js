import * as React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { CardContent, Typography } from "@mui/material";
import handleError from "../handleErrors";
import { AXIOS } from "../axios";
import { toast } from "react-toastify";
import { UseMainContext } from "../context";

export default function ProductCard({product, getProducts, handleAddProductModalOpen, viewId}) {
    const {name, description, imageUrl, price, createdAt} = product;
    const {user} = UseMainContext()

    const date = new Date(createdAt);

    const deleteProduct = async () => {
        try {
            await AXIOS.delete(`/products/${viewId || user?.userId}/${product._id}`)
            getProducts()
            toast.success(`Product deleted successfully`)
        } catch (error) {
            handleError(error)
        }
    }

    return (
        <Card sx={{ maxWidth: 290, margin: "1.3% auto" }} elevation={4}>
            <CardHeader
                title={name}
                subheader={date.toLocaleDateString()}
            />
            <CardMedia
                component="img"
                height="194"
                image={imageUrl}
                alt={name}
            />
            <CardContent>
                <Typography variant="body2" color="text.secondary">
                    {description}
                </Typography>
            </CardContent>
            <CardActions disableSpacing>
                <Typography style={{marginRight: "4%"}} variant="h5" color="text.secondary">
                    Rs.{price}
                </Typography>
                <IconButton aria-label="add to favorites">
                    <EditIcon onClick={()=>handleAddProductModalOpen("update", product)} />
                </IconButton>
                <IconButton aria-label="share">
                    <DeleteIcon onClick={deleteProduct} />
                </IconButton>
            </CardActions>
        </Card>
    );
}
