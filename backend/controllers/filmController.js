import filmModel from '../models/film.js';

export const getFilms = async (req, res) => {
    try{
        const films = await filmModel.find();
        res.status(200).json(films);
    }
    catch(err){
        console.log("Erreur lors de la récupération des données : " + err);
        res.status(500).send('Erreur lors de la récupération des données');
    }
};