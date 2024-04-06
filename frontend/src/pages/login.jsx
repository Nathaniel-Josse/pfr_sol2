import React, { useState } from "react";
import axios from "axios";
import { URL } from "../constants/api";


export default function Login() {
    const [user, setUser] = useState([]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const dataForm = {
            username: user.username,
            email: user.email,
            password: user.password
        }
        console.log(dataForm);
        try{
            const { data, status } = await axios.post(URL.USER_LOGIN, dataForm);
            if(status === 200) {
                setUser(data);
                await localStorage.setItem('user', JSON.stringify(data));
            }
        } catch(error) {
            console.log(error);
        }
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setUser(user => ({ ...user, [name]: value}));
    }

    return(
        <div>
            <h1>Connexion</h1>
            <form action="" method="get">
                <label for="username">Nom d'utilisateur : </label>
                <input 
                    type="text"
                    name="username"
                    onChange={handleChange}
                ></input><br></br>
                <label for="email">Email : </label>
                <input 
                    type="email"
                    name="email"
                    onChange={handleChange}
                ></input><br></br>
                <label for="password">Mot de passe : </label>
                <input 
                    type="password" 
                    placeholder="Votre mot pour passer"
                    name="password" 
                    onChange={handleChange}
                ></input><br></br>
                
                <button onClick={handleSubmit}>Valider</button>
            </form>

            <p>Pas encore inscrit ?</p>
            <a href="/register">S'inscrire</a>
        </div>
    )
}