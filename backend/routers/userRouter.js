import express from 'express';
import { getUsers, login, register, updateFavorites, updateSeen, updateWatchList } from '../controllers/userController.js';

const router = express.Router();

router.get('/getusers', getUsers); // à chaque fois qu'on mettra l'URL /getusers, on exécutera la fonction getUsers

router.post('/register', register);

router.post('/login', login);

router.post('/updateFavorites', updateFavorites);

router.post('/updateSeen', updateSeen);

router.post('/updateWatchList', updateWatchList);

export default router;