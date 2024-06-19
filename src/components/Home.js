import React from 'react';

export class Home extends React.Component {
  render() {
    return (
      <div id='homepage'>
        <h1>Data Visualizer</h1>
        <p>This page will show a variety of algorithms and animated data structures
          to assist in learning in a classic Data Structures and Algorithms class.
          I take from a few textbooks for code segments and how an algorithm should work
          (and how to handle a number of edge cases). <br />
          There are 3 main pages where I go into more detail: Data Structures (how data
          is laid out and manipulated), Algorithms: (processes to sort or otherwise work
          with data), and Simulations (fun side-projects that show a math puzzle or simulate
          something in the real world). For now, only the Simulations page is up.
        </p>
        <p> Currently on my list of simulators is the Prisoner's Dilemna,
          MENACE! (to play Tic-Tac-Toe), the 100-Box Prisoner Problem (finding your number with n/2
          guesses), the Checkerboard Key problem, and possibly some voting system simulations. <br />
          These will populate as they are finished; if you have ideas or requests, you can email me
          at this address: request@codyhowell.dev. Thanks for checking it out! </p>
      </div>

    );
  }
}
