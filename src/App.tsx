import Board from "./components/board.tsx"
import { useState } from "react";

export default function App(){

  const [page, setPage] = useState("home");

  if(page == "chess"){
    return (
      <div>
        <div className="font-spline bg-black text-white flex ">
          <button onClick = {() => setPage("home")} className="m-3 border border-white p-2 corner rounded-xl transition transform hover:scale-105 active:scale-90 active:bg-white active:text-black">Back</button>
        </div>        
        <Board/>
      </div>
    )
  }
    return(
      <div className="font-spline min-h-screen bg-black text-white flex flex-col justify-center items-center">
          <div className="text-4xl  "> CHESS</div >
          <button onClick = {() => setPage("chess")} className="border border-white m-4 p-2 corner rounded-xl transition transform hover:scale-105 active:scale-90 active:bg-white active:text-black">PLAY</button>
      </div>

    )
}