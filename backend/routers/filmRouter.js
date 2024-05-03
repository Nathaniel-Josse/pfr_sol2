import express from "express";
import { getFilms, getFilm, getFilmById, getNearEvents } from "../controllers/filmController.js";

const router = express.Router();

router.get('/getfilms', getFilms); // à chaque fois qu'on mettra l'URL /getfilms, on exécutera la fonction getFilms

router.post('/getfilm', getFilm);

router.post('/getfilmbyid', getFilmById);

router.post('/getnearevents', getNearEvents);

export default router;