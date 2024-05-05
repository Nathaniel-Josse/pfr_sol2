import React, { useEffect, useState } from "react";
import axios from "axios";
import { URL } from "../constants/api";
import * as ACTION from "../redux/movie.js";
import { useDispatch, useSelector } from "react-redux";
import { movies } from "../service/selectors/movies_selector.js";
import heart from "../assets/heart.svg";
import heartfilled from "../assets/heartfilled.svg";
import watchlist from "../assets/watchlist.svg";
import watchlistfilled from "../assets/watchlistfilled.svg";
import seen from "../assets/seen.svg";
import seenfilled from "../assets/seenfilled.svg";

export default function Seen() {

    const store = useSelector((state) => movies(state)); // On utilise useSelector pour récupérer les données du store

    const [isLoading, setIsLoading] = useState(true);

    const getFilms = async () => {
        try {
            const response = await axios.get(URL.FILM_LIST);
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }

    const goToFilmDetails = (id) => {
        window.location.href = `/film-details/${id}`;
    }

    const manageTitleSize = (title) => {
        if (title.length > 40) {
            return title.substring(0, 40) + '[...]';
        }
        return title;
    }

    const dispatch = useDispatch(); 

    const displayFilms = async () => {
        const films = await getFilms();
        const user = localStorage.getItem('user');
        const userSeen = JSON.parse(user).seen;
        const userSeenFilms = films.filter(film => userSeen.includes(film.id));
        dispatch(ACTION.FETCH_START())
        try{
            dispatch(ACTION.FETCH_SUCCESS_TITLE(userSeenFilms))
            setIsLoading(false);
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
            displayFilms();
        }
    }

    const handleWatchList = async (id) => {
        const user = localStorage.getItem('user');
        if(user){
            const response = await axios.post(URL.USER_UPDATE_WATCHLIST, {filmId: id, userId: JSON.parse(user)._id});
            localStorage.setItem('user', JSON.stringify(response.data));
            displayFilms();
        }
    }

    const handleSeen = async (id) => {
        const user = localStorage.getItem('user');
        if(user){
            const response = await axios.post(URL.USER_UPDATE_SEEN, {filmId: id, userId: JSON.parse(user)._id});
            localStorage.setItem('user', JSON.stringify(response.data));
            displayFilms();
        }
    }


    let storeApp = [];

    useEffect(() => {
        const user = localStorage.getItem('user');
        if(!user){
            window.location.href = '/login';
        }
        displayFilms();
    }, []);
    


    return (
        <div className="p-12 bg-black text-white min-h-screen flex flex-col items-center">
            <h1 className="font-Gill text-center font-bold w-full mb-8 text-2xl">LES FILMS QUE VOUS AVEZ VU</h1>
            <table className="w-4/5 text-center font-Gill">
                <thead>
                    <tr>
                        <th className="text-justify pl-20">Titre</th>
                        <th>Année</th>
                        <th>Détails</th>
                        <th>Vos réactions</th>
                    </tr>
                </thead>
                <tbody>
                    { store && !store._doc && !isLoading && store.map((element, index) => { // le !store._doc permet de forcer le rechargement des films si on vient d'une page de détail
                        return (
                            <tr key={index}>
                                <td className="text-justify pl-20">{manageTitleSize(element.titre)}</td>
                                <td>{element.annee}</td>
                                <td><button onClick={() => goToFilmDetails(element._id)}>Voir les détails</button></td>
                                <td className="flex justify-center align-middle">
                                <button onClick={() => handleFavorite(element.id)} className="mr-1">
                                        <img src={isFavorite(element.id)} alt="Favoris" width="16px" height="16px" />
                                    </button>
                                    <button onClick={() => handleWatchList(element.id)}>
                                        <img src={isWatchListed(element.id)} alt="a voir" width="24px" height="16px" />                        
                                    </button>
                                    <button onClick={() => handleSeen(element.id)} className="ml-1">
                                        <img src={isSeen(element.id)} alt="vu" width="16px" height="16px" />                            
                                    </button>
                                </td>
                            </tr>
                        )
                    }
                    )}
                </tbody>
            </table>
            {store[0] == null && <p className="mt-8">Oh ! Vous n'avez pas encore de films dans votre liste de films vus.</p>}

        </div>
    );
}