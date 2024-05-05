import React, { useEffect, useState } from "react";
import axios from "axios";
import { URL } from "../constants/api";
import * as ACTION from "../redux/movie.js";
import { useDispatch, useSelector } from "react-redux";
import { movies } from "../service/selectors/movies_selector.js";
import posterNotFound from "../assets/poster_not_found.webp";
import heart from "../assets/heart.svg";
import heartfilled from "../assets/heartfilled.svg";
import watchlist from "../assets/watchlist.svg";
import watchlistfilled from "../assets/watchlistfilled.svg";
import seen from "../assets/seen.svg";
import seenfilled from "../assets/seenfilled.svg";


export default function Home() {

    const store = useSelector((state) => movies(state)); // On utilise useSelector pour récupérer les données du store

    const [stockData, setStockData] = useState([]);

    const getFilm = async (id) => {
        try {
            const data = {id: id};
            const response = await axios.post(URL.FILM_DETAILS, data);
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }

    const dispatch = useDispatch(); 

    const displayFilm = async (id) => {
        const data = await getFilm(id);
        setStockData(data);
        dispatch(ACTION.FETCH_START())
        try{
            dispatch(ACTION.FETCH_SUCCESS(data))
        }catch(err){
            dispatch(ACTION.FETCH_FAILURE(err.message))
        }
    }

    const isFavorite = (id) => {
        const user = localStorage.getItem('user');
        if(user){
            const userFavorite = JSON.parse(user).favorites;
            if(userFavorite.includes(id)){
                return heartfilled;
            }
        }
        return heart;
    }

    const isWatchListed = (id) => {
        const user = localStorage.getItem('user');
        if(user){
            const userWatchList = JSON.parse(user).watchlist;
            if(userWatchList.includes(id)){
                return watchlistfilled;
            }
        }
        return watchlist;
    }

    const isSeen = (id) => {
        const user = localStorage.getItem('user');
        if(user){
            const userSeen = JSON.parse(user).seen;
            if(userSeen.includes(id)){
                return seenfilled;
            }
        }
        return seen;
    }

    const handleFavorite = async (id) => {
        const user = localStorage.getItem('user');
        if(user){
            const response = await axios.post(URL.USER_UPDATE_FAVORITES, {filmId: id, userId: JSON.parse(user)._id});
            localStorage.setItem('user', JSON.stringify(response.data));
            displayFilm(store._doc._id);
        }
    }

    const handleWatchList = async (id) => {
        const user = localStorage.getItem('user');
        if(user){
            const response = await axios.post(URL.USER_UPDATE_WATCHLIST, {filmId: id, userId: JSON.parse(user)._id});
            localStorage.setItem('user', JSON.stringify(response.data));
            displayFilm(store._doc._id);
        }
    }

    const handleSeen = async (id) => {
        const user = localStorage.getItem('user');
        if(user){
            const response = await axios.post(URL.USER_UPDATE_SEEN, {filmId: id, userId: JSON.parse(user)._id});
            localStorage.setItem('user', JSON.stringify(response.data));
            displayFilm(store._doc._id);
        }
    }

    useEffect(() => {
        const user = localStorage.getItem('user');
        if(!user){
            window.location.href = '/login';
        }
        const url = window.location.href;
        const id = url.split('/').pop();
        displayFilm(id);
    }, []);
    


    return (
        <div className="p-12 bg-black text-white">
            { store ? (
                <div className="font-Gill">
                    <div className="">
                        <h1 className="text-center font-bold w-full mb-8 text-2xl">{store._doc.titre}</h1>

                        <div className="flex flex-col items-center">

                            <img className="w-1/5 m-4" src={store.poster_path ? "https://image.tmdb.org/t/p/original" + store.poster_path  : posterNotFound} alt={store._doc.titre} />

                            <div className="flex justify-center">
                                <button onClick={() => handleFavorite(store._doc.id)} className="mr-1">
                                    <img src={isFavorite(store._doc.id)} alt="Favoris" width="32px" height="32px" />
                                </button>
                                <button onClick={() => handleWatchList(store._doc.id)}>
                                    <img src={isWatchListed(store._doc.id)} alt="a voir" width="48px" height="32px" />                        
                                </button>
                                <button onClick={() => handleSeen(store._doc.id)} className="ml-1">
                                    <img src={isSeen(store._doc.id)} alt="vu" width="32px" height="32px" />                            
                                </button>
                            </div>
                        </div>
                        <h2 className="text-center w-full mt-8 mb-4 text-2xl">Détails du film :</h2>
                        <div className="p-4">
                            <p>Titre original : {store._doc.titre_original ? store._doc.titre_original : "/"}</p>
                            <p>Sortie : {store._doc.annee}</p>
                            <p>Réalisé par : {store._doc.realisateur}</p>
                            <p>Genre : {store._doc.genre}</p>
                            <p>Nationalité : {store._doc.nationalite}</p>
                            <p>Durée : {store._doc.duree}</p>
                            <p>Synopsis : {store._doc.synopsis}</p>
                            <p>Popularité : {store.popularity ? store.popularity + '%' : "Non communiqué"}</p>
                            <p>Note attribuée : {store.vote_average ? store.vote_average + '/10' : "Non communiqué"}</p>
                            <p>Nombre d'avis : {store.vote_count ? store.vote_count + ' avis' : "Non communiqué"}</p>
                        </div>
                    </div>
                </div>
            ) : ( <h1>Chargement...</h1>)}
        </div>
    );
}