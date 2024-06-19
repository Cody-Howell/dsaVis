import React from 'react';
import PrisonerPuzzle from '../logic/100PrisonerPuzzle.ts';

export class NBoxProblem extends React.Component {
  render() {
    return (
      <div id='nBoxPuzzle'>
        <h1>100 Prisoner Puzzle</h1>
        <h2>Problem</h2>
        <p>The 100 Prisoner Puzzle has 100 people with $1 bills and their number written on it (this is the MinutePhysics variation of the puzzle).
          Their bill is placed in a random box that also has a number on it. Everyone is given 50 guesses to find their bill among
          the boxes; if everyone finds their bill, they all get $100, and if ANY don't find their bill, they all receive nothing.
          Once getting into the room, they exit through another door and don't have any communication with people coming in (so
          no backwards communication). <br /> What is the best strategy?
        </p>

        <h2>References</h2>
        <a href='https://www.youtube.com/watch?v=a1DUUnhk3uE' target='_blank' rel='noreferrer'>Stand-up Maths' (Matt Parker) video on the puzzle</a> <br />
        <a href='https://www.youtube.com/watch?v=C5-I0bAuEUE' target='_blank' rel='noreferrer'>MinutePhysics' (Henry Reich) solution video</a> <br />
        <a href='https://www.youtube.com/watch?v=iSNsgj1OCLA' target='_blank' rel='noreferrer'>Veritasium's (Derek Muller) video</a>

        <h2>Try It Out</h2>
        <p>When I first got here, I wasn't sure how this would work; Once you get through the first few, you'd know 
          where all the bills are! I've decided that's not an issue; how consistently can you win with your strategy
          (remember, everyone has to find their bill)? 
          And how many boxes can you beat? 
        </p>

        <NBoxSimulator playable={true}/>

        <h2>Solution</h2>
        <p>SPOILERS BELOW!!! If you want to try to think through the solution yourself, look away for a bit. <br /> <br />
          The solution is this: start at the box with your number and check it. The bill inside has either your number (you're good)
          or another number; go to the box that number points to, and repeat. If you get back to your box within 50 guesses,
          you will have won, since you started with the box that had your number on it, which would have been in the previous box
          if you're back at your starting point. <br />
          This takes advantage of loops within the boxes. If there are no loops of longer than the number of guesses that you have, 
          everyone will win! Please check out some of the videos in the references if you want to learn more, I recommend all of them. 
        </p>
        <p>This is the same simulator, but it will run for you. So you can set some higher numbers and watch the computer play. It will 
          run at (number of boxes)Hz. Initialize the boxes and select the strategy you want to see attempted, and it will run to completion. 
        </p>

        <NBoxSimulator playable={false}/>

      </div>
    );
  }
}

class NBoxSimulator extends React.Component <
  {playable: boolean}, 
  {sim: PrisonerPuzzle, open: boolean, previousBox: {boxNum: number, insideNum: number}, boxNumber: number}> {

  constructor(props){
    super(props);
    this.state = {
      sim: new PrisonerPuzzle(),
      open: false,
      previousBox: {boxNum: -1, insideNum: 0},
      boxNumber: 5
    }
  }

  initializeBoxes = () => {
    let sim = this.state.sim;
    sim.initializeBoxes(this.state.boxNumber);
    this.setState({sim: sim});
  }

  resetSim = () => {
    let sim = this.state.sim;
    sim.completed = true;
    setTimeout(() => {
      sim.resetSim();
      this.setState({sim: sim, previousBox: {boxNum: -1, insideNum: 0}});
    }, 500);
  }

  checkBox = (num: number) => {
    if (this.props.playable) {
      let sim = this.state.sim;
      let value = sim.checkBox(num);
      this.setState({sim: sim, previousBox: {boxNum: num, insideNum: value}});
    }
  }

  toggleOpen = () => {
    this.setState({open: !this.state.open});
  }

  updateBoxNumbers = (event) => {
    this.setState({boxNumber: event.target.value});
  }

  startRandomStrategy = () => {
    let array = returnNumberedArray(this.state.sim.boxes.length);
    let interval = setInterval(() => {
      let sim = this.state.sim;
      if (sim.prisoners[sim.prisoners.length - 1].length === 0){
        array = returnNumberedArray(this.state.sim.boxes.length);
      }
      let index = Math.floor(Math.random() * array.length);
      sim.checkBox(array[index]);
      array.splice(index, 1);
      this.setState({sim: sim});
      if (sim.completed) {clearInterval(interval);}
    }, 1000 / this.state.sim.boxes.length);
  }

  startLoopingStrategy = () => {
    let number = 0;
    let interval = setInterval(() => {
      let sim = this.state.sim;
      if (sim.prisoners[sim.prisoners.length - 1].length === 0){
        number = sim.checkBox(sim.prisoners.length - 1);
      } else {
        number = sim.checkBox(number);
      }
      this.setState({sim: sim});
      if (sim.completed) {clearInterval(interval);}
    }, 1000 / this.state.sim.boxes.length);
  }

  render() {
    let buttons: React.ReactNode[] = [];
    for (let i = 0; i < this.state.sim.boxes.length; i++){
      buttons.push(<p onClick={() => this.checkBox(i)} key={i + "buttons"}>{i+1}</p>);
    }
    
    let results: React.ReactNode[] = [];
    for (let i = this.state.sim.prisoners.length - 1; i >= 0; i--){
      let completed = "";
      if (this.state.sim.boxes[this.state.sim.prisoners[i][this.state.sim.prisoners[i].length-1]] === i) {completed = "complete"}
      else {completed = "incomplete"}
      
      let string = "";
      for (let j = 0; j < this.state.sim.prisoners[i].length; j++){
        string += `${this.state.sim.prisoners[i][j] + 1}`;
        if (j <= this.state.sim.prisoners[i].length - 2){
          string += ", ";
        }
      }
      results.push(<p key={i + "prisoners"} className={completed}>Prisoner {i+1} ({this.state.sim.prisoners[i].length}): {string}</p>);
    }

    let stats = this.state.sim.getStats();
    return(
      <div className='nBoxSim'>
        <button onClick={this.initializeBoxes}>Initialize Boxes</button>
        <button onClick={this.resetSim}>Reset Sim</button>
        <label htmlFor='boxNumbers'>Boxes: </label>
        <select onChange={this.updateBoxNumbers} name='boxNumbers'>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={30}>30</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
          <option value={200}>200</option>
          <option value={500}>500</option>
          <option value={1000}>1000</option>
        </select>
        {!this.props.playable && this.state.sim.boxes.length > 0 && (
          <>
            <button onClick={this.startRandomStrategy}>Start Random Strategy</button>
            <button onClick={this.startLoopingStrategy}>Start Looping Strategy</button>
          </>
        )}
        <p>Current prisoner: {this.state.sim.prisoners.length}</p>
        <div className='boxDisplay'>
          {buttons}
        </div>

        {this.state.previousBox.boxNum > -1 && (<p>Box {this.state.previousBox.boxNum + 1} has value {this.state.previousBox.insideNum + 1}</p>)}

        {this.state.sim.completed && (<h2 style={stats.won ? ({color: "green"}) : ({color: "red"})}>{stats.won ? ("Won!") : ("Lost.")}</h2>)}
        {this.state.sim.completed && (<p>{stats.number}/{this.state.sim.boxes.length} | Win Percentage: {Math.round((stats.number / this.state.sim.boxes.length ) * 100)}%</p>)}

        <h3 onClick={this.toggleOpen} style={{cursor: "pointer"}}>Click to toggle results</h3>
        {this.state.open && (
          <div className='resultsSection'>
            <p>Prisoner #: Boxes Checked</p>
            {results}
          </div>
        )}
      </div>
    )
  }
}

function returnNumberedArray(numOfOptions: number): Array<number> {
  let array: Array<number> = [];
  for (let i = 0; i < numOfOptions; i++){
    array.push(i);
  }
  return array;
}