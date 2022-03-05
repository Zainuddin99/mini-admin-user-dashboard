import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box, Modal, Typography } from "@mui/material";
import { makeStyles } from "@material-ui/core";
import { AXIOS } from "../axios";
import { useEffect, useState } from "react";
import handleError from "../handleErrors";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    backgroundColor: "#fff",
    border: "none",
    padding: "1% 4%",
    minWidth: "400px",
    overflow: "scroll",
    height: "100%",
};

export default function Activities({ open, handleClose }) {
    const [activities, setActivities] = useState([])

    useEffect(()=>{
        const getActivities = async() =>{
            try {
                const response = await AXIOS.get("/activities");
                setActivities(response.data.message)
            } catch (error) {
                handleError(error);
            }
        }
        getActivities()
    }, [])

    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box style={style}>
                    <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h2"
                    >
                        Activities ({activities.length} Activities)
                    </Typography>
                    <hr />
                    <ActivitiesTable activities={activities}/>
                </Box>
            </Modal>
        </div>
    );
}

function ActivitiesTable({activities}) {
    return (
        <TableContainer component={Paper}>
            <Table
                sx={{ minWidth: 650 }}
                size="small"
                aria-label="a dense table"
            >
                <TableHead>
                    <TableRow>
                        <TableCell style={{fontWeight: "bold"}}>User</TableCell>
                        <TableCell style={{fontWeight: "bold"}}>Role</TableCell>
                        <TableCell style={{fontWeight: "bold"}}>Action</TableCell>
                        <TableCell style={{fontWeight: "bold"}}>Date</TableCell>
                        <TableCell style={{fontWeight: "bold"}}>Description</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {activities.map((row) => {
                        const date = new Date(row.createdAt)
                        return (
                            <TableRow
                                key={row._id}
                                sx={{
                                    "&:last-child td, &:last-child th": {
                                        border: 0,
                                    },
                                }}
                            >
                                <TableCell>{row?.user?.name}</TableCell>
                                <TableCell>
                                    {row?.user?.admin ? "Admin" : "User"}
                                </TableCell>
                                <TableCell>{row.action}</TableCell>
                                <TableCell>{date.toLocaleString()}</TableCell>
                                <TableCell>{row.description}</TableCell>
                            </TableRow>
                        );})}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

