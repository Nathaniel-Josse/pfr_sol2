import React, { useEffect, useState } from "react";
import axios from "axios";
import { URL } from "../constants/api";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Login() {
    const [user, setUser] = useState([]);

    const [userLogged, setUserLogged] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const dataForm = {
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
                toast.success("Vous êtes connecté(e) ! 👏", {
                    position: "top-center",
                    hideProgressBar: true
                });
                setTimeout(() => {
                    window.location.href = `/home`;
                } , 1000);
            }
        } catch(error) {
            console.log(error);
            toast.error("Erreur lors de la connexion. Veuillez vérifier vos identifiants.", {
                position: "top-center",
                hideProgressBar: true
            });
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
            toast.success("Vous vous êtes déconecté(e) avec succès ! À bientôt ! 👋", {
                position: "top-center",
                hideProgressBar: true
            });
            setTimeout(() => {
                window.location.href = `/login`;
            }, 1000);
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
                <div className="font-Gill min-h-screen">
                    <h1 className="text-center font-bold w-full mb-8 text-2xl">CONNEXION</h1>
                    <form action="" method="get">
                        <label for="email" className="block text-primary text-sm font-bold mt-8">Email : </label><br></br>
                        <input 
                            type="email"
                            name="email"
                            placeholder="Votre email"
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-1/4 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline min-w-52"
                        ></input><br></br>
                        <label for="password" className="block text-primary text-sm font-bold mt-8">Mot de passe : </label><br></br>
                        <input 
                            type="password" 
                            placeholder="Votre mot pour passer"
                            name="password" 
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-1/4 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline min-w-52"
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
                <div className="font-Gill min-h-screen">
                    <h1 className="text-center font-bold w-full mb-8 text-2xl">Bonjour {userLogged.username}. Si vous voulez vous déconnecter, cliquez ci-dessous :</h1>
                    <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow" onClick={handleLogout}>Se déconnecter</button>
                </div>
            )}
            <ToastContainer />
        </div>
    )
}