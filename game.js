//console.log('game run');
const clear = require('clear-screen');
const prompt = require('prompt-sync')({ sigint: true });

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';
const rowNum = 10;
const colNum = 10;
//const difficultyLevel = 30;


//create fiels class
class Field {

  constructor() {
    this._field = Array(rowNum).fill().map(() => Array(colNum).fill());
    this._locationX = 0;
    this._locationY = 0;
    this._previousPositionX = 0;
    this._previousPositionY = 0;
  }

  // method to generate the Field to start the game
  generateField(percentage) {

    //creating the 2D array to represent the field
    //const field = Array(10).fill().map(() => Array(10)); //.fill(0)
    for (let y = 0; y < rowNum; y++) {
      for (let x = 0; x < colNum; x++) {
        const prob = Math.floor(Math.random() * 101);   //random number between 0 and 100
        this._field[y][x] = prob > percentage ? fieldCharacter : hole;
      }
    }

    //set the " hat (^) " location randomly
    const hatLocation = {
      x: Math.floor(Math.random() * colNum),
      y: Math.floor(Math.random() * rowNum)
    };

    //making sure "hat (^) " random position is not at (0, 0) cordinates
    while (hatLocation.x != 0 && hatLocation.y != 0) {
      hatLocation.x = Math.floor(Math.random() * colNum);
      hatLocation.y = Math.floor(Math.random() * rowNum);
    }

    //random location of the "hat (^) " in the field
    this._field[hatLocation.y][hatLocation.x] = hat;

    // set the "home" position for "pathCharacter (*) "
    this._field[0][0] = pathCharacter;

    //console.log(this._field[hatLocation.y][hatLocation.x]);
    //console.log(this._field[0][0]);
    //console.log(this._field.length)
  }

  //create method to print the field on the console
  print() {
    const displayString = this._field.map(row => row.join('')).join('\n');
    console.log(displayString);
  }

  //get the value to set the percentage of no of holes in the field
  setLevel() {
    let value;
    let validity = true;

    while (validity) {
      const level = prompt("Choose the Level - Enter a number between 1 to 5 : ");

      switch (level) {
        case '1':
          value = 5;
          validity = false;
          break;
        //return 5;
        case '2':
          value = 10;
          validity = false;
          break;
        //return 10;
        case '3':
          value = 15;
          validity = false;
          break;
        //return 15;
        case '4':
          value = 20;
          validity = false;
          break;
        //return 20;
        case '5':
          value = 25;
          validity = false;
          break;
        //return 25;
        default:
          console.log('Invalid input...');
          //this.setLevel();
          validity = true;
      }
    }
    console.log('reach here...');
    return value;
    clear();
  }

  //get the direction
  askQuestion() {

    this._previousPositionX = this._locationX;
    this._previousPositionY = this._locationY;
    const direction = prompt('Which way to go? ').toUpperCase();

    switch (direction) {
      case 'L':
        this._locationX -= 1;
        // console.log('Y: ', this._locationY)
        // console.log('X: ', this._locationX)
        break;
      case 'R':
        this._locationX += 1;
        // console.log('Y: ', this._locationY)
        // console.log('X: ', this._locationX)
        break;
      case 'U':
        this._locationY -= 1;
        // console.log('Y: ', this._locationY)
        // console.log('X: ', this._locationX)
        break;
      case 'D':
        this._locationY += 1;
        // console.log('Y: ', this._locationY)
        // console.log('X: ', this._locationX)
        break;
      default:
        console.log('Wrong input - Enter U, D, L or R');
        this.askQuestion();
        break;
    }
  }

  //check and return "true" if the player is in the field
  checkBoundry() {
    return (
      this._locationX >= 0 &&
      this._locationX < this._field[0].length &&
      this._locationY >= 0 &&
      this._locationY < this._field.length
    )
  }

  //check and return "true" if the player jump in to a hole
  checkHole() {
    if (this.checkBoundry()) {
      return this._field[this._locationY][this._locationX] == hole;
    }
  }

  //check and return true if player found the hat
  foundHat() {
    if (this.checkBoundry()) {
      return (this._field[this._locationY][this._locationX] === hat);
    }
  }

  //update the player position in the field
  updateField() {
    //console.log('in upDateField()', this.checkBoundry());
    if (this.checkBoundry()) {
      // console.log('in upDateField in the condition', this.checkBoundry());
      this._field[this._locationY][this._locationX] = pathCharacter;
    }
  }

  //replace the playe's previous position with "fieldharactor" after player moves to a new position
  clearFieldCharactor() {
    console.log('clearing player');
    this._field[this._previousPositionY][this._previousPositionX] = fieldCharacter;
  }

  //create runGame() function to run the game
  runGame() {

    let playing = true;
    const difficultyLevel = this.setLevel();

    //instructions for the player
    clear();
    console.log(`Instructions to navigate the field :-
                U - to go up
                D - to go down
                L - to go left
                R - to go right
    `);
    prompt('Press Enter to continue... ')

    this.generateField(difficultyLevel);
    clear();
    console.log("Start Playing");
    this.print();
    this.askQuestion();

    while (playing) {

      const isWithInBoundry = this.checkBoundry();
      const isInHole = this.checkHole();
      const isFoundHat = this.foundHat();

      if (!isWithInBoundry) {
        console.log('You jumped out of the field');
        console.log('Lost the Game');
        playing = false;
      }
      else if (isInHole) {
        console.log('Oops... You jumped in to a hole');
        console.log('Lost the Game');
        playing = false;

      } else if (isFoundHat) {
        console.log('Congratulation... You won the game');
        playing = false;
      }
      else {
        clear();
        this.clearFieldCharactor();
        this.updateField();
        this.print();
        this.askQuestion();
      }
    }
  }
}

clear();
const myField = new Field();
myField.runGame()

//console.log(myField.setLevel());
