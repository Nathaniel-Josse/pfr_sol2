import userModel from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../config/index.js';

export const getUsers = async (req, res) => {
    try{
        const users = await userModel.find();
        res.render('index', { users: users });
    }
    catch(err){
        console.log("Erreur lors de la récupération des données : " + err);
        res.status(500).send('Erreur lors de la récupération des données');
    }
};

export const register = async (req, res) => {
    try{
        console.log(req.body);
        const passwordHashed = await bcrypt.hash(req.body.password, 10);
        const data = await req.body;
        const newUser = await userModel.create({
            ...req.body,
            password: passwordHashed,
            role: 0,
            favorites: [],
            seen: [],
            watchlist: []
        })
        res.status(201).json({message : "Nouvel utilisateur créé : ", newUser})
    }
    catch(err){
        console.log("Erreur lors de la création de l'utilisateur : " + err);
        res.status(400).send(err);
    }
};

export const login = async (req, res) => {
    try{
        const user = await userModel.findOne({ username: req.body.username });
        if (!user) {
            return res.status(404).send('Utilisateur non trouvé');
        }
        if (!bcrypt.compare(req.body.password, user.password)) {
            return res.status(401).send('Mot de passe incorrect');
        }

        const token = jwt.sign(
            {id: user._id},
            env.token,
            {expiresIn: "24h"}
        );

        const {password, ...others} = user._doc;

        res.cookie('access_token', token, { httpOnly: true }).status(200).json(others);
    }
    catch(err){
        console.log("Erreur lors de la connexion de l'utilisateur : " + err);
        res.status(400).send(err);
    }
}

export const logout = async (req, res) => {
    try{
        localStorage.removeItem('user');
        res.status(200).send('Déconnecté');
    }
    catch(err){
        console.log("Erreur lors de la déconnexion de l'utilisateur : " + err);
        res.status(400).send(err);
    }
}
