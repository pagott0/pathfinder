import React, { useState } from "react";

// Tamanho do grid
const GRID_ROWS = 15;
const GRID_COLS = 15;

type Coord = { x: number; y: number };

export default function GridPathfinding() {
  const [start, setStart] = useState<Coord>({ x: 0, y: 0 });
  const [end, setEnd] = useState<Coord>({ x: 5, y: 5 });
  const [path, setPath] = useState<Coord[]>([]);
  const [pathDijkstra, setPathDijkstra] = useState<Coord[]>([]);
  const [obstacles, setObstacles] = useState<Set<string>>(new Set());

  const animatePath = async (fullPath: Coord[]) => {
    for (let i = 0; i < fullPath.length; i++) {
      setPath((prev) => [...prev, fullPath[i]]);
      await new Promise((res) => setTimeout(res, 100)); // 100ms entre passos
    }
  };

  const animatePathDijkstra = async (fullPath: Coord[]) => {
    for (let i = 0; i < fullPath.length; i++) {
      setPathDijkstra((prev) => [...prev, fullPath[i]]);
      await new Promise((res) => setTimeout(res, 100)); // 100ms entre passos
    }
  };

  const calculatePath = () => {
    const result = aStar(start, end, obstacles);
    setPath([]); // limpar antes
    animatePath(result);
  };

  const calculatePathDijkstra = () => {
    const result = dijkstra(start, end, obstacles);
    setPathDijkstra([]); // limpar antes
    animatePathDijkstra(result);
  };

  const isInPath = (x: number, y: number) => {
    return path.some((p) => p.x === x && p.y === y);
  };

  const isInPathDijkstra = (x: number, y: number) => {
    return pathDijkstra.some((p) => p.x === x && p.y === y);
  };

  const toggleObstacle = (x: number, y: number) => {
    const key = `${x},${y}`;
    setObstacles((prevObstacles) => {
      const newObstacles = new Set(prevObstacles);
      if (newObstacles.has(key)) {
        newObstacles.delete(key); // Remove obstáculo
      } else {
        newObstacles.add(key); // Adiciona obstáculo
      }
      return newObstacles;
    });
  };

  return (
    <div className="p-4 space-y-2">
      {/* Legenda */}
      <div className="mt-4 space-x-4 flex flex-row items-center w-full justify-center">
          <span className="text-sm">caption:</span>
          <div className="flex space-x-2 items-center">
            <div className="w-4 h-4 bg-red-400" />
            <span>A*</span>
          </div>
          <div className="flex space-x-2 items-center">
            <div className="w-4 h-4 bg-yellow-400" />
            <span>dijkstra</span>
          </div>
          <div className="flex space-x-2 items-center">
            <div className="w-4 h-4 bg-pink-400" />
            <span>both</span>
          </div>
      </div>
      <div
        className="grid gap-1"
        style={{
          gridTemplateColumns: `repeat(${GRID_COLS}, 1.5rem)`,
        }}
      >
        
        {/* Grid */}
        {Array.from({ length: GRID_ROWS }).flatMap((_, y) =>
          Array.from({ length: GRID_COLS }).map((_, x) => (
            <div
              key={`${x}-${y}`}
              onClick={() => toggleObstacle(x, y)}
              className={`w-6 h-6 border cursor-pointer ${
                start.x === x && start.y === y
                  ? "bg-green-400"
                  : end.x === x && end.y === y
                  ? "bg-blue-400"
                  : isInPath(x, y) && isInPathDijkstra(x, y)
                  ? "bg-pink-400"
                  : isInPath(x, y)
                  ? "bg-red-400"
                  : isInPathDijkstra(x, y)
                  ? "bg-yellow-400"
                  : obstacles.has(`${x},${y}`)
                  ? "bg-gray-700" // Cor de obstáculo (cinza escuro)
                  : "bg-gray-200"
              }`}
            />
          ))
        )}
      </div>
      
      {/* Inputs */}
      <div className="space-y-4 items-center flex flex-col">
        <span className="text-sm text-gray-500">
          click on empty blocks to add obstacles ;)
        </span>
        
        <div  className="flex flex-row gap-8 justify-around w-full">
          <div className="font-bold flex flex-col items-center space-y-1">
            <h2 >initial position</h2>
            <div className="flex flex-row gap-2 items-center">
              <span>x</span>
            <input
              type="number"
              min={0}
              max={GRID_COLS - 1}
              value={start.x}
              onChange={(e) =>  {if(Number(e.target.value) >= 0) {
                setStart({ ...start, x: Number(e.target.value) })
              }}}
              className="border px-2 mr-2 w-16"
              placeholder="X"
              />
              <span>y</span>
            <input
              type="number"
              min={0}
              max={GRID_ROWS - 1}
              value={start.y}
              onChange={(e) => {if(Number(e.target.value) >= 0) {
                setStart({ ...start, y: Number(e.target.value) })
              }}}
              className="border px-2 w-16"
              placeholder="Y"
              />
              </div>
          </div>
        <div className="font-bold flex flex-col items-center space-y-1">
          <h2 className="font-bold">final position</h2>
          <div className="flex flex-row gap-2 items-center">
            <span>x</span>
          <input
            type="number"
            min={0}
            max={GRID_COLS - 1}
            value={end.x}
            onChange={(e) => {if(Number(e.target.value) >= 0) {
              setEnd({ ...end, x: Number(e.target.value) })
            }}}
            className="border px-2 mr-2 w-16"
            placeholder="X"
            />
            <span>y</span>
          <input
            type="number"
            min={0}
            max={GRID_ROWS - 1}
            value={end.y}
            onChange={(e) => {if(Number(e.target.value) >= 0) {
              setEnd({ ...end, y: Number(e.target.value) })
            }}}
            className="border px-2 w-16"
            placeholder="Y"
            />
            </div>
        </div>
        </div>
        <div className="flex flex-row gap-2 w-full">
        <button
          onClick={() => {
            setObstacles(new Set());
          }}
          className="px-4 py-2 bg-white text-primary border border-primary flex-2"
          >
          clear obstacles
        </button>
        <button
          onClick={() => {
            setPath([]);
            setPathDijkstra([]);
          }}
          className="px-4 py-2 bg-white text-primary border border-primary flex-2"
          >
          clear paths
        </button>
        <button
          onClick={() => {
            calculatePath();
            calculatePathDijkstra();
          }}
          className="px-4 py-2 flex-1"
          >
          calculate
        </button>
          </div>
      </div>
      
    </div>
  );
}

// Algoritmo A* (versão básica para grid com obstáculos)
function aStar(start: Coord, end: Coord, obstacles: Set<string>): Coord[] {
  const open: Coord[] = [start];
  const cameFrom = new Map<string, Coord>();

  const gScore = new Map<string, number>();
  gScore.set(`${start.x},${start.y}`, 0);

  const fScore = new Map<string, number>();
  fScore.set(`${start.x},${start.y}`, heuristic(start, end));

  const getNeighbors = (coord: Coord): Coord[] => {
    const directions = [
      { x: 0, y: -1 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: -1, y: 0 },
    ];

    return directions
      .map((d) => ({ x: coord.x + d.x, y: coord.y + d.y }))
      .filter(
        (c) =>
          c.x >= 0 &&
          c.x < GRID_COLS &&
          c.y >= 0 &&
          c.y < GRID_ROWS &&
          !obstacles.has(`${c.x},${c.y}`) // Ignora células com obstáculos
      );
  };

  while (open.length > 0) {
    open.sort(
      (a, b) =>
        (fScore.get(`${a.x},${a.y}`) ?? Infinity) -
        (fScore.get(`${b.x},${b.y}`) ?? Infinity)
    );
    const current = open.shift()!;
    if (current.x === end.x && current.y === end.y) {
      // reconstruir caminho
      const path = [current];
      while (cameFrom.has(`${current.x},${current.y}`)) {
        const prev = cameFrom.get(`${current.x},${current.y}`)!;
        path.push(prev);
        current.x = prev.x;
        current.y = prev.y;
      }
      return path.reverse();
    }

    for (const neighbor of getNeighbors(current)) {
      const tentativeG =
        (gScore.get(`${current.x},${current.y}`) ?? Infinity) + 1;

      const neighborKey = `${neighbor.x},${neighbor.y}`;
      if (tentativeG < (gScore.get(neighborKey) ?? Infinity)) {
        cameFrom.set(neighborKey, current);
        gScore.set(neighborKey, tentativeG);
        fScore.set(neighborKey, tentativeG + heuristic(neighbor, end));
        if (!open.some((c) => c.x === neighbor.x && c.y === neighbor.y)) {
          open.push(neighbor);
        }
      }
    }
  }

  return []; // nenhum caminho encontrado
}

function heuristic(a: Coord, b: Coord) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y); // Manhattan
}

function dijkstra(start: Coord, end: Coord, obstacles: Set<string>): Coord[] {
  const open: Coord[] = [start];
  const cameFrom = new Map<string, Coord>();

  const gScore = new Map<string, number>();
  gScore.set(`${start.x},${start.y}`, 0);

  const getNeighbors = (coord: Coord): Coord[] => {
    const directions = [
      { x: 0, y: -1 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: -1, y: 0 },
    ];

    return directions
      .map((d) => ({ x: coord.x + d.x, y: coord.y + d.y }))
      .filter(
        (c) =>
          c.x >= 0 &&
          c.x < GRID_COLS &&
          c.y >= 0 &&
          c.y < GRID_ROWS &&
          !obstacles.has(`${c.x},${c.y}`) // Ignora células com obstáculos
      );
  };

  while (open.length > 0) {
    // Ordena os nós com base no menor custo de gScore
    open.sort(
      (a, b) =>
        (gScore.get(`${a.x},${a.y}`) ?? Infinity) - (gScore.get(`${b.x},${b.y}`) ?? Infinity)
    );
    
    const current = open.shift()!;

    if (current.x === end.x && current.y === end.y) {
      // Reconstruir caminho
      const path = [current];
      while (cameFrom.has(`${current.x},${current.y}`)) {
        const prev = cameFrom.get(`${current.x},${current.y}`)!;
        path.push(prev);
        current.x = prev.x;
        current.y = prev.y;
      }
      return path.reverse();
    }

    for (const neighbor of getNeighbors(current)) {
      const tentativeG =
        (gScore.get(`${current.x},${current.y}`) ?? Infinity) + 1; // O custo de mover para o vizinho é 1 (movimento básico)

      const neighborKey = `${neighbor.x},${neighbor.y}`;
      if (tentativeG < (gScore.get(neighborKey) ?? Infinity)) {
        cameFrom.set(neighborKey, current);
        gScore.set(neighborKey, tentativeG);

        if (!open.some((c) => c.x === neighbor.x && c.y === neighbor.y)) {
          open.push(neighbor);
        }
      }
    }
  }

  return []; // Nenhum caminho encontrado
}