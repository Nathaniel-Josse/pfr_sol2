import { express } from "express";
import { getFilms } from "../controllers/filmController";

const router = express.Router();

router.post('/getfilms', getFilms); // à chaque fois qu'on mettra l'URL /getFilms, on exécutera la fonction getFilms

export default router;