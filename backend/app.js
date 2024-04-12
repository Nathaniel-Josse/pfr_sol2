'use strict';

import express from 'express';
import ejs from 'ejs';
import xlsx from 'node-xlsx';
import fs from 'fs';
import Film from './models/film.js';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import userRouter from './routers/userRouter.js';
import filmRouter from './routers/filmRouter.js';

const app = express();

const path = 'assets/table/film.xlsx';

// Lien à MongoDB
mongoose
    .connect('mongodb://localhost:27017/cinematheque')
    .then(() => console.log("Connexion à MongoDB réussie !"))
    .catch((err) => console.log("Connexion à MongoDB échouée !", err));

// Middleware
app.use(express.json()); // permet de parser le body des requêtes POST. Sans ça, req.body est undefined dans le controller.
app.use(cors({credentials: true, origin: 'http://localhost:3000'})); // permet de gérer les requêtes cross-origin. Sans ça, on ne pourrait pas faire de requête depuis le front-end vers le back-end.
app.use(cookieParser()); // permet de parser les cookies. Sans ça, req.cookies est undefined dans le controller.

// Préfixes des routes
app.use('/api/user', userRouter); // à chaque fois qu'on mettra l'URL /api/user, on exécutera le router userRouter. C'est un middleware.
app.use('/api/film', filmRouter);

// Fonction d'update de la base de données
const handleUpdate = async () => {
    let film = await Film.deleteMany(); // on supprime tous les documents de la collection pour update

    const filmXlsx = xlsx.parse(path); // on récupère le fichier excel
    const filmData = filmXlsx[0].data; // on récupère les données du fichier excel
    let filmStock = new Film(); // On va mettre en place un stock pour les films ayant plusieurs réalisateurs
    let id = 1; // on initialise l'id à 1. On va l'incrémenter à chaque film, sauf si le film a plusieurs réalisateurs
    for await (const data of filmData) {
        if (data[0] !== 'Id'){ // on ignore la première ligne du fichier excel
            let currentFilm = new Film({
                id: data[0],
                titre: data[1],
                titre_original: data[2],
                realisateur: data[3],
                annee: data[4],
                nationalite: data[5],
                duree: data[6],
                genre: data[7],
                synopsis: data[8]
            });
            // --- FILTERS --- //
            // on enlève les balises html
            currentFilm.synopsis = currentFilm.synopsis.replace(/<[^>]*>?/gm, '');
            if (currentFilm.titre === filmStock.titre) { // Si le titre est le même que le film d'avant, c'est que le film a plusieurs réalisateurs. On va alors mettre à jour le film d'avant.
                currentFilm.realisateur = filmStock.realisateur + ', ' + currentFilm.realisateur; // on met à jour les réalisateurs
                currentFilm.id = filmStock.id; // on met à jour l'id
            // --- END OF FILTERS --- //
            } else {
                currentFilm.id = id; // on met à jour l'id
                id++; // on incrémente l'id
                if(currentFilm.id !== 1){ // on ne sauvegarde pas le premier film (qui est vide)
                    filmStock.save();
                }
            }
            // on met à jour le film courant
            filmStock = currentFilm;
        }
    };
};

if (fs.existsSync(path)) {
    fs.watchFile(path, async () => { // watchFile est instable, à surveiller
        await handleUpdate();
        console.log("MàJ Done !");
    });
}

// MàJ de la base de données
app.get('/manual-refresh', async (req, res) => {
    await handleUpdate();
    console.log("MàJ manuelle Done !");
    res.redirect('/');
});

app.listen(2024, () => {
    console.log('Serveur lancé sur le port 2024');
})