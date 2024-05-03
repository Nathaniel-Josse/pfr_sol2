import userModel from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../config/index.js';
import sanitizehtml from 'sanitize-html';

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
        const data = await req.body;
        const usernameData = sanitizehtml(data.username);
        const emailData = sanitizehtml(data.email);
        const passwordData = sanitizehtml(data.password);
        const doesUserAlreadyExist = await userModel.findOne({ email: emailData });
        if (doesUserAlreadyExist) {
            return res.status(409).send('Cet email est déjà utilisé');
        }
        const passwordHashed = await bcrypt.hash(passwordData, 10);
        const newUser = await userModel.create({
            username: usernameData,
            email: emailData,
            password: passwordHashed,
            role: 0,
            favorites: [],
            seen: [],
            watchlist: []
        })
        res.status(201).json({message : "Nouvel utilisateur créé !", user: newUser})
    }
    catch(err){
        console.log("Erreur lors de la création de l'utilisateur : " + err);
        res.status(400).send(err);
    }
};

export const login = async (req, res) => {
    try{
        const data = await req.body;
        const emailData = sanitizehtml(data.email);
        const passwordData = sanitizehtml(data.password);
        const user = await userModel.findOne({ email: emailData });
        if (!user) {
            return res.status(404).send('Email ou Mot de passe incorrect');
        }
        if (!bcrypt.compare(passwordData, user.password)) {
            return res.status(401).send('Email ou Mot de passe incorrect');
        }

        const token = jwt.sign(
            {id: user._id},
            env.token,
            {expiresIn: "24h"}
        );

        const {password, ...others} = user._doc;

        console.log("Connexion réussie pour l'utilisateur : " + others.username);

        res.cookie('access_token', token, { httpOnly: true }).status(200).json(others);
    }
    catch(err){
        console.log("Erreur lors de la connexion de l'utilisateur : " + err);
        res.status(400).send("Erreur lors de la connexion de l'utilisateur");
    }
};

export const updateFavorites = async (req, res) => {
    try{
        const user = await userModel.findById(req.body.userId);
        let message = "";
        if (user.favorites.includes(req.body.filmId)) {
            user.favorites = user.favorites.filter((id) => id !== req.body.filmId);
            //message = "Film retiré des favoris";
        } else {
            user.favorites.push(req.body.filmId);
            //message = "Film ajouté aux favoris";
        }
        await user.save();
        const {password, ...others} = user._doc;
        //res.status(200).json({message: message, data: others});
        res.status(200).json(others);
    }
    catch(err){
        console.log("Erreur lors de la mise à jour des favoris de l'utilisateur : " + err);
        res.status(400).send("Erreur lors de la mise à jour des favoris de l'utilisateur");
    }
}
export const updateSeen = async (req, res) => {
    try{
        const user = await userModel.findById(req.body.userId);
        if (user.seen.includes(req.body.filmId)) {
            user.seen = user.seen.filter((id) => id !== req.body.filmId);
        } else {
            user.seen.push(req.body.filmId);
        }
        await user.save();
        const {password, ...others} = user._doc;
        res.status(200).json(others);
    }
    catch(err){
        console.log("Erreur lors de la mise à jour des films vus de l'utilisateur : " + err);
        res.status(400).send("Erreur lors de la mise à jour des films vus de l'utilisateur");
    }
}
export const updateWatchList = async (req, res) => {
    try{
        const user = await userModel.findById(req.body.userId);
        if (user.watchlist.includes(req.body.filmId)) {
            user.watchlist = user.watchlist.filter((id) => id !== req.body.filmId);
        } else {
            user.watchlist.push(req.body.filmId);
        }
        await user.save();
        const {password, ...others} = user._doc;
        res.status(200).json(others);
    }
    catch(err){
        console.log("Erreur lors de la mise à jour des films à voir de l'utilisateur : " + err);
        res.status(400).send("Erreur lors de la mise à jour des films à voir de l'utilisateur");
    }
}


