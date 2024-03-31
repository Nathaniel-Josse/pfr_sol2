import { userModel } from '../models/user.js';
import bcrypt from 'bcrypt';

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

export const signup = async (req, res) => {
    try{
        const user = new userModel(req.body);
        await user.save();
        res.status(201).send(user);
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
        if (!bcrypt.compareSync(req.body.password, user.password)) {
            return res.status(401).send('Mot de passe incorrect');
        }
        res.status(200).send('Connecté');
    }
    catch(err){
        console.log("Erreur lors de la connexion de l'utilisateur : " + err);
        res.status(400).send(err);
    }
}
