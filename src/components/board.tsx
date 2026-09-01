// import { ChessQueen } from 'lucide-react';
import { useState} from "react";



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

    const [square, setSquare]= useState(squares);
    const [active,setActive] = useState<[number, number] | null>(null);

    function handleClick(i : number, j : number){
        console.log(i + "is clicked" + j + "is clicked")

        if(active && active[0] == i && active[1] == j){
            setActive(null)
        }else{
            setActive([i,j]);
        }

    }
    return(
        <div>
            <h2 className="text-2xl">
                Chess
            </h2>
        
            {square.map((_,i) => (
                <div className=" flex flex-row">{squares.map((_,j) => (
                    <div key = {`${i}-${j}`} onClick={()=>handleClick(i,j)} className= {`${active && active[0] == i && active[1] == j  ? "bg-purple-600" : ""}  ${(i+j)%2 != 0 ? "bg-green-800" : "bg-white"} border border-black h-16 w-16`}>{square[i][j]}</div>
                ))}
                </div>
            ))}

        </div>
    )
}


