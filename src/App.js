import React from 'react';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import './scsscomp/App.css';
import { Home } from './components/Home';
import { SimulatorHome } from './components/SimulatorHome';
import { NBoxProblem } from './components/NBoxProblem.tsx';

class App extends React.Component {
  render() {
    return (
      <div id='app'>
        <BrowserRouter>
          <Sidebar />
          <Routes>
            <Route index element={<Home />} />
            <Route path="/simulation" element={<SimulatorHome />}/>
            <Route path="/simulation/100prisonerpuzzle" element={<NBoxProblem />}/>


          </Routes>
        </BrowserRouter>
      </div>
    );
  }
} 

class Sidebar extends React.Component {
  render() {
    return(
      <div id='sideBar'>
        <Link to="/">Home</Link>
        <Link to="/simulation">Simulators</Link>
      </div>
    )
  }
}

export default App;
