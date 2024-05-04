import React, { useEffect, useState } from "react";
import axios from "axios";
import { URL } from "../constants/api";
import * as ACTION from "../redux/movie.js";
import { useDispatch, useSelector } from "react-redux";
import { movies } from "../service/selectors/movies_selector.js";
import leaflet from "leaflet";
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';

delete leaflet.Icon.Default.prototype._getIconUrl;

leaflet.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

export default function NearEvents() {

    const store = useSelector((state) => movies(state)); // On utilise useSelector pour récupérer les données du store

    const [nearEventsStock, setNearEventsStock] = useState([{}]);

    const [position, setPosition] = useState([]);

    const getNearEvents = async () => {
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(async (position) => {
                const data = {
                    lat: position.coords.latitude,
                    lon: position.coords.longitude
                }
                setPosition([position.coords.latitude, position.coords.longitude]);
                try {
                    await axios.post(URL.FILM_NEAR_EVENTS, data)
                    .then((response) => {
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
            <h2 className="text-center text-2xl font-bold mt-8">Prenez part à la culture du cinéma et de l'art près de chez vous !</h2>

        { store ? (
            <MapContainer center={[position[0], position[1]]} zoom={13} scrollWheelZoom={false} className="h-60 w-30 mt-4">
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[position[0], position[1]]}>
                    <Popup>
                        Vous êtes ici
                    </Popup>
                </Marker>
                {store.map((event, index) => (
                    <Marker position={[event.geocodage_xy.lat, event.geocodage_xy.lon]}>
                        <Popup>
                            {event.nom_du_festival}
                        </Popup>
                    </Marker>
                ))}
                
            </MapContainer>
        ) : <p>Chargement des événements...</p>}
    
            <h2 className="text-center text-base font-bold mt-8">Pour vous renseigner sur ces événements, cliquez sur les cases ci-dessous pour découvrir leur site</h2>
            <div className="flex flex-wrap justify-center mt-4">
                { store ? store.map((event, index) => (
                    <div key={index} className="bg-primary text-black m-4 p-4 rounded-lg w-1/4 flex items-center justify-center">
                        <a href={event.site_internet_du_festival} target="_blank" rel="noreferrer">
                            <h2 className="text-2xl font-bold text-center">{event.nom_du_festival}</h2>
                            <p className="text-center mt-2">
                                <small><i>Thématique : {event.discipline_dominante}</i></small>
                            </p>
                        </a>
                    </div>
                )) : []}
            </div>

        </div>
    );
}