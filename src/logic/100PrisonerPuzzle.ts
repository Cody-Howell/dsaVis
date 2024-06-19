class PrisonerPuzzle {
  prisoners: Array<Array<number>>;
  boxes: Array<number>;
  completed: boolean;

  constructor(){
    this.prisoners = [];
    this.boxes = [];
  }

  initializeBoxes(numOfBoxes: number) {
    this.boxes = [];
    let possibleNumbers: Array<number> = [];
    for (let i = 0; i < numOfBoxes; i++){
      possibleNumbers.push(i);
    }

    while (possibleNumbers.length > 0){
      let randomIndex = Math.floor(Math.random() * possibleNumbers.length);
      this.boxes.push(possibleNumbers[randomIndex]);
      possibleNumbers.splice(randomIndex, 1);
    }
    this.prisoners= [[]];
  }

  resetSim() {
    this.boxes = [];
    this.prisoners = [];
    this.completed = false;
  }

  checkBox(boxNum: number): number {
    if (!this.completed){
      this.prisoners[this.prisoners.length-1].push(boxNum);
      if ((this.prisoners[this.prisoners.length-1].length >= (this.boxes.length / 2) 
        || this.prisonerWon(this.prisoners.length - 1))
      && this.prisoners.length < this.boxes.length){
        this.prisoners.push([]); // If a prisoner exceeds their guesses or has the correct number, go to the next one. 
      }
    }
    this.checkCompleted();
    return this.boxes[boxNum];
  }

  checkCompleted() {
    if (this.prisonerWon(this.prisoners.length - 1) || this.prisoners[this.prisoners.length - 1].length >= (this.boxes.length / 2)) {
      this.completed = true;
    }
  }

  getStats(): StatObject {
    let win = 0;
    for (let i = 0; i < this.prisoners.length; i++){
      if (this.prisonerWon(i)){
        win++;
      }
    }
    let winBool: boolean = this.prisoners.length === win;
    return {won: winBool, number: win};
  }

  prisonerWon(prisoner: number): boolean {
    return this.boxes[this.prisoners[prisoner][this.prisoners[prisoner].length-1]] === prisoner;
  }
}

type StatObject = {
  won: boolean, 
  number: number
}

export default PrisonerPuzzle;