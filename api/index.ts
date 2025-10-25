import express, {Request, Response} from "express";
import dotenv from "dotenv";
import db from "./models/index.js";
import userRoute from "./routes/user.route.js";
import protectedRoute from "./routes/protected.route.js";
import bookRoute from "./routes/book.route.js";
import { errorHandler } from "./middlewares/errors.middleware.js";

dotenv.config();


try {
        await db.sequelize.authenticate();
        await db.sequelize.sync(); 
        console.log("Database connected and synced.");
    } catch (err) {
        console.error("Unable to connect to the database:", err);
        process.exit(1);
    }

const app = express();

app.use(express.json());

app.use("/auth", userRoute);
app.use("/protected", protectedRoute);
app.use("/books", bookRoute);

app.get("/", (req: Request, res: Response) => {
  res.send({ message: "Hello World! Welcome to L-I-F-E!" });
});

app.use((req, res) => {
    res.status(404).json({ message: `Cannot ${req.method} ${req.path}` });
});

app.use(errorHandler);

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen(PORT, () => {
  console.log(`App is listening on http://localhost:${PORT}/`);
});
