import * as React from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Alert, Button } from "@mui/material";
import handleError from "../handleErrors";
import { AXIOS } from "../axios";
import { toast } from "react-toastify";
import {useNavigate} from 'react-router-dom'

function Row(props) {
    const { row, index, deleteUser } = props;
    const [open, setOpen] = React.useState(false);
    const createdAt = new Date(row.createdAt);
    const navigate = useNavigate()

    return (
        <React.Fragment>
            <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? (
                            <KeyboardArrowUpIcon />
                        ) : (
                            <KeyboardArrowDownIcon />
                        )}
                    </IconButton>
                </TableCell>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.phone}</TableCell>
                <TableCell>{row.address}</TableCell>
                <TableCell>{createdAt.toLocaleDateString()}</TableCell>
                <TableCell>{row.totalProducts}</TableCell>
                <TableCell>
                    <Button
                        variant="outlined"
                        color="secondary"
                        style={{ fontSize: "0.7rem" }}
                        onClick={()=>{
                            navigate("/user", {state: row._id})
                        }}
                    >
                        View
                    </Button>
                    <Button
                        variant="outlined"
                        color="danger"
                        style={{ fontSize: "0.7rem" }}
                        onClick={()=>deleteUser(row._id)}
                    >
                        Delete
                    </Button>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={12}
                >
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography
                                variant="h6"
                                gutterBottom
                                component="div"
                            >
                                Recent activities
                            </Typography>
                            {row.lastActivities.length > 0 ? (
                                <Table size="small" aria-label="purchases">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Date</TableCell>
                                            <TableCell>Action</TableCell>
                                            <TableCell>
                                                Description
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {row.lastActivities.map(
                                            (historyRow, index) => {
                                                const createdAt = new Date(historyRow.createdAt)
                                                return (
                                                <TableRow key={index}>
                                                    <TableCell>
                                                        {createdAt.toLocaleString()}
                                                    </TableCell>
                                                    <TableCell>
                                                        {historyRow.action}
                                                    </TableCell>
                                                    <TableCell>
                                                        {historyRow.description}
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        )}
                                    </TableBody>
                                </Table>
                            ) : (
                                <p>No action was performed</p>
                            )}
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

export default function CollapsibleTable({rows, getAllUsers}) {

    const deleteUser = async (userId) => {
        try {
            await AXIOS.delete("/user/" + userId);
            toast.success("Deleted successfully");
            getAllUsers()
        } catch (error) {
            handleError(error);
        }
    };

    return (
        <>
            {rows.length > 0 ? (
                <TableContainer component={Paper} elevation={10}>
                    <Typography variant="h4" style={{ margin: "0.5% 1.4%" }}>
                        Users
                    </Typography>
                    <Table aria-label="collapsible table">
                        <TableHead>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell>Sr. No.</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Phone</TableCell>
                                <TableCell>Address</TableCell>
                                <TableCell>Created on</TableCell>
                                <TableCell>Total Products</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row, index) => (
                                <Row
                                    key={index}
                                    row={row}
                                    index={index}
                                    deleteUser={deleteUser}
                                />
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Alert severity="info">No Users Added</Alert>
            )}
        </>
    );
}
