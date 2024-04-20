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
        <div className="bg-black text-white p-12 text-center">
            { !userLogged.username && (
                <div className="font-Gill">
                    <h1 className="text-center font-bold w-full mb-8 text-2xl">CONNEXION</h1>
                    <form action="" method="get">
                        <label for="username" className="block text-primary text-sm font-bold">Nom d'utilisateur : </label><br></br>
                        <input 
                            type="text"
                            name="username"
                            placeholder="Votre nom d'utilisateur"
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-1/4 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        ></input><br></br>
                        <label for="email" className="block text-primary text-sm font-bold mt-8">Email : </label><br></br>
                        <input 
                            type="email"
                            name="email"
                            placeholder="Votre email"
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-1/4 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        ></input><br></br>
                        <label for="password" className="block text-primary text-sm font-bold mt-8">Mot de passe : </label><br></br>
                        <input 
                            type="password" 
                            placeholder="Votre mot pour passer"
                            name="password" 
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-1/4 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        ></input><br></br>
                        
                        <button onClick={handleSubmit} className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow mt-8">Valider</button>
                    </form>

                    <h3 className="mt-6 text-base font-bold">Pas encore inscrit(e) ?</h3>
                    <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow mt-4">
                        <a href="/register">S'inscrire</a>
                    </button>
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