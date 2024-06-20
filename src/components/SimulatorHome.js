import React from 'react';
import { Link } from 'react-router-dom';

export class SimulatorHome extends React.Component {
  render() {
    return (
      <div id='simHome'>
        <h1>Simulators</h1>
        <div id='simLinks'>
          <Link to="/simulation/100prisonerpuzzle">100 Prisoner Puzzle</Link>
          <Link to="/simulation/menace">MENACE!</Link>
        </div>
      </div>
    );
  }
}
