import React, { useEffect } from "react";
import axios from "axios";
import { URL } from "../constants/api";

export default function Home() {

    const getFilms = async () => {
        try {
            const response = await axios.get(URL.FILM_LIST);
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getFilms();
    }, []);
    


    return (
        <div>
        <h1>Home</h1>
        </div>
    );
}