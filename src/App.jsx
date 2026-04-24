import { useState } from 'react';

// Adjacency map: which squares are adjacent (including diagonals) to each index
// Board layout:
// 0 | 1 | 2
// 3 | 4 | 5
// 6 | 7 | 8
const ADJACENCY = [
  [1, 3, 4],
  [0, 2, 3, 4, 5],
  [1, 4, 5],
  [0, 1, 4, 6, 7],
  [0, 1, 2, 3, 5, 6, 7, 8],
  [1, 2, 4, 7, 8],
  [3, 4, 7],
  [3, 4, 5, 6, 8],
  [4, 5, 7],
];

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function Square({ value, onSquareClick, isSelected }) {
  return (
    <button
      className="square"
      onClick={onSquareClick}
      style={isSelected ? { backgroundColor: '#aaf' } : {}}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  const [selectedSquare, setSelectedSquare] = useState(null);

  const currentPlayer = xIsNext ? 'X' : 'O';
  const xCount = squares.filter(s => s === 'X').length;
  const oCount = squares.filter(s => s === 'O').length;
  const currentCount = xIsNext ? xCount : oCount;
  const isMovementPhase = currentCount >= 3;

  function handleClick(i) {
    if (calculateWinner(squares)) return;

    if (!isMovementPhase) {
      // Placement phase: click any empty square
      if (squares[i]) return;
      const nextSquares = squares.slice();
      nextSquares[i] = currentPlayer;
      onPlay(nextSquares);
    } else {
      // Movement phase: two-click select-then-move
      if (selectedSquare === null) {
        // First click: must select own piece
        if (squares[i] !== currentPlayer) return;
        setSelectedSquare(i);
      } else {
        // Second click: choose destination
        if (i === selectedSquare) {
          // Clicked same piece: deselect
          setSelectedSquare(null);
          return;
        }
        // Clicking another own piece: re-select it
        if (squares[i] === currentPlayer) {
          setSelectedSquare(i);
          return;
        }
        // Destination must be empty and adjacent to selected piece
        if (squares[i] !== null || !ADJACENCY[selectedSquare].includes(i)) {
          setSelectedSquare(null);
          return;
        }
        // Build the candidate board
        const nextSquares = squares.slice();
        nextSquares[i] = currentPlayer;
        nextSquares[selectedSquare] = null;
        // Center rule: if current player occupies center, move must win or vacate center
        if (squares[4] === currentPlayer) {
          const wins = calculateWinner(nextSquares) === currentPlayer;
          const vacatesCenter = selectedSquare === 4;
          if (!wins && !vacatesCenter) {
            setSelectedSquare(null);
            return;
          }
        }
        setSelectedSquare(null);
        onPlay(nextSquares);
      }
    }
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else if (isMovementPhase && selectedSquare !== null) {
    status = currentPlayer + ': select destination';
  } else {
    status = 'Next player: ' + currentPlayer;
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} isSelected={selectedSquare === 0} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} isSelected={selectedSquare === 1} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} isSelected={selectedSquare === 2} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} isSelected={selectedSquare === 3} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} isSelected={selectedSquare === 4} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} isSelected={selectedSquare === 5} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} isSelected={selectedSquare === 6} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} isSelected={selectedSquare === 7} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} isSelected={selectedSquare === 8} />
      </div>
    </>
  );
}

export default function Game() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  function handlePlay(nextSquares) {
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={squares} onPlay={handlePlay} />
      </div>
    </div>
  );
}
