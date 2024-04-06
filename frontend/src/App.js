import './App.css';
import {Outlet, Route , Routes} from 'react-router-dom';
import Header from './components/header';
import Home from './pages/home';
import Login from './pages/login';
import Register from './pages/register';

function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Header />}>
          <Route path='home' element={<Home />} />
          <Route path='login' element={<Login />} />
          <Route path='register' element={< Register />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
