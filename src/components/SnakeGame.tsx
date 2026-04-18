import { useEffect, useRef, useState, useCallback } from 'react';
import { Point, GameState } from '../types.ts';

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Point = { x: 0, y: -1 };
const BASE_SPEED = 150;

interface SnakeGameProps {
  onScoreChange: (score: number) => void;
}

export default function SnakeGame({ onScoreChange }: SnakeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [score, setScore] = useState(0);
  const gameLoopRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    onScoreChange(0);
    setFood(generateFood(INITIAL_SNAKE));
    setGameState(GameState.PLAYING);
  };

  const update = useCallback((time: number) => {
    if (gameState !== GameState.PLAYING) return;

    if (time - lastUpdateRef.current > BASE_SPEED - Math.min(score * 2, 100)) {
      lastUpdateRef.current = time;

      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = {
          x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
          y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
        };

        // Collision with self
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameState(GameState.GAME_OVER);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          const newScore = score + 10;
          setScore(newScore);
          onScoreChange(newScore);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }

    gameLoopRef.current = requestAnimationFrame(update);
  }, [direction, food, gameState, score, generateFood, onScoreChange]);

  useEffect(() => {
    if (gameState === GameState.PLAYING) {
      gameLoopRef.current = requestAnimationFrame(update);
    } else {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gameState, update]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      switch (key) {
        case 'arrowup':
        case 'w':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'arrowdown':
        case 's':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'arrowleft':
        case 'a':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'arrowright':
        case 'd':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case 'enter':
          if (gameState !== GameState.PLAYING) resetGame();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, gameState]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width / GRID_SIZE;

    // Clear
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Grid (Subtle)
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * size, 0);
      ctx.lineTo(i * size, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * size);
      ctx.lineTo(canvas.width, i * size);
      ctx.stroke();
    }

    // Draw Snake
    snake.forEach((segment, i) => {
      const isHead = i === 0;
      ctx.fillStyle = isHead ? '#22d3ee' : '#0891b2'; // Cyan-400 : Cyan-600
      ctx.shadowBlur = isHead ? 15 : 5;
      ctx.shadowColor = '#22d3ee';
      
      // Glitchy offset occasionally
      const offsetX = Math.random() < 0.05 ? (Math.random() - 0.5) * 4 : 0;
      const offsetY = Math.random() < 0.05 ? (Math.random() - 0.5) * 4 : 0;

      ctx.fillRect(segment.x * size + 2 + offsetX, segment.y * size + 2 + offsetY, size - 4, size - 4);
    });

    // Draw Food
    ctx.fillStyle = '#db2777'; // Magenta-600
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#db2777';
    ctx.beginPath();
    ctx.arc(food.x * size + size / 2, food.y * size + size / 2, size / 3, 0, Math.PI * 2);
    ctx.fill();

    // Reset shadow
    ctx.shadowBlur = 0;

  }, [snake, food]);

  const prevSnake = useRef<Point[]>(snake);

  return (
    <div id="snake-game-wrapper" className="relative flex flex-col items-center">
      <div id="canvas-container" className="glitch-border p-1 bg-black overflow-hidden relative">
        <canvas
          id="game-canvas"
          ref={canvasRef}
          width={400}
          height={400}
          className="max-w-full h-auto aspect-square block"
        />
        
        {gameState !== GameState.PLAYING && (
          <div id="game-overlay" className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm p-4 text-center">
            <h2 id="overlay-title" className="text-4xl font-bold mb-4 glitch text-magenta-500">
              {gameState === GameState.START ? 'INITIATE_GAME' : 'TERMINATED'}
            </h2>
            {gameState === GameState.GAME_OVER && (
              <p id="final-score" className="text-cyan-400 mb-6 text-xl">FINAL_SCORE: {score}</p>
            )}
            <button
              id="start-btn"
              onClick={resetGame}
              className="px-8 py-3 bg-cyan-500 text-black font-bold hover:bg-cyan-400 hover:scale-105 transition-all glitch-border"
            >
              [PRESS_ENTER_TO_START]
            </button>
          </div>
        )}
      </div>
      
      <div id="game-controls-hint" className="mt-4 flex gap-4 text-sm uppercase tracking-widest text-cyan-700 font-bold">
        <span>WASD/ARR_KEYS: MOVE</span>
        <span>|</span>
        <span>ENT: RESET</span>
      </div>
    </div>
  );
}
