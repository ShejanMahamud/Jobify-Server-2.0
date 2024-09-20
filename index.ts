import cors from 'cors';
import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import { connectDB } from './db/connectDB';
import authRouter from './routes/auth';
import userRouter from './routes/user';
import { CustomError } from './utils/customError';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3478;

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

//setup passport
app.use(passport.initialize());
// app.use(passport.session());

app.get('/', (req: Request, res: Response) => {
  res.send({
    status: 200,
    success: true,
    message: 'Server Running...',
  });
});

//routes
app.use('/auth', authRouter);
app.use('/auth/user', userRouter);

// Handle 404 errors
app.use((req: Request, res: Response, next: NextFunction) => {
  const error = new CustomError('Requested URL Not Found', 404);
  next(error);
});

// Global error handler
app.use((error: Error & { status?: number }, req: Request, res: Response) => {
  console.error(error);
  res.status(error.status || 500).send({
    status: error.status || 500,
    success: false,
    message: error.message || 'Internal Server Error',
  });
});

// Initialize server and connect to the database
(async () => {
  try {
    await connectDB(process.env.MONGO_URI as string);
    app.listen(PORT, () => console.log(`APP RUNNING ON PORT: ${PORT}`));
  } catch (error) {
    console.error('Failed to Start the Server:', error);
    process.exit(1);
  }
})();
