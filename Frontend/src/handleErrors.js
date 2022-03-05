import { toast } from "react-toastify"

const handleError = (err) =>{
    console.log(err?.response || err);
    toast.error(err?.response?.data?.message || "Something went wrong!")
}

export default handleError