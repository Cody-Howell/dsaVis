import React from 'react';
import MENACE from '../logic/MENACE.ts';
import { pointer } from 'd3';

export class MENACESim extends React.Component {
  render() {
    return (
      <div id='menacePage'>
        <h1>MENACE!</h1>
        <h2>Explanation</h2>
        <p>The Machine Educable Noughts and Crosses Engine (MENACE), designed to play Tic-Tac-Toe, is
          a collection of matchboxes with beads inside, each representing a unique state of the game.
          This page will be your computer simulating a collection of matchboxes simulating a computer using
          a machine learning algorithm to learn to play Tic-Tac-Toe. <br />
          This works by having the beads refer to a place to play in each position, and you randomly choose a bead from the
          box. At the end of the game, if you lose, you don't add the bead back in; if you draw, you add one
          back in; if you win, you add 3 beads back in to each box. My version may or may not use these training
          weights. <br />
          Every game played against it trains it, so if you play a few games in-between random training sessions,
          those will count towards the training. <br />
          Finally, I like the display that his website uses, but I want to design my own, since I won't have a set
          number of matchboxes. They will be generated as paths of the game are found. You get to decide how good a job I did.
        </p>

        <h2>References</h2>
        <a href='https://www.youtube.com/watch?v=R9c-_neaxeU' target='_blank' rel='noreferrer'>Stand-Up Maths' (Matt Parker) initial video</a> <br />
        <a href='https://www.mscroggs.co.uk/menace/' target='_blank' rel='noreferrer'>Matthew Scroggs' website to play his version</a> <br />
        <p>There will likely be more in Matt's description, so please do check out his video. </p>

        <h2>Play or Train</h2>
        <p>In my references, I linked Matthew's page where you can do exactly what I'm planning on coding here.
          <i>Or so I thought. </i> Using some generative code, I can make it so that MENACE can go first or second (which greatly expands the number
          of boxes that you need to keep track of, which is why the main MENACE doesn't do it), and one of the main parts
          I remember from the video is trying to reduce the number of states, so finding rotations and mirrors for
          each game state will be pretty vital in minimizing how many there are. You can train it by hand
          or use a random number generator to play random moves. In the future, I will probably implement a better algorithm to train it, or find
          a way to pit two against each other. <i>Sidenote: if you read the comments in Matt's video, there are a number
          of people who talk about coding this, and that idea is brought up.</i> And in the future, I did create an adversarial MENACE 
          to play against! <br />
          There are a few training buttons at the top with a set number of sessions, and it will go through that number of games as fast as possible.
          Otherwise, you can play a game by clicking on the board, and then pressing for Menace to go. Make
          sure to reset the board after a game is finished. There's also a dropdown so you can see the state of all the positions in Menace.
        </p>
        <p>After completing it, I had a few bugs that I had to sort out; MENACE was making invalid moves sometimes, then I quashed that
          bug, and then after 3000 games or so, it would also make invalid moves. I found that some of the boxes are empty, which in my code
          made a move in the -1 index come up. After looking on Matthew's page about how MENACE should handle having an empty box, he said
          it should just resign, so that's what my program does. So, if you simulate some number of games (such as 20,000), then you may
          notice the games number increase by slightly more than the number that you asked it to. Due to how my player
          is built, it doesn't properly count resigned games, and now it's a nice little visual of how often MENACE has to resign. If you
          use adversarial training, it also doesn't count games as completed if the opposition resigns.  <br />
          The number of games in no way correlates to how well it can play, but you can make that number very high.
        </p>

        <MENACEGame game={this.state} />
      </div>
    );
  }
}

class MENACEGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      game: new MENACE('1'),
      adversary: new MENACE('2'),
      openPositions: false
    }
  }

  toggleOpen = () => {
    this.setState({ openPositions: !this.state.openPositions })
  }

  resetMenace = () => {
    let game = this.state.game;
    game.resetMENACE();
    this.setState({ game: game });
  }

  resetBoard = () => {
    let game = this.state.game;
    game.resetGame();
    this.setState({ game: game });
  }

  playRound = (move) => {
    let game = this.state.game;
    game.playMove(move);
    this.setState({ game: game });
  }

  playMenace = () => {
    let game = this.state.game;
    game.playMove(null);
    this.setState({ game: game });
  }

  randomSimXGames = (numberOfGames) => {
    let game = this.state.game;
    game.resetGame();
    for (let i = 0; i < numberOfGames; i++) {
      if (Math.random() > 0.5) {
        game.playMove(null);
      }
      while (!game.gameIsOver()) {
        let possibleMoves = game.getValidMoves(game.currentGame);
        let moveChoice = Math.floor(Math.random() * possibleMoves.length);
        game.playMove(possibleMoves[moveChoice]);
        game.playMove(null);
      }
      game.resetGame();
    }
    this.setState({ game: game });
  }

  adversarialSimXGames = (numberOfGames) => {
    let game = this.state.game;
    let adversary = this.state.adversary;
    game.resetGame();
    for (let i = 0; i < numberOfGames; i++) {
      if (Math.random() > 0.5) {
        game.playMove(null);
        while (!game.gameIsOver()) {
          adversary.currentGame = game.currentGame;
          adversary.playMove(null);
          if (adversary.completedGame) {
            game.finishGame();
            break;
          }
          game.currentGame = adversary.currentGame;
          game.playMove(null);
        }
      } else {
        adversary.playMove(null);
        while (!game.gameIsOver()) {
          game.currentGame = adversary.currentGame;
          game.playMove(null);
          adversary.currentGame = game.currentGame;
          adversary.playMove(null);
          if (adversary.completedGame) {
            game.finishGame();
          }
        }
      }
      game.resetGame();
      adversary.resetGame();
    }
    this.setState({ game: game, adversary: adversary });
  }

  getOpenPositionCount = (position) => {
    let array = position.split('');
    let count = 0;
    for (let i = 0; i < array.length; i++) {
      if (array[i] === '0') {
        count++;
      }
    }
    return count;
  }

  render() {
    let menacePositions = this.state.game.collection;
    let displayedPositions = [];
    displayedPositions.push( // Push first box
      <div className='individualPosition' key={"primaryposition"}>
        <DisplayTTT string={menacePositions[0].simplifiedPosition} playMove={() => console.log("Unavailable")} />
        <div className='beadArea'>
          <p> Index: {menacePositions[0].beads[0].index} | Count: {menacePositions[0].beads[0].count} </p>
          <p> Index: {menacePositions[0].beads[1].index} | Count: {menacePositions[0].beads[1].count} </p>
          <p> Index: {menacePositions[0].beads[2].index} | Count: {menacePositions[0].beads[2].count} </p>
        </div>
      </div>
    )
    for (let f = 8; f >= 0; f--) {
      for (let i = 1; i < menacePositions.length; i++) {
        if (this.getOpenPositionCount(menacePositions[i].simplifiedPosition) === f) {
          let beads = [];
          for (let j = 0; j < menacePositions[i].beads.length; j++) {
            beads.push(<p key={i + "position" + j}> Index: {menacePositions[i].beads[j].index} | Count: {menacePositions[i].beads[j].count} </p>)
          }
          displayedPositions.push(
            <div className='individualPosition' key={i + "position"}>
              <DisplayTTT string={menacePositions[i].simplifiedPosition} playMove={() => console.log("Unavailable")} />
              <div className='beadArea'>
                {beads}
              </div>
            </div>
          )
        }
      }
    }

    let currentPosition = [];
    let path = this.state.game.path;
    for (let i = 0; i < path.length; i++){
      let beads = [];
      for (let j = 0; j < path[i].box.beads.length; j++) {
        beads.push(<p key={i + "currentPosition" + j}> Index: {path[i].box.beads[j].index} | Count: {path[i].box.beads[j].count} </p>)
      }
      currentPosition.push(
        <div className='individualPosition' key={i + "currentPosition"}>
          <DisplayTTT string={path[i].box.simplifiedPosition} playMove={() => console.log("Unavailable")} />
          <div className='beadArea'>
            {beads}
          </div>
        </div>
      )
    }


    return (
      <div className='menaceGame'>
        <button onDoubleClick={this.resetMenace} style={{ backgroundColor: "red" }}>Reset Menace (Double-Click)</button>
        <button onClick={this.resetBoard}>Reset Board</button>
        <button onClick={this.playMenace}>Have Menace Play</button>
        <br />

        <button onClick={() => this.randomSimXGames(10)}>Play 10 Random Games</button>
        <button onClick={() => this.randomSimXGames(50)}>Play 50 Random Games</button>
        <button onClick={() => this.randomSimXGames(100)}>Play 100 Random Games</button>
        <button onClick={() => this.randomSimXGames(1000)}>Play 1,000 Random Games</button>
        <button onClick={() => this.randomSimXGames(10000)}>Play 10,000 Random Games</button>
        <button onClick={() => this.randomSimXGames(100000)}>Play 100,000 Random Games</button>
        <br />

        <button onClick={() => this.adversarialSimXGames(100)}>Play 100 Adversarial Games</button>
        <button onClick={() => this.adversarialSimXGames(1000)}>Play 1,000 Adversarial Games</button>
        <button onClick={() => this.adversarialSimXGames(10000)}>Play 10,000 Adversarial Games</button>
        <button onClick={() => this.adversarialSimXGames(100000)}>Play 100,000 Adversarial Games</button>

        <p>Menace has now played: {Math.floor(this.state.game.games / 2)} games</p>

        {this.state.game.gameIsOver() && (<p>Game is over.</p>)}
        {this.state.game.winner() === 1 && (<p>Menace wins!</p>)}
        {this.state.game.winner() === 2 && (<p>You win!</p>)}
        <DisplayTTT string={this.state.game.currentGame} playMove={this.playRound} />

        <div className='allPositions'>
          <h2>Current Position</h2>
          {currentPosition}
        </div>

        <div className='allPositions'>
          <h2 onClick={this.toggleOpen} style={{cursor: "pointer"}}>Open Position Collection ({displayedPositions.length})</h2>
          {this.state.openPositions && (displayedPositions)}
        </div>
      </div>
    )
  }
}

class DisplayTTT extends React.Component {
  convertChar(num, index) {
    switch (num) {
      case "0": return `${index}`;
      case "1": return "◯";
      case "2": return "🞨";
      default: return "Problem";
    }
  }

  sendCheckUpwards = (index) => {
    let position = this.props.string.split('');

    if (position[index] === "0") {
      this.props.playMove(index);
    } else {
      console.log("Illegal move.");
    }
  }

  render() {
    let position = this.props.string.split('');
    return (
      <div className='tttDisplay'>
        <p style={{ border: "1px solid black", cursor: "pointer" }} onClick={() => this.sendCheckUpwards(0)}>{this.convertChar(position[0], 0)}</p>
        <p style={{ border: "1px solid black", cursor: "pointer" }} onClick={() => this.sendCheckUpwards(1)}>{this.convertChar(position[1], 1)}</p>
        <p style={{ border: "1px solid black", cursor: "pointer" }} onClick={() => this.sendCheckUpwards(2)}>{this.convertChar(position[2], 2)}</p>
        <p style={{ border: "1px solid black", cursor: "pointer" }} onClick={() => this.sendCheckUpwards(7)}>{this.convertChar(position[7], 7)}</p>
        <p style={{ border: "1px solid black", cursor: "pointer" }} onClick={() => this.sendCheckUpwards(8)}>{this.convertChar(position[8], 8)}</p>
        <p style={{ border: "1px solid black", cursor: "pointer" }} onClick={() => this.sendCheckUpwards(3)}>{this.convertChar(position[3], 3)}</p>
        <p style={{ border: "1px solid black", cursor: "pointer" }} onClick={() => this.sendCheckUpwards(6)}>{this.convertChar(position[6], 6)}</p>
        <p style={{ border: "1px solid black", cursor: "pointer" }} onClick={() => this.sendCheckUpwards(5)}>{this.convertChar(position[5], 5)}</p>
        <p style={{ border: "1px solid black", cursor: "pointer" }} onClick={() => this.sendCheckUpwards(4)}>{this.convertChar(position[4], 4)}</p>
      </div>
    )
  }
}