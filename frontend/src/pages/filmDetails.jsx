import React, { useEffect, useState } from "react";
import axios from "axios";
import { URL } from "../constants/api";
import * as ACTION from "../redux/movie.js";
import { useDispatch, useSelector } from "react-redux";
import { movies } from "../service/selectors/movies_selector.js";
import posterNotFound from "../assets/poster_not_found.webp";
import Seen from "../components/seen.js";
import WatchList from "../components/watchlist.js";
import Heart from "../components/heart.js";


export default function Home() {

    const store = useSelector((state) => movies(state)); // On utilise useSelector pour récupérer les données du store

    const [stockData, setStockData] = useState([]);

    const getFilm = async (id) => {
        try {
            const data = {id: id};
            const response = await axios.post(URL.FILM_DETAILS, data);
            console.log(response);
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
                return '#ddd15f';
            }
        }
        return '#fff';
    }

    const isWatchListed = (id) => {
        const user = localStorage.getItem('user');
        if(user){
            const userWatchList = JSON.parse(user).watchlist;
            if(userWatchList.includes(id)){
                return '#ddd15f';
            }
        }
        return '#fff';
    }

    const isSeen = (id) => {
        const user = localStorage.getItem('user');
        if(user){
            const userSeen = JSON.parse(user).seen;
            if(userSeen.includes(id)){
                return '#ddd15f';
            }
        }
        return '#fff';
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
                                <button onClick={() => handleFavorite(store._doc.id)}>
                                    <svg height="32px" width="32px" stroke={isFavorite(store._doc.id)}
                                        viewBox="0 0 471.701 471.701">
                                        <g>
                                        <path fill={isFavorite(store._doc.id)} d="M433.601,67.001c-24.7-24.7-57.4-38.2-92.3-38.2s-67.7,13.6-92.4,38.3l-12.9,12.9l-13.1-13.1
                                        c-24.7-24.7-57.6-38.4-92.5-38.4c-34.8,0-67.6,13.6-92.2,38.2c-24.7,24.7-38.3,57.5-38.2,92.4c0,34.9,13.7,67.6,38.4,92.3
                                        l187.8,187.8c2.6,2.6,6.1,4,9.5,4c3.4,0,6.9-1.3,9.5-3.9l188.2-187.5c24.7-24.7,38.3-57.5,38.3-92.4
                                        C471.801,124.501,458.301,91.701,433.601,67.001z M414.401,232.701l-178.7,178l-178.3-178.3c-19.6-19.6-30.4-45.6-30.4-73.3
                                        s10.7-53.7,30.3-73.2c19.5-19.5,45.5-30.3,73.1-30.3c27.7,0,53.8,10.8,73.4,30.4l22.6,22.6c5.3,5.3,13.8,5.3,19.1,0l22.4-22.4
                                        c19.6-19.6,45.7-30.4,73.3-30.4c27.6,0,53.6,10.8,73.2,30.3c19.6,19.6,30.3,45.6,30.3,73.3
                                        C444.801,187.101,434.001,213.101,414.401,232.701z"/>
                                        </g>
                                    </svg>
                                </button>
                                <button onClick={() => handleWatchList(store._doc.id)}>
                                    <svg viewBox="0 0 32 40" x="0px" y="0px" width="64px" height="48px"><path fill={isWatchListed(store._doc.id)} d="M23.5,12.5a.5.5,0,0,0-.5.5V26a1,1,0,0,1-.49.86,1,1,0,0,1-1,0l-4.59-2.44a2,2,0,0,0-1.88,0l-4.59,2.44a1,1,0,0,1-1,0A1,1,0,0,1,9,26V10.5A2.5,2.5,0,0,1,11.5,8H18a.5.5,0,0,0,0-1H11.5A3.5,3.5,0,0,0,8,10.5V26a2,2,0,0,0,1,1.71A1.91,1.91,0,0,0,10,28a2,2,0,0,0,.94-.24l4.59-2.44a1,1,0,0,1,.94,0l4.59,2.44A2,2,0,0,0,24,26V13A.5.5,0,0,0,23.5,12.5Z"/><path fill={isWatchListed(store._doc.id)} d="M26.5,7H24V4.5a.5.5,0,0,0-1,0V7H20.5a.5.5,0,0,0,0,1H23v2.5a.5.5,0,0,0,1,0V8h2.5a.5.5,0,0,0,0-1Z"/></svg>                  
                                </button>
                                <button onClick={() => handleSeen(store._doc.id)}>
                                    <svg height="32px" width="32px"
                                    viewBox="0 0 196.887 196.887">
                                    <g>
                                        <polygon  fill={isSeen(store._doc.id)} points="191.268,26.967 59.541,158.683 5.615,104.76 0,110.386 59.541,169.92 196.887,32.585 	"/>
                                    </g>
                                    </svg>                     
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