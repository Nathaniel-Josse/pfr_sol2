import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {

    const [data, setData] = useState(null);
    
    const fetchData = async () => {
        const response = await axios.get("http://localhost:2024/getFilms");
        setData(response.data);
    };

    useEffect(() => {
        fetchData();
    }, []);



    
    return (
        <div>
        <h1>Home</h1>

        <h2>Test avec la BDD. Voici les données des films :</h2>

        {data && data.map((film) => (
            <div key={film.id}>
                <h3>{film.titre}</h3>
                <p>{film.realisateur}</p>
                <p>{film.annee}</p>
                <p>{film.nationalite}</p>
                <p>{film.duree}</p>
                <p>{film.genre}</p>
                <p>{film.synopsis}</p>
            </div>
        ))}
        </div>
    );
}