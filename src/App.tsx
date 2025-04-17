import GridPathFinding from "./components/GridPathFinding";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col pt-4 items-center justify-center">
      <span className="text-2xl font-bold">pathfinder.</span>
      <GridPathFinding />
    </div>
  );
}

export default App;