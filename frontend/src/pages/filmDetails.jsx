import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function Details() {
    const store = useSelector((state) => state.movie.data[0]);

    return (
        <div>
            <h1>{store.title}</h1>
            <p>{store.description}</p>
            <Link to="/home">Retour</Link>
        </div>
    )
}