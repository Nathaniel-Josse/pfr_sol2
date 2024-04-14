import './App.css';
import {Outlet, Route , Routes} from 'react-router-dom';
import Header from './components/header';
import Home from './pages/home';
import Login from './pages/login';
import Register from './pages/register';
import Details from './pages/filmDetails';
import { Provider } from 'react-redux';
import store from './redux/store';

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
          </Route>
        </Routes>
      </Provider>
    </div>
  );
}

export default App;
