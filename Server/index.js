import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";

import userRoutes from "./routes/user.js";
import postsRoutes from "./routes/posts.js";
import bookingsRoutes from "./routes/bookings.js";
import categoryRoutes from "./routes/category.js";
import frequentRequestsRoutes from "./routes/frequentRequests.js";
import rolesRouter from "./routes/roles.js";
import adminRouter from "./routes/admin.js";

const app = express();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use("/user", userRoutes);
app.use("/posts", postsRoutes);
app.use("/bookings", bookingsRoutes);
app.use("/categories", categoryRoutes);
app.use("/frequentRequests", frequentRequestsRoutes);
app.use("/roles", rolesRouter);
app.use("/admin", adminRouter);

app.get("/", (req, res) => {
    res.send("APP is running");
});

const CONNECTION_URL = "mongodb+srv://DiamondMongo:Jalda2020@cluster0.zqtv6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const PORT = process.env.PORT || 5000;

mongoose
    .connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`)))
    .catch((error) => console.log(error));
