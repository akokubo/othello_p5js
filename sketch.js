/* board variables */
var board;
var col;
var row;
var blank;
var black;
var white;

/* game variables */
var turn;
var num_white;
var num_black;
var aBoard;

/* visual variables */
var info_font;
var info_font_size;
var cell_size;
var stone_size;

/* algorism variables */
var diff = [
  [0, -1], [1, -1], [1, 0], [1, 1],
  [0, 1], [-1, 1], [-1, 0], [-1, -1]
];


function setup() {
  smooth();
  info_font_size = 24;
  textSize(info_font_size);
  blank = 0;
  white = 1;
  black = 2;
  row = 8;
  col = 8;
  cell_size = 40;
  stone_size = int(cell_size*0.8);
  createCanvas(col*cell_size+200, row*cell_size);
  turn = white;
  init_board();
  background(255, 255, 255);
  drawInfo();
  drawBackground();
  drawBoard();
  drawAv();
}

function init_board() {
  board = [[],[],[],[],[],[],[],[]];
  aBoard = [[],[],[],[],[],[],[],[]];

  for (var y=0; y<row; y++) {
    for (var x=0; x<col; x++) {
      board[y][x] = blank;
      aBoard[y][x] = 0;
    }
  }

  board[row/2-1][col/2-1] = white;
  board[row/2  ][col/2  ] = white;
  board[row/2-1][col/2  ] = black;
  board[row/2  ][col/2-1] = black;
  countNum();
  calcAv();
}

function draw() {

}

function mousePressed() {
  var x = parseInt(mouseX/cell_size);
  var y = parseInt(mouseY/cell_size);
  if (0 < getPoints(y, x)) {
    board[y][x] = turn;
    stonesFlip(y, x);
    countNum();
    turnFlip();
    calcAv();
    background(255, 255, 255);
    drawInfo();
    drawBackground();
    drawBoard();
    drawAv();
  }
}

function drawInfo() {
  translate(col*cell_size, 0);
  fill(0, 0, 0);
  if (turn == white) {
    text("turn: white", 10, info_font_size);
  } else {
    text("turn: black", 10, info_font_size);
  }
  text("white: " + num_white, 10, info_font_size*2);
  text("black: " + num_black, 10, info_font_size*3);
  
  translate(-col*cell_size, 0);  
}
function drawBackground() {
  stroke(0, 0, 0);
  fill(0, 255, 0);
  for (var y=0; y<row; y++) {
    for (var x=0; x<col; x++) {
      rect(x*cell_size, y*cell_size, cell_size, cell_size);
    }
  }
}

function drawBoard() {
  for (var y=0; y<row; y++) {
    for (var x=0; x<col; x++) {
      if (board[y][x] == white) {
        fill(255, 255, 255);
        ellipse((x+0.5)*cell_size, (y+0.5)*cell_size, stone_size, stone_size);
      } else if (board[y][x] == black) {
        fill(0, 0, 0);
        ellipse((x+0.5)*cell_size, (y+0.5)*cell_size, stone_size, stone_size);
      }
    }
  }
}

function drawAv() {
  for (var y=0; y<row; y++) {
    for (var x=0; x<col; x++) {
      if (aBoard[y][x] != 0) {
        fill(255, 0, 0);
        text(aBoard[y][x], (x+0.35)*cell_size, (y+0.15)*cell_size+info_font_size);
      }
    }
  }
}



function getPoints(y, x) {
  var sum = 0;
  if (board[y][x] == blank) {
    for (var d=0; d<8; d++) {
      sum = sum + getPoint(y, x, d);
    }
  }
  return sum;
}

function getPoint(y0, x0, d) {
  var success = false;
  var point = 0;
  var dx = diff[d][0];
  var dy = diff[d][1];
  var x = x0 + dx;
  var y = y0 + dy;
  while (0<=x && x<col && 0<=y && y<row) {
    if (board[y][x] == turn) {
      success = true;
      break;
    } else if (board[y][x] == blank) {
      break;
    }
    point++;
    x = x + dx;
    y = y + dy;
  }
  if (success == false) {
    point = 0;
  }
  return point;
}

function stonesFlip(y, x) {
  for (var d=0; d<8; d++) {
    if (0 < getPoint(y, x, d)) {
      lineFlip(y, x, d);
    }
  }
}

function lineFlip(y0, x0, d) {
  var dx = diff[d][0];
  var dy = diff[d][1];
  var x = x0 + dx;
  var y = y0 + dy;
  while (board[y][x] != turn) {
    board[y][x] = turn;
    x = x + dx;
    y = y + dy;
  }
}

function countNum() {
  var w = 0;
  var b = 0;
  for (var y=0; y<row; y++) {
    for (var x=0; x<col; x++) {
      if (board[y][x] == white) {
        w++;
      } else if (board[y][x] == black) {
        b++;
      }
    }
  }
  num_white = w;
  num_black = b;
}

function calcAv() {
  for (var y=0; y<row; y++) {
    for (var x=0; x<col; x++) {
      aBoard[y][x] = getPoints(y, x);
    }
  }
}

function turnFlip() {
  if (turn == white) {
    turn = black;
  } else {
    turn = white;
  }
}
