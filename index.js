const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const { errorHandler } = require("./config/errorHandler");
const { authorisation } = require("./Middlewares/Authorisation");
const path = require("path");

//Controllers
const { login } = require("./Controller/user");

//Inported routes
const userRoutes = require("./Routes/user");
const productsRoutes = require("./Routes/products");
const activitiesRoutes = require("./Routes/activities");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    console.log(req.method, req.originalUrl);
    next();
});

//Base routes
app.get("/api", (req, res) => {
    res.json({ message: "Server running...From base route" });
});

//Route for getting documents
app.use("/documents/", express.static("documents"));
app.use("/documents/", (req, res) => {
    res.status(404).json({ message: "Document Not Found" });
});

//Login
app.post("/api/login", login);

//Auth
app.use("/api", authorisation);

//routes
app.use("/api/user", userRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/activities", activitiesRoutes);

//Post react build code when deploying
if(process.env.NODE_ENV === 'production'){
    //set static assets
    app.use(express.static('./client/build'))

    //Provides front end
    app.get('*', (req, res)=>{
        res.sendFile(path.resolve(__dirname,'Frontend','build', 'index.html'))
    })
}

//Not found
app.use("*", (req, res) => {
    res.status(404).json({ message: "Not found!" });
});

//Error handler
app.use(errorHandler);

//Add port
const PORT = process.env.PORT || 4000

const startDB = async () => {
    try {
        await mongoose.connect(process.env.MONGOOSE_URI);
        app.listen(PORT, () => console.log("Server started!"));
    } catch (error) {
        console.log(error.message);
    }
};

startDB();
