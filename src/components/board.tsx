// import { ChessQueen } from 'lucide-react';
import { useState} from "react";



export default function Board(){

    const squares = [
        ["♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜"],
        ["♟", "♟", "♟", "♟", "♟", "♟", "♟", "♟"],
        ["",   "",  "",  "",  "",  "",  "", ""],
        ["",   "",  "",  "",  "",  "",  "", ""],
        ["",   "",  "",  "",  "",  "",  "", ""],
        ["",   "",  "",  "",  "",  "",  "", ""],
        ["♙", "♙", "♙", "♙", "♙", "♙", "♙", "♙"],
        ["♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖"],
    ];

    const [square, setSquare]= useState(squares);
    const [active,setActive] = useState<[number, number] | null>(null);
    const [moves, setMoves] = useState<[number, number][]>([]);

    function handleClick(i : number, j : number){
        setMoves([])
        if(active && active[0] == i && active[1] == j){
            setMoves([])
            setActive(null)
            
        }else if(square[i][j] == ""){
            setActive(null)
            setMoves([])
        }else{
            setActive([i,j])           

            if(square[i][j] == "♙"){
                let num: [number, number][] = [];
                for(let val =1; val <= 2; val++){
                    let temp = i-val;
                    num.push([temp,j]);
                }
                setMoves(num)
            }else if(square[i][j] == "♟"){
                let num: [number, number][] = [];
                for(let val =1; val <= 2; val++){
                    let temp = i+val;
                    num.push([temp,j]);
                }
                setMoves(num)
            }else if(square[i][j] == "♘"){
                let num: [number,number][] = [];

                num.push([i-2,j+1]);
                num.push([i-2,j-1]);

                setMoves(num);
            }else if(square[i][j] == "♞"){
                let num: [number,number][] = [];

                num.push([i+2,j+1]);
                num.push([i+2,j-1]);

                setMoves(num);
            }else if(square[i][j] == "♜" || square[i][j] == "♖"){
                let num :[number,number][] = [];

                let x = i+1;
                let y = j+1;

                while(x <= 8){
                    if(square[x][j] != "") break;
                    num.push([x,j]);
                    x++;
                }
                
                x = i-1;
                while(x >= 0){
                    if(square[x][j] != "") break;
                    num.push([x,j]);
                    x--;
                }

                while(y <= 8){
                    if(square[i][y] != "") break;
                    num.push([i,y]);
                    y++;
                }

                y = j-1;
                while(y >= 0 ){
                    if(square[i][y] != "") break;
                    num.push([i,y]);
                    y--;
                }

                setMoves(num);
            }
        }
    
        
    }
    return(
        <div>
            <h2 className="text-2xl">
                Chess
            </h2>
        
            {square.map((_,i) => (
                <div className=" flex flex-row">{squares.map((_,j) => (
                    <div key = {`${i}-${j}`} 
                        onClick={()=>handleClick(i,j)} 
                        className= {`${active && active[0] == i && active[1] == j  ? "bg-purple-600" : ""} 
                                    ${active &&  moves.some(([x, y]) => x === i && y === j) ? "bg-purple-600" : ""}
                                    ${(i+j)%2 != 0 ? "bg-green-800" : ""} 
                                    border border-black h-16 w-16`}>
                        {square[i][j]}
                    </div>
                ))}
                </div>
            ))}

        </div>
    )
}


