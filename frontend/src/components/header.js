import React from "react";
import { Link, Outlet } from "react-router-dom";

const Header = () => {

    return(
        <>
            <header>
                <nav>
                    <ul>
                        <li><Link to='home'>Accueil</Link></li>
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