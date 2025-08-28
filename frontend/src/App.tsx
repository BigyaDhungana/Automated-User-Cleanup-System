import { useState } from "react";

function App() {
  const [result, setResult] = useState("");

  return (
    <div className="flex h-screen overflow-auto flex-col  items-center gap-20">
      <h1 className=" text-5xl text-center">Automated User Cleanup System</h1>
      <button
        className="bg-red-500 hover:cursor-pointer w-2xl h-28 text-white text-5xl hover:text-red-500 hover:border-2 hover:border-red-500 hover:bg-white"
        onClick={() => console.log("hellp")}
      >
        View Latest Report
      </button>
      <button
        className="bg-red-500 hover:cursor-pointer w-2xl h-28 text-white text-5xl hover:text-red-500 hover:border-2 hover:border-red-500 hover:bg-white"
        onClick={() => console.log("hellp")}
      >
        Trigger Cleanup
      </button>
      <button
        className="bg-red-500 hover:cursor-pointer w-2xl h-28 text-white text-5xl hover:text-red-500 hover:border-2 hover:border-red-500 hover:bg-white"
        onClick={() => console.log("hellp")}
      >
        View All Report
      </button>
      <p> {result}</p>
    </div>
  );
}

export default App;
