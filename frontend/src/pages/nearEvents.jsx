import React, { useEffect, useState } from "react";
import axios from "axios";
import { URL } from "../constants/api";
import * as ACTION from "../redux/movie.js";
import { useDispatch, useSelector } from "react-redux";
import { movies } from "../service/selectors/movies_selector.js";
import leaflet from "leaflet";


export default function NearEvents() {

    const store = useSelector((state) => movies(state)); // On utilise useSelector pour récupérer les données du store

    const [nearEventsStock, setNearEventsStock] = useState([{}]);

    const getNearEvents = async () => {
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(async (position) => {
                const data = {
                    lat: position.coords.latitude,
                    lon: position.coords.longitude
                }
                console.log(data);
                try {
                    await axios.post(URL.FILM_NEAR_EVENTS, data)
                    .then((response) => {
                        console.log("Retour des events proches", response);
                        setNearEventsStock(response.data.results);
                        dispatchNearEvents(response.data.results);
                    });
                } catch (error) {
                    console.error(error);
                }
            });
        } else {
            console.log("La géolocalisation n'est pas disponible.");
        }
    }

    const dispatch = useDispatch();

    const dispatchNearEvents = async (nearEvents) => {
        console.log("Events proches : ", nearEvents)
        dispatch(ACTION.FETCH_START())
        try{
            dispatch(ACTION.FETCH_SUCCESS(nearEvents))
        }catch(err){
            dispatch(ACTION.FETCH_FAILURE(err.message))
        }
    }

    useEffect(() => {
        const user = localStorage.getItem('user');
        if(!user){
            window.location.href = '/login';
        }
        getNearEvents();
    }, []);
    


    return (
        <div className="p-12 bg-black text-white min-h-screen">
            <h1 className="text-3xl font-bold text-center">Événements à proximité</h1>

            <div className="flex flex-wrap justify-center mt-4">
                { store ? store.map((event, index) => (
                    <div key={index} className="bg-white text-black m-4 p-4 rounded-lg w-1/4">
                        <h2 className="text-2xl font-bold">{event.nom_du_festival}</h2>
                    </div>
                )) : []}
            </div>

        </div>
    );
}