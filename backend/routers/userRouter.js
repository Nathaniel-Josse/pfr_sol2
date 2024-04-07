import express from 'express';
import { getUsers, login, register } from '../controllers/userController.js';

const router = express.Router();

router.get('/getusers', getUsers); // à chaque fois qu'on mettra l'URL /getusers, on exécutera la fonction getUsers

router.post('/register', register);

router.post('/login', login);

export default router;