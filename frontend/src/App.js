import './App.css';
import {Outlet, Route , Routes} from 'react-router-dom';
import Header from './components/header';
import Home from './pages/home';

function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Header />}>
          <Route path='home' element={<Home />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
