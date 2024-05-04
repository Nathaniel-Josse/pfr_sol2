import filmModel from '../models/film.js';
import axios from 'axios';
import { env } from '../config/index.js';

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

export const getFilmById = async (req, res) => {
    try{
        const film = await filmModel.findById(req.body._id);
        res.status(200).json(film);
    }
    catch(err){
        console.log("Erreur lors de la récupération des données : " + err);
        res.status(500).send('Erreur lors de la récupération des données');
    }
}

export const getFilm = async (req, res) => {
    try{
        const film = await filmModel.findById(req.body.id);
        const titleParsed = film.titre.replace(/ /g, '%20');
        const options = {
            method: 'GET',
            url: `https://api.themoviedb.org/3/search/movie?query=${titleParsed}&include_adult=false&page=1`,
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer ' + env.tmdb_api_key
            }
        }; 
        axios
        .request(options)
        .then(function (response) {
            const results = response.data.results;
            const completeFilm = results.find((element) => element.release_date.substring(0, 4) == film.annee);
            const completedFilm = {
                ...film,
                ...completeFilm
            }
            res.status(200).json(completedFilm);
        })
        .catch(function (error) {
            console.error("Erreur lors de la récupération de l'API externe : ", error);
            res.status(200).json(film);
        });
    }
    catch(err){
        console.log("Erreur lors de la récupération des données : " + err);
        res.status(500).send('Erreur lors de la récupération des données');
    }
};

export const getNearEvents = async (req, res) => {
    try{
        const lat = req.body.lat;
        const lon = req.body.lon;
        const response = await axios.get(`https://data.culture.gouv.fr/api/explore/v2.1/catalog/datasets/festivals-global-festivals-_-pl/records?where=%20within_distance(geocodage_xy%2C%20geom'POINT(${lon}%20${lat})'%2C%2030km)&limit=9`)
        res.status(200).json(response.data);
    }
    catch(err){
        console.log("Erreur lors de la récupération des données : " + err);
        res.status(500).send('Erreur lors de la récupération des données');
    }
}