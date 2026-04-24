import * as React from 'react'
import * as ReactBootstrap from 'react-bootstrap'
import { useState } from 'react';

const { Badge, Button, Card } = ReactBootstrap

function Square({value, onSquareClick}){
    return(
     <button 
     className="square" onClick={onSquareClick}>
      {value}
      </button>
    );
}
function Board(){
  const [squares, setSquares] = useState(Array(9).fill(null));
  function handleClick(){
    const nextSquares = squares.slice();
  nextSquares[0] = "X";
  setSquares(nextSquares);
  }
    return(
    <>
    <div className="board-row">
      <Square value={squares[0]} onSquareClick={handleClick}/>
      <Square value={squares[1]}/>
      <Square value={squares[2]}/>
    </div>
    <div className="board-row">
      <Square value={squares[3]}/>
      <Square value={squares[4]}/>
      <Square value={squares[5]}/>
    </div>
    <div className="board-row">
      <Square value={squares[6]}/>
      <Square value={squares[7]}/>
      <Square value={squares[8]}/>
    </div>
    </>
    );
  }
export default function App() {
  const [name, setName] = React.useState('World')
  return (
    <div className="container py-4">
      <Card className="starter-card shadow-sm">
        <Card.Body className="p-4">
          {Board()}
          <h1 className="greeting display-6 fw-bold">Hello, {name}!</h1>
          <p className="mb-3 text-secondary">
          </p>
          <div className="d-flex gap-2 flex-wrap align-items-center">
            <Button variant="primary" onClick={() => setName('CS 35L')}>
              Set example name
            </Button>
            <Badge bg="secondary" pill>
              ReactBootstrap ready
            </Badge>
          </div>
        </Card.Body>
      </Card>
    </div>
  )
}
