import React, { useEffect, useState } from "react";
import axios from "axios";
import { URL } from "../constants/api";
import * as ACTION from "../redux/movie.js";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { movies } from "../service/selectors/movies_selector.js";
import { ToastContainer, toast } from "react-toastify";
import heart from "../assets/heart.svg";
import heartfilled from "../assets/heartfilled.svg";
import watchlist from "../assets/watchlist.svg";
import watchlistfilled from "../assets/watchlistfilled.svg";
import seen from "../assets/seen.svg";
import seenfilled from "../assets/seenfilled.svg";

export default function Home() {

    const store = useSelector((state) => movies(state)); // On utilise useSelector pour récupérer les données du store

    const [lastSort, setLastSort] = useState('title');

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
        const data = await getFilms();
        dispatch(ACTION.FETCH_START())
        try{
            dispatch(ACTION.FETCH_SUCCESS_TITLE(data))
        }catch(err){
            dispatch(ACTION.FETCH_FAILURE(err.message))
        }
    }

    const orderFilmsTitle = async () => {
        displayFilms();
        setLastSort('title');
    }

    const orderFilmsDate = async () => {
        const data = await getFilms();
        dispatch(ACTION.FETCH_START())
        try{
            dispatch(ACTION.FETCH_SUCCESS_DATE(data))
        }
        catch(err){
            dispatch(ACTION.FETCH_FAILURE(err.message))
        }
        setLastSort('date');
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
            if(lastSort === 'title'){
                orderFilmsTitle();
            } else {
                orderFilmsDate();
            }
        }
    }

    const handleWatchList = async (id) => {
        const user = localStorage.getItem('user');
        if(user){
            const response = await axios.post(URL.USER_UPDATE_WATCHLIST, {filmId: id, userId: JSON.parse(user)._id});
            localStorage.setItem('user', JSON.stringify(response.data));
            if(lastSort === 'title'){
                orderFilmsTitle();
            } else {
                orderFilmsDate();
            }
        }
    }

    const handleSeen = async (id) => {
        const user = localStorage.getItem('user');
        if(user){
            const response = await axios.post(URL.USER_UPDATE_SEEN, {filmId: id, userId: JSON.parse(user)._id});
            localStorage.setItem('user', JSON.stringify(response.data));
            if(lastSort === 'title'){
                orderFilmsTitle();
            } else {
                orderFilmsDate();
            }
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
            <h1 className="font-Gill text-center font-bold w-full mb-8 text-2xl">DÉCOUVREZ NOS ARCHIVES !</h1>
            <p className="text-base mb-8">Archives fournies par la Cinémathèque Française.</p>
            <p className="text-xs mb-8"><i>Nombre de films recensés : {store && !store._doc && (store.nom_du_festival == undefined || !store[0].nom_du_festival) ? store.length : ''}</i></p>
            <div className="flex justify-center mb-8">
                <button className={lastSort == 'title' ? "bg-primary text-black font-bold py-2 px-4 rounded mr-2 opacity-50 cursor-not-allowed" : "bg-primary text-black font-bold py-2 px-4 rounded mr-2"} onClick={() => orderFilmsTitle()} disabled={lastSort == 'title' ? true : false}>Trier (A-Z)</button>
                <button className={lastSort == 'date' ? "bg-primary text-black font-bold py-2 px-4 rounded mr-2 opacity-50 cursor-not-allowed" : "bg-primary text-black font-bold py-2 px-4 rounded mr-2"} onClick={() => orderFilmsDate()} disabled={lastSort == 'date' ? true : false}>Trier (Date Croissante)</button>
            </div>
            <table className="w-4/5 text-center font-Gill mr-40">
                <thead>
                    <tr>
                        <th className="text-justify pl-40">Titre</th>
                        <th>Année</th>
                        <th>Détails</th>
                        <th>Vos réactions</th>
                    </tr>
                </thead>
                <tbody>
                    { store && !store._doc && (store.nom_du_festival == undefined || !store[0].nom_du_festival) && store.map((element, index) => { // le !store._doc permet de forcer le rechargement des films si on vient d'une page de détail
                        return (
                            <tr key={index}>
                                <td className="pl-40 text-justify">{manageTitleSize(element.titre)}</td>
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
            <ToastContainer />

        </div>
    );
}