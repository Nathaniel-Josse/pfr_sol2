import React from "react";
import { Link, Outlet } from "react-router-dom";
import Logo from "../assets/cinemawiki_logo_small.webp";

const Header = () => {

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
                        <li><Link to='login'>Connexion</Link></li>
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