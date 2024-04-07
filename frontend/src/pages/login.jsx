import React, { useEffect, useState } from "react";
import axios from "axios";
import { URL } from "../constants/api";


export default function Login() {
    const [user, setUser] = useState([]);

    const [userLogged, setUserLogged] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const dataForm = {
            username: user.username,
            email: user.email,
            password: user.password
        }
        console.log(dataForm);
        try{
            const { data, status } = await axios.post(URL.USER_LOGIN, dataForm, { withCredentials: true, allowCredentials: true });
            if(status === 200) {
                console.log("data received : ", data);
                setUser(data);
                setUserLogged(data);
                console.log(data)
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

    const handleLogout = async () => {
        try{
            await localStorage.removeItem('user');
            setUserLogged([]);
            setUser([]);
            console.log("Déconnecté");
        } catch(error) {
            console.log(error);
        }
    }

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if(user) {
            setUserLogged(user);
        }
    }, []);

    return(
        <div>
            { !userLogged.username && (
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
            )}
            { userLogged.username && (
                <div>
                    <h1>Bonjour {userLogged.username}. Si vous voulez vous déconnecter, cliquez ci-dessous :</h1>
                    <button onClick={handleLogout}>Se déconnecter</button>
                </div>
            )}
        </div>
    )
}