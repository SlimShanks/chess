// import { ChessQueen } from 'lucide-react';
function handleClick(a : number, b : number){
    console.log(a + "is clicked" + b + "is clicked")
}
export default function Board(){

     const squares = [
    ["♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜"],
    ["♟", "♟", "♟", "♟", "♟", "♟", "♟", "♟"],
    ["", "", "", "", "", "", ""],
    ["", "", "", "", "", "", ""],
    ["", "", "", "", "", "", ""],
    ["", "", "", "", "", "", ""],
    ["♙", "♙", "♙", "♙", "♙", "♙", "♙", "♙"],
    ["♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖"],
  ];

    return(
        <div>
            <h2 className="text-2xl">
                Chess
            </h2>
        
            {squares.map((_,i) => (
                <div className=" flex flex-row">{squares.map((_,j) => (
                    <div key = {`${i}-${j}`} onClick={()=>handleClick(i,j)} className= {` ${(i+j)%2 != 0 ? "bg-green-800" : "bg-white"} border border-black h-16 w-16`}>{squares[i][j]}</div>
                ))}
                </div>
            ))}

        </div>
    )
}


