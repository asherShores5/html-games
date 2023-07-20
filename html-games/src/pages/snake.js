import React, { useEffect, useState } from 'react';

const SnakePage = () => {
  const GRID_SIZE = 20;
  const BOARD_SIZE = 400;
  const SNAKE_SPEED = 150;

  const [snake, setSnake] = useState([{ x: 0, y: 0 }]);
  const [food, setFood] = useState({ x: 0, y: 0 });
  const [dx, setDx] = useState(GRID_SIZE);
  const [dy, setDy] = useState(0);
  const [queuedInputs, setQueuedInputs] = useState([]);
  const [gameLoop, setGameLoop] = useState(null);

  useEffect(() => {
    generateFoodPosition();
    startGame();
    return () => {
      clearInterval(gameLoop);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []); // Run the effect only once on initial mount

  const generateFoodPosition = () => {
    const maxX = BOARD_SIZE / GRID_SIZE;
    const maxY = BOARD_SIZE / GRID_SIZE;
    setFood({
      x: Math.floor(Math.random() * maxX) * GRID_SIZE,
      y: Math.floor(Math.random() * maxY) * GRID_SIZE,
    });
  };

  const update = () => {
    handleQueuedInputs();

    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    setSnake([head, ...snake]);

    if (head.x === food.x && head.y === food.y) {
      generateFoodPosition();
    } else {
      setSnake(snake.slice(0, -1));
    }

    if (
      head.x < 0 ||
      head.x >= BOARD_SIZE ||
      head.y < 0 ||
      head.y >= BOARD_SIZE ||
      isSnakeCollision(head)
    ) {
      clearInterval(gameLoop);
      alert('Game Over');
      resetGame();
      return;
    }

    render();
  };

  const isSnakeCollision = (head) => {
    return snake.slice(1).some((segment) => segment.x === head.x && segment.y === head.y);
  };

  const render = () => {
    const gameBoard = document.getElementById('game-board');

    while (gameBoard.firstChild) {
      gameBoard.firstChild.remove();
    }

    snake.forEach((segment, index) => {
      const snakeElement = document.createElement('div');
      snakeElement.style.left = segment.x + 'px';
      snakeElement.style.top = segment.y + 'px';
      snakeElement.classList.add('snake');
      if (index === 0) {
        snakeElement.classList.add('snake-head');
      }
      gameBoard.appendChild(snakeElement);
    });

    const foodElement = document.createElement('div');
    foodElement.style.left = food.x + 'px';
    foodElement.style.top = food.y + 'px';
    foodElement.classList.add('food');
    gameBoard.appendChild(foodElement);
  };

  const handleKeyDown = (event) => {
    switch (event.key) {
      case 'ArrowUp':
        if (dy !== GRID_SIZE) {
          enqueueInput('ArrowUp');
        }
        break;
      case 'ArrowDown':
        if (dy !== -GRID_SIZE) {
          enqueueInput('ArrowDown');
        }
        break;
      case 'ArrowLeft':
        if (dx !== GRID_SIZE) {
          enqueueInput('ArrowLeft');
        }
        break;
      case 'ArrowRight':
        if (dx !== -GRID_SIZE) {
          enqueueInput('ArrowRight');
        }
        break;
      default:
        break;
    }
  };

  const enqueueInput = (input) => {
    setQueuedInputs([...queuedInputs, input]);
  };

  const handleQueuedInputs = () => {
    if (queuedInputs.length > 0) {
      const nextInput = queuedInputs[0];
      setQueuedInputs(queuedInputs.slice(1));

      switch (nextInput) {
        case 'ArrowUp':
          setDx(0);
          setDy(-GRID_SIZE);
          break;
        case 'ArrowDown':
          setDx(0);
          setDy(GRID_SIZE);
          break;
        case 'ArrowLeft':
          setDx(-GRID_SIZE);
          setDy(0);
          break;
        case 'ArrowRight':
          setDx(GRID_SIZE);
          setDy(0);
          break;
        default:
          break;
      }
    }
  };

  const resetGame = () => {
    setSnake([{ x: 0, y: 0 }]);
    setDx(GRID_SIZE);
    setDy(0);
    setQueuedInputs([]);
    generateFoodPosition();
    setGameLoop(setInterval(update, SNAKE_SPEED));
  };

  const startGame = () => {
    setSnake([{ x: 0, y: 0 }]);
    generateFoodPosition();
    document.addEventListener('keydown', handleKeyDown);
    setGameLoop(setInterval(update, SNAKE_SPEED));
  };

  return (
    <div>
      <h1>Snake Game</h1>
      <div id="game-board"></div>
    </div>
  );
};

export default SnakePage;
