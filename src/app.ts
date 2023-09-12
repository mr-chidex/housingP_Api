import express from "express";
import "dotenv/config";
import "reflect-metadata";
import cors from "cors";

const app = express();
app.use(cors());
app.disable("x-powered-by");
// app.use(morgan('dev'));

export default app;
