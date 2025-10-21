import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import allRoutes from './src/routes/index.js'
import { verifyToken } from './src/middlewares/authMiddleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors({
  origin: process.env.CLIENT_URL
}));
app.use(express.json());

app.use(verifyToken);
app.use('/api', allRoutes); 

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});