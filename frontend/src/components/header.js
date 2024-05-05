import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import Logo from "../assets/cinemawiki_logo_large.webp";

const Header = () => {

    const [user, setUser] = useState(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        setUser(user);
    }, []);

    return(
        <>
            <header className="flex justify-between p-4">
                <Link to = 'home'> 
                    <div>
                        <img src = {Logo} alt='Logo CinemaWiki' className="max-w-96"/>
                    </div>
                </Link>
                <nav className="font-Gill">
                    <ul className="flex items-center">
                        <li><Link to='liked'>Aimés</Link></li>
                        <li><Link to='watch-list'>À voir</Link></li>
                        <li><Link to='seen'>Vus</Link></li>
                        <li><Link to='near-events'>Suggestions</Link></li>
                        <li><Link to='login'>{user ? "Déconnexion" : "Connexion"}</Link></li>
                    </ul>
                </nav>
            </header>

            <section>
                <Outlet />
            </section>
        </>
    )
}
export default Header;