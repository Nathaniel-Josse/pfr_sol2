import express from 'express';
import { getUsers, signup, login } from '../controllers/userController.js';

const router = express.Router();

router.get('/getusers', getUsers); // à chaque fois qu'on mettra l'URL /getUsers, on exécutera la fonction getUsers

router.post('/signup', signup);

router.post('/login', login);

export default router;