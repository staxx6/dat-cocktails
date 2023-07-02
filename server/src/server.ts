import express, { Application, Request, Response } from 'express';

const app = express();
const port = 8000;

app.get('/', (req: Request, res: Response): void => {
  res.send('Express + TypeScript Server');
  console.log("Hello World!");
});

app.listen(port, () => {
	console.log(`⚡️ [server]: Server is running at http://localhost:${port}/`);
})
