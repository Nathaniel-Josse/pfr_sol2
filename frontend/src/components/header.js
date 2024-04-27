import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import Logo from "../assets/cinemawiki_logo_small.webp";

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
                        <img src = {Logo} alt='Logo CinemaWiki' className='logo'/>
                    </div>
                </Link>
                <nav className="font-Gill">
                    <ul>
                        <li><Link to='liked'>Films aimés</Link></li>
                        <li><Link to='watch-list'>Films à voir</Link></li>
                        <li><Link to='seen'>Films vus</Link></li>
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