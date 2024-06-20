class MENACE {
  collection: Array<Position>;
  path: Array<{ box: Position, playedIndex: number }>;
  currentGame: string;
  games: number;
  value: string;
  completedGame: boolean;
  
  constructor(value) {
    this.collection = [];
    this.initializeCollection();
    this.path = [];
    this.completedGame = false;
    this.value = value;
    this.currentGame = "000000000";
    this.games = 0;
  }

  initializeCollection() {
    this.collection = [{
      simplifiedPosition: "000000000",
      beads: [
        { index: 0, count: 8 },
        { index: 1, count: 8 },
        { index: 8, count: 8 }
      ]
    }]
  }

  resetMENACE() {
    this.initializeCollection();
    this.path = [];
    this.currentGame = "000000000";
    this.games = 0;
  }

  resetGame() {
    this.path = [];
    this.currentGame = "000000000";
    this.completedGame = false;
  }

  playMove(move: number | null, playPosition: string = "") { // Index in the string
    if (this.gameIsOver()) { 
      return; 
    }
    // MENACE is always 1, player is always 2
    if (move === null) {
      // Menace plays
      let currentPosition = this.findPosition(this.currentGame);
      let sumOfBeads = 0;
      for (let i = 0; i < currentPosition.beads.length; i++) {
        sumOfBeads += currentPosition.beads[i].count;
      }

      let randomBead = Math.floor(Math.random() * sumOfBeads);
      let move = -1;
      for (let i = 0; i < currentPosition.beads.length; i++) {
        randomBead -= currentPosition.beads[i].count;
        if (randomBead < 0) {
          move = currentPosition.beads[i].index;
          currentPosition.beads[i].count--;
          break;
        }
      }

      if (move < 0) {
        if (currentPosition.simplifiedPosition === "000000000"){
          currentPosition.beads = [
            { index: 0, count: 8 },
            { index: 1, count: 8 },
            { index: 8, count: 8 }
          ]
          this.playMove(null);
        } else {
          this.finishGame(false, true);
        }
        return;
      }

      
      this.path.push({ box: currentPosition, playedIndex: move });
      // Calculates transformed move, since currentPosition may be in a different orientation
      move = this.convertTransformedToOriginal(this.currentGame, currentPosition.simplifiedPosition, move);

      if (!this.getValidMoves(this.currentGame).includes(move)){
        throw new Error("Menace made an invalid move.");
      }

      let stringArray = this.currentGame.split('');
      stringArray[move] = this.value;
      this.currentGame = stringArray.join('');
    } else {
      // Player plays
      let stringArray = this.currentGame.split('');
      stringArray[move] = "2";
      this.currentGame = stringArray.join('');
    }
    this.finishGame();
  }

  finishGame(overwrite: boolean = false, resign: boolean = false) {
    // If game is over, finish path
    if (resign || overwrite || this.gameIsOver()) {
      this.completedGame = true;
      let winner = this.winner();
      if (resign) { winner = 2; }
      this.games++;
      let addedValue = 0;
      if (winner === 1) { addedValue = 3; }
      else if (winner === 0) { addedValue = 1; }
      else { return; }

      for (let i = 0; i < this.path.length; i++) {
        let position = this.path[i].box;
        for (let j = 0; j < position.beads.length; j++){
          if (position.beads[j].index === this.path[i].playedIndex){
            position.beads[j].count += addedValue;
          }
        }
      }
    }
  }

  getValidMoves(position: string): Array<number> {
    let stringArray = position.split('');
    let validMoves: Array<number> = [];
    for (let i = 0; i < stringArray.length; i++) {
      if (stringArray[i] === "0") {
        validMoves.push(i);
      }
    }
    return validMoves;
  }

  findPosition(position: string): Position {
    for (let i = 0; i < 2; i++) {
      let currentPosition = String(position);
      if (i === 1) {
        currentPosition = this.mirrorHorizontal(currentPosition);
      }
      for (let i = 0; i < 4; i++) {
        let possiblePosition = this.searchCollection(currentPosition);
        if (possiblePosition !== null) { return possiblePosition; }
        currentPosition = this.rotateCCW(currentPosition);
      }
    }

    // Generate new position
    let validMoves = this.getValidMoves(position);
    let newBeads: Array<{ index: number, count: number }> = [];
    for (let i = 0; i < validMoves.length; i++) {
      newBeads.push({ index: validMoves[i], count: 20 });
    }
    let newPosition: Position = {
      simplifiedPosition: position,
      beads: newBeads
    }
    this.collection.push(newPosition);
    return newPosition;
  }

  searchCollection(position: string): Position | null {
    for (let i = 0; i < this.collection.length; i++) {
      if (this.collection[i].simplifiedPosition === position) {
        return this.collection[i];
      }
    }
    return null;
  }

  convertTransformedToOriginal(original: string, transformed: string, desiredMove: number): number {
    if (desiredMove === 8) {return 8;}
    for (let i = 0; i < 2; i++) {
      let currentPosition = String(transformed);
      let currentMove = Number(desiredMove);
      if (i === 1) {
        currentPosition = this.mirrorHorizontal(currentPosition);
        currentMove = this.mirrorMoveHorizontal(currentMove);
      }
      for (let i = 0; i < 4; i++) {
        if (currentPosition === original) { 
          return currentMove; 
        }
        currentPosition = this.rotateCCW(currentPosition);
        currentMove = currentMove - 2;
        if (currentMove < 0) {currentMove += 8}
      }
    }
    return -1;
  }

  gameIsOver(): boolean {
    if (this.winner() !== 0 || !this.currentGame.includes('0') || this.completedGame) { 
      if (!this.completedGame) {this.finishGame(true);}
      return true; 
    }
    return false;
  }

  winner(): number {
    let pos = this.currentGame.split('');
    const winningCombinations = [
      [0, 1, 2], // Top row
      [3, 7, 8], // Middle row
      [6, 5, 4], // Bottom row
      [0, 7, 6], // Left column
      [1, 5, 8], // Middle column
      [2, 3, 4], // Right column
      [0, 4, 8], // Diagonal from top-left to bottom-right
      [2, 6, 8]  // Diagonal from top-right to bottom-left
    ];
    for (let combination of winningCombinations) {
      const [a, b, c] = combination;
      if (pos[a] === "1" && pos[b] === "1" && pos[c] === "1") {
        return 1;
      }
      if (pos[a] === "2" && pos[b] === "2" && pos[c] === "2") {
        return 2;
      }
    }
    return 0;
  }

  rotateCCW(input: string): string {
    let array = input.split('');
    let output = "";
    for (let i = 0; i < 8; i++) {
      output += array[(i + 2) % 8];
    }
    output += array[8];
    return output;
  }

  mirrorHorizontal(input: string): string {
    let array = input.split('');
    let output = "";
    output += array[2]; output += array[1]; output += array[0];
    output += array[7]; output += array[6]; output += array[5];
    output += array[4]; output += array[3]; output += array[8];
    return output;
  }

  // mirrorVertical(input: string): string {
  //   let array = input.split('');
  //   let output = "";
  //   output += array[6]; output += array[5]; output += array[4];
  //   output += array[3]; output += array[2]; output += array[1];
  //   output += array[0]; output += array[7]; output += array[8];
  //   return output;
  // }

  mirrorMoveHorizontal(move: number): number {
    switch (move) {
      case 0: return 2;
      case 1: return 1;
      case 2: return 0;
      case 3: return 7;
      case 4: return 6;
      case 5: return 5;
      case 6: return 4;
      case 7: return 3;
      case 8: return 8;
      default: return -1;
    }
  }

  // mirrorMoveVertical(move: number): number {
  //   switch (move) {
  //     case 0: return 6;
  //     case 1: return 5;
  //     case 2: return 4;
  //     case 3: return 3;
  //     case 4: return 2;
  //     case 5: return 1;
  //     case 6: return 0;
  //     case 7: return 7;
  //     case 8: return 8;
  //     default: return -1;
  //   }
  // }
}

type Position = {
  simplifiedPosition: string,
  beads: Array<{ index: number, count: number }>
}

export default MENACE;