import React from 'react';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import './scsscomp/App.css';

class App extends React.Component {
  componentDidMount() {
    document.title = "Data Visualization";
  }

  render() {
    return (
      <div id='app'>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />


          </Routes>
        </BrowserRouter>
      </div>
    );
  }
}

class Home extends React.Component {
  render() {
    return(
        <div id='homepage'>
          <h1>Data Visualizer</h1>
          <p>This page will show a variety of algorithms and animated data structures
            to assist in learning in a classic Data Structures and Algorithms class.
            I take from a few textbooks for code segments and how an algorithm should work
            (and how to handle a number of edge cases). <br/> 
            I will show a few things for each one. First, you can walk through for each 
            step in the algorithm, and once a swap or whatever has taken place, it saves it
            and displays the next step in the algorithm (so a step inside the algorithm and
            steps between parts of the algorithm). Second, I will display code segments
            in the following languages: JavaScript, C#, Python, and Pseudocode. You can set 
            your language preference or you can view each language for each algorithm. <br/>
            I will cover some data structures such as Queues and Stacks, implemented in JS
            arrays. I will cover a number of sorting algorithms, both in-place and splitting
            (namely, MergeSort and QuickSort). I will cover links, so implementing some
            structures with Linked Lists (covered as another set of data structures), and 
            Graphs. With graphs, I will cover some traversal algorithms and allow you to build
            your own graphs to test ideas. 
            </p>
        </div>

    );
  }
}

export default App;
