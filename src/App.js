import React from 'react';

function App() {
  return (
    <div className="App">
      <MatrixGame />
    </div>
  );
}

export default App;


import React, { useState, useEffect } from 'react';

const MatrixGame = () => {
  const [gameState, setGameState] = useState('pick');
  const [message, setMessage] = useState("Player 1, hide a number. Click a number on the grid.");
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [turnsInRound, setTurnsInRound] = useState(0);
  const [currentSelection, setCurrentSelection] = useState(null);
  const [secretNumber, setSecretNumber] = useState(null);
  const [isPlayer1Turn, setIsPlayer1Turn] = useState(true);
  const [isPlayer1Hiding, setIsPlayer1Hiding] = useState(true);
  const [isAIMode, setIsAIMode] = useState(false);

  useEffect(() => {
    if (currentRound > 3) {
      setGameState('gameOver');
      let result;
      if (player1Score > player2Score) {
        result = isAIMode ? "You win! 🎉" : "Player 1 wins! 🎉";
      } else if (player2Score > player1Score) {
        result = isAIMode ? "AI wins!" : "Player 2 wins! 🎉";
      } else {
        result = "It's a draw! 🤝";
      }
      setMessage(result + " Game Over.");
    }
  }, [currentRound, player1Score, player2Score, isAIMode]);

  const handleCellClick = (number) => {
    if ((gameState === 'pick' || gameState === 'guess') && (isPlayer1Turn || !isAIMode)) {
      setCurrentSelection(number);
      setMessage(gameState === 'pick' 
        ? "Click 'Confirm Hide' to lock in your hidden number." 
        : "Click 'Confirm Seek' to lock in your guess.");
    }
  };

  const confirmHide = () => {
    if (currentSelection === null) {
      setMessage("Please select a number to hide first.");
      return;
    }
    setSecretNumber(currentSelection);
    setGameState('guess');
    setMessage(isAIMode 
      ? "You hid a number. Click 'Let AI Guess'." 
      : `Player ${isPlayer1Turn ? '1' : '2'} hid a number. Player ${isPlayer1Turn ? '2' : '1'}, make your guess.`);
    setCurrentSelection(null);
    setIsPlayer1Turn(!isPlayer1Turn);
  };

  const confirmSeek = () => {
    if (currentSelection === null) {
      setMessage("Please select a number to guess first.");
      return;
    }
    if (currentSelection === secretNumber) {
      if (isAIMode) {
        setPlayer1Score(player1Score + 1);
        setMessage("You guessed correctly! You get a point.");
      } else {
        isPlayer1Turn ? setPlayer1Score(player1Score + 1) : setPlayer2Score(player2Score + 1);
        setMessage(`Player ${isPlayer1Turn ? '1' : '2'} guessed correctly and gets a point!`);
      }
    } else {
      if (isAIMode) {
        setPlayer2Score(player2Score + 1);
        setMessage("You guessed wrong. AI gets a point!");
      } else {
        isPlayer1Turn ? setPlayer2Score(player2Score + 1) : setPlayer1Score(player1Score + 1);
        setMessage(`Player ${isPlayer1Turn ? '1' : '2'} guessed wrong. Player ${isPlayer1Turn ? '2' : '1'} gets a point!`);
      }
    }
    setGameState('roundEnd');
    setCurrentSelection(null);
    setTurnsInRound(turnsInRound + 1);
    if (turnsInRound === 1) {
      setCurrentRound(currentRound + 1);
      setTurnsInRound(0);
    }
  };

  const letAIAct = () => {
    const aiChoice = Math.floor(Math.random() * 4) + 1;
    if (gameState === 'pick') {
      setSecretNumber(aiChoice);
      setGameState('guess');
      setMessage("AI hid a number. Make your guess.");
      setIsPlayer1Turn(true);
    } else {
      if (aiChoice === secretNumber) {
        setPlayer2Score(player2Score + 1);
        setMessage(`AI guessed ${aiChoice}, which is correct! AI gets a point.`);
      } else {
        setPlayer1Score(player1Score + 1);
        setMessage(`AI guessed ${aiChoice}, which is wrong. You get a point.`);
      }
      setGameState('roundEnd');
      setTurnsInRound(turnsInRound + 1);
      if (turnsInRound === 1) {
        setCurrentRound(currentRound + 1);
        setTurnsInRound(0);
      }
    }
    setIsPlayer1Turn(!isPlayer1Turn);
  };

  const startNewTurn = () => {
    setSecretNumber(null);
    setGameState('pick');
    setCurrentSelection(null);
    setIsPlayer1Hiding(!isPlayer1Hiding);
    const currentPlayer = isPlayer1Hiding ? 2 : 1;
    if (isAIMode) {
      if (currentPlayer === 1) {
        setIsPlayer1Turn(true);
        setMessage("Your turn to hide a number.");
      } else {
        setIsPlayer1Turn(false);
        setMessage("AI's turn to hide. Click 'Let AI Hide'.");
      }
    } else {
      setMessage(`Player ${currentPlayer}, hide a number.`);
      setIsPlayer1Turn(currentPlayer === 1);
    }
  };

  const startNewGame = () => {
    setPlayer1Score(0);
    setPlayer2Score(0);
    setIsPlayer1Turn(true);
    setIsPlayer1Hiding(true);
    setGameState('pick');
    setCurrentSelection(null);
    setCurrentRound(1);
    setTurnsInRound(0);
    setMessage(isAIMode ? "New game! Your turn to hide a number." : "New game! Player 1, hide a number.");
  };

  const toggleGameMode = () => {
    setIsAIMode(!isAIMode);
    startNewGame();
  };

  return (
    <div style={{fontFamily: 'Arial, sans-serif', maxWidth: '300px', margin: '0 auto', padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '10px', boxShadow: '0 0 10px rgba(0,0,0,0.1)'}}>
      <h2 style={{textAlign: 'center'}}>Matrix Game</h2>
      <div style={{backgroundColor: 'white', padding: '10px', borderRadius: '5px', marginBottom: '20px'}}>
        <h3 style={{textAlign: 'center', marginTop: '0'}}>Leaderboard</h3>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <div>{isAIMode ? "Player" : "Player 1"}: {player1Score}</div>
          <div>{isAIMode ? "AI" : "Player 2"}: {player2Score}</div>
        </div>
        <div style={{textAlign: 'center'}}>Round: {Math.min(currentRound, 3)}/3</div>
      </div>
      
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px'}}>
        {[1, 2, 3, 4].map((num) => (
          <div 
            key={num} 
            onClick={() => handleCellClick(num)}
            style={{
              aspectRatio: '1', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              backgroundColor: currentSelection === num ? '#bfdbfe' : 'white', 
              fontSize: '24px', 
              fontWeight: 'bold', 
              borderRadius: '5px', 
              cursor: 'pointer'
            }}
          >
            {num}
          </div>
        ))}
      </div>
      
      <div style={{minHeight: '40px', textAlign: 'center', marginBottom: '20px'}}>
        {message}
      </div>
      
      {gameState === 'pick' && (isPlayer1Turn || !isAIMode) && (
        <button 
          onClick={confirmHide}
          style={{display: 'block', width: '100%', padding: '10px', marginBottom: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer'}}
        >
          Confirm Hide
        </button>
      )}
      {gameState === 'guess' && (isPlayer1Turn || !isAIMode) && (
        <button 
          onClick={confirmSeek}
          style={{display: 'block', width: '100%', padding: '10px', marginBottom: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer'}}
        >
          Confirm Seek
        </button>
      )}
      {isAIMode && !isPlayer1Turn && (
        <button 
          onClick={letAIAct}
          style={{display: 'block', width: '100%', padding: '10px', marginBottom: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer'}}
        >
          Let AI {gameState === 'pick' ? 'Hide' : 'Guess'}
        </button>
      )}
      {gameState === 'roundEnd' && currentRound <= 3 && (
        <button 
          onClick={startNewTurn}
          style={{display: 'block', width: '100%', padding: '10px', marginBottom: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer'}}
        >
          Next Turn
        </button>
      )}
      {gameState === 'gameOver' && (
        <button 
          onClick={startNewGame}
          style={{display: 'block', width: '100%', padding: '10px', marginBottom: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer'}}
        >
          Start New Game
        </button>
      )}
      <button 
        onClick={toggleGameMode}
        style={{display: 'block', width: '100%', padding: '10px', marginTop: '10px', backgroundColor: '#FFA500', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer'}}
      >
        Switch to {isAIMode ? "Two-Player" : "AI"} Mode
      </button>
    </div>
  );
};

export { App, MatrixGame };
