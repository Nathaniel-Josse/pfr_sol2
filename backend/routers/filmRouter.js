import express from "express";
import { getFilms } from "../controllers/filmController.js";

const router = express.Router();

router.get('/getfilms', getFilms); // à chaque fois qu'on mettra l'URL /getfilms, on exécutera la fonction getFilms

export default router;