import React, { useEffect, useState } from "react";
import axios from "axios";
import { URL } from "../constants/api";
import * as ACTION from "../redux/movie.js";
import { useDispatch, useSelector } from "react-redux";
import { movies } from "../service/selectors/movies_selector.js";

export default function Seen() {

    const store = useSelector((state) => movies(state)); // On utilise useSelector pour récupérer les données du store

    const getFilms = async () => {
        try {
            const response = await axios.get(URL.FILM_LIST);
            console.log(response);
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
        <div className="p-12 bg-black text-white min-h-screen">
            <h1 className="font-Gill text-center font-bold w-full mb-8 text-2xl">LES FILMS QUE VOUS AVEZ VU</h1>
            <table className="w-4/5 text-center font-Gill">
                <thead>
                    <tr>
                        <th>Titre</th>
                        <th>Année</th>
                        <th>Détails</th>
                        <th>Vos réactions</th>
                    </tr>
                </thead>
                <tbody>
                    { store && !store._doc && store.map((element, index) => { // le !store._doc permet de forcer le rechargement des films si on vient d'une page de détail
                        return (
                            <tr key={index}>
                                <td>{manageTitleSize(element.titre)}</td>
                                <td>{element.annee}</td>
                                <td><button onClick={() => goToFilmDetails(element._id)}>Voir les détails</button></td>
                                <td className="flex justify-center align-middle">
                                    <button onClick={() => handleFavorite(element.id)}>
                                        <svg height="16px" width="16px" stroke={isFavorite(element.id)}
                                        viewBox="0 0 471.701 471.701">
                                        <g>
                                        <path fill={isFavorite(element.id)} d="M433.601,67.001c-24.7-24.7-57.4-38.2-92.3-38.2s-67.7,13.6-92.4,38.3l-12.9,12.9l-13.1-13.1
                                        c-24.7-24.7-57.6-38.4-92.5-38.4c-34.8,0-67.6,13.6-92.2,38.2c-24.7,24.7-38.3,57.5-38.2,92.4c0,34.9,13.7,67.6,38.4,92.3
                                        l187.8,187.8c2.6,2.6,6.1,4,9.5,4c3.4,0,6.9-1.3,9.5-3.9l188.2-187.5c24.7-24.7,38.3-57.5,38.3-92.4
                                        C471.801,124.501,458.301,91.701,433.601,67.001z M414.401,232.701l-178.7,178l-178.3-178.3c-19.6-19.6-30.4-45.6-30.4-73.3
                                        s10.7-53.7,30.3-73.2c19.5-19.5,45.5-30.3,73.1-30.3c27.7,0,53.8,10.8,73.4,30.4l22.6,22.6c5.3,5.3,13.8,5.3,19.1,0l22.4-22.4
                                        c19.6-19.6,45.7-30.4,73.3-30.4c27.6,0,53.6,10.8,73.2,30.3c19.6,19.6,30.3,45.6,30.3,73.3
                                        C444.801,187.101,434.001,213.101,414.401,232.701z"/>
                                        </g>
                                        </svg>
                                    </button>
                                    <button onClick={() => handleWatchList(element.id)}>
                                        <svg viewBox="0 0 32 40" x="0px" y="0px" width="32px" height="24px"><path fill={isWatchListed(element.id)} d="M23.5,12.5a.5.5,0,0,0-.5.5V26a1,1,0,0,1-.49.86,1,1,0,0,1-1,0l-4.59-2.44a2,2,0,0,0-1.88,0l-4.59,2.44a1,1,0,0,1-1,0A1,1,0,0,1,9,26V10.5A2.5,2.5,0,0,1,11.5,8H18a.5.5,0,0,0,0-1H11.5A3.5,3.5,0,0,0,8,10.5V26a2,2,0,0,0,1,1.71A1.91,1.91,0,0,0,10,28a2,2,0,0,0,.94-.24l4.59-2.44a1,1,0,0,1,.94,0l4.59,2.44A2,2,0,0,0,24,26V13A.5.5,0,0,0,23.5,12.5Z"/><path fill={isWatchListed(element.id)} d="M26.5,7H24V4.5a.5.5,0,0,0-1,0V7H20.5a.5.5,0,0,0,0,1H23v2.5a.5.5,0,0,0,1,0V8h2.5a.5.5,0,0,0,0-1Z"/></svg>                        
                                    </button>
                                    <button onClick={() => handleSeen(element.id)}>
                                        <svg height="16px" width="16px"
                                        viewBox="0 0 196.887 196.887">
                                        <g>
                                            <polygon  fill={isSeen(element.id)} points="191.268,26.967 59.541,158.683 5.615,104.76 0,110.386 59.541,169.92 196.887,32.585 	"/>
                                        </g>
                                        </svg>                          
                                    </button>
                                </td>
                            </tr>
                        )
                    }
                    )}
                </tbody>
            </table>

        </div>
    );
}