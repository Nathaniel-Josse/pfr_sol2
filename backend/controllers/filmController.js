import filmModel from '../models/film.js';

export const getFilms = async (req, res) => {
    try{
        const films = await filmModel.find();
        res.render('index', { films: films });
    }
    catch(err){
        console.log("Erreur lors de la récupération des données : " + err);
        res.status(500).send('Erreur lors de la récupération des données');
    }
};