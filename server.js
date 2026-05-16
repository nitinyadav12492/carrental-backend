import express from "express"
import "dotenv/config"
import cors from "cors";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import ownerRouter from "./routes/ownerRoutes.js"
import bookingRouter from "./routes/bookingRoutes.js";

// initialize express ap

const app = express()
//connect database
await connectDB()



// middleware

app.use(cors());

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://fancy-gecko-bb595b.netlify.app"
  ],
  credentials: true,
}));
app.use(express.json());

app.get("/",(req,res)=> res.send("server is running"))
app.use('/api/user',userRouter)
app.use("/api/owner", ownerRouter)
app.use("/api/bookings", bookingRouter)

const PORT = process.env.PORT || 3000;

app.listen(PORT,()=> console.log(`server is running on ${PORT}`))