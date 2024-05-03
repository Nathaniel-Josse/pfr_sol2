import './App.css';
import {Outlet, Route , Routes} from 'react-router-dom';
import Header from './components/header';
import Home from './pages/home';
import Login from './pages/login';
import Register from './pages/register';
import Details from './pages/filmDetails';
import Mleg from './pages/mleg';
import Liked from './pages/liked';
import WatchList from './pages/watchList';
import Seen from './pages/seen';
import NearEvents from './pages/nearEvents';
import { Provider } from 'react-redux';
import store from './redux/store';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <div>
      <Provider store={store}>
        <Routes>
          <Route path='/' element={<Header />}>
            <Route path='home' element={<Home />} />
            <Route path='login' element={<Login />} />
            <Route path='register' element={< Register />} />
            <Route path='film-details/:id' element={<Details />} />
            <Route path='mleg' element={<Mleg />} />
            <Route path='liked' element={<Liked />} />
            <Route path='watch-list' element={<WatchList />} />
            <Route path='near-events' element={<NearEvents />} />
            <Route path='seen' element={<Seen />} />

            <Route path='*' element={<Home />} />
          </Route>
        </Routes>
        <ToastContainer />
        <footer className="fixed bottom-0 left-0 right-0 w-full h-10 text-sm font-Gill bg-primary text-black flex items-center justify-center">
                <p>© 2024 - Tous droits réservés | <a href='/mleg'>Mentions légales</a></p>
        </footer>
      </Provider>
    </div>
  );
}

export default App;
