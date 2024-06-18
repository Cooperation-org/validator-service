import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.post('/', (req: Request, res: Response) => {
  const { email } = req.body;
  res.status(200).json({ message: `Hello ${email}` });
});

// Starting the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
