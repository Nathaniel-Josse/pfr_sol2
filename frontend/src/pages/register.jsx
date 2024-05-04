import React, { useState } from 'react';
import axios from 'axios';
import { URL } from '../constants/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Register() {
  
    const [user, setUser] = useState([]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const dataForm = {
            username: user.username,
            email: user.email,
            password: user.password
        }
        try{
            const { data, status } = await axios.post(URL.USER_REGISTER, dataForm);
            if(status === 201) {
                toast.success("Vous êtes inscrit(e) ! Il ne reste plus qu'à vous connecter ! ✅", {
                    position: "top-center",
                    hideProgressBar: true
                });
                setTimeout(() => {
                    window.location.href = `/login`;
                } , 2000);
            }
        } catch(error) {
            console.log(error);
            toast.error("Erreur lors de l'inscription. Veuillez vérifier vos informations.", {
                position: "top-center",
                hideProgressBar: true
            });
        }
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setUser(user => ({ ...user, [name]: value}));
    }

    return(
        <div className="bg-black text-white p-12 text-center">
            <div className="font-Gill">
                <h1 className="text-center font-bold w-full mb-8 text-2xl">INSCRIPTION</h1>
                <form action="" method="get">
                    <label for="username" className="block text-primary text-sm font-bold">Nom d'utilisateur : </label><br></br>
                    <input 
                        type="text"
                        name="username"
                        placeholder="Votre nom d'utilisateur"
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-1/4 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline min-w-52"
                    ></input><br></br>
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
                    
                    <button onClick={handleSubmit} className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow mt-8">Valider l'inscription</button>
                </form>

                <h3 className="mt-6 text-base font-bold">Déjà inscrit(e) ?</h3>
                <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow mt-4">
                    <a href="/login">Se connecter</a>
                </button>
            </div>
            <ToastContainer />
        </div>
    )
}