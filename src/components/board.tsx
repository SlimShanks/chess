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

    const [pop, setPop] = useState(false);
    const [square, setSquare]= useState(squares);
    const [active,setActive] = useState<[number, number] | null>(null);
    const [moves, setMoves] = useState<[number, number][]>([]);
    const [promoSquare, setPromoSquare] = useState<[number, number] | null>(null);

    // Track whether kings/rooks have moved, needed for castling legality
    const [hasMoved, setHasMoved] = useState({
        whiteKing: false,
        whiteRookA: false,
        whiteRookH: false,
        blackKing: false,
        blackRookA: false,
        blackRookH: false,
    });

    function playSound(){
        const sound = new Audio('/src/assets/sound/move.mp3');
        sound.play();
    }

    function choosePromotion(pieceWhite: string, pieceBlack: string) {
        if (!promoSquare) return;
        const [i, j] = promoSquare;

        const moverWasWhite = square[i][j] === "♙";
        const chosenPiece = moverWasWhite ? pieceWhite : pieceBlack;

        square[i][j] = chosenPiece;
        setSquare(square);

        setPop(false);
        setPromoSquare(null);
        setTurn(turn === 1 ? 0 : 1);
    }


    const [turn, setTurn] = useState(1);
    //1 for white
    //0 for black
  



    function handleClick(i : number, j : number, colour : number){

                    // We already have a selected piece
        if (active && moves.length > 0) {
            if (moves.some(([x, y]) => x === i && y === j)) {
                playSound();
                const [start, end] = active;
                const movingPiece = square[start][end];

                // Handle castling: king moving two squares sideways also moves the rook
                if ((movingPiece === "♔" || movingPiece === "♚") && Math.abs(end - j) === 2) {
                    if (j > end) {
                        // kingside castle: rook from h-file to f-file
                        square[i][j - 1] = square[start][7];
                        square[start][7] = "";
                    } else {
                        // queenside castle: rook from a-file to d-file
                        square[i][j + 1] = square[start][0];
                        square[start][0] = "";
                    }
                }

                square[i][j] = movingPiece;
                square[start][end] = "";
                setSquare(square);

                // Update castling rights once a king or rook moves
                if (movingPiece === "♔" || movingPiece === "♚" || movingPiece === "♖" || movingPiece === "♜") {
                    setHasMoved(prev => {
                        const updated = { ...prev };
                        if (movingPiece === "♔") updated.whiteKing = true;
                        if (movingPiece === "♚") updated.blackKing = true;
                        if (movingPiece === "♖") {
                            if (start === 7 && end === 0) updated.whiteRookA = true;
                            if (start === 7 && end === 7) updated.whiteRookH = true;
                        }
                        if (movingPiece === "♜") {
                            if (start === 0 && end === 0) updated.blackRookA = true;
                            if (start === 0 && end === 7) updated.blackRookH = true;
                        }
                        return updated;
                    });
                }

                setMoves([]);
                setActive(null);

                const isPromotion =
                    (movingPiece === "♙" && i === 0) ||
                    (movingPiece === "♟" && i === 7);

                if (isPromotion) {
                    setPromoSquare([i, j]);
                    setPop(true);
                    return; // don't switch turn yet
                }

                setTurn(turn === 1 ? 0 : 1);
                return;
            }
        }

        // No piece selected yet
        if (colour !== turn) {
            return;
        }
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
                if(i == 6){
                    for(let val =1; val <= 2; val++){
                        let temp = i-val;
                        if(square[i-val][j] == ""){
                            num.push([temp,j]);   
                        }else{
                            break;
                        }
                    }
                    setMoves(num)
                }else{
                    let temp = i-1;
                    if(square[i-1][j] == ""){
                        num.push([temp,j]);
                    }

                    if(square[i-1][j+1] != "" && 1 != isWhite(square[i-1][j+1])){
                            num.push([temp,j+1]);   
                    }

                    if(square[i-1][j-1] != "" && 1 != isWhite(square[i-1][j-1])){
                            num.push([temp,j-1]);   
                    }
                    
                    setMoves(num)
                }
                
            }else if(square[i][j] == "♟"){
                let num: [number, number][] = [];

                // Forward movement
                if(i + 1 < 8 && square[i+1][j] == ""){
                    num.push([i+1, j]);

                    // Two-square initial move
                    if(i == 1 && square[i+2][j] == ""){
                        num.push([i+2, j]);
                    }
                }

                // Capture right
                if(i + 1 < 8 &&
                j + 1 < 8 &&
                square[i+1][j+1] != "" &&
                isWhite(square[i+1][j+1]) == 1){
                    num.push([i+1, j+1]);
                }

                // Capture left
                if(i + 1 < 8 &&
                j - 1 >= 0 &&
                square[i+1][j-1] != "" &&
                isWhite(square[i+1][j-1]) == 1){

                    num.push([i+1, j-1]);
                }

                setMoves(num);
            }  else if(square[i][j] == "♘"){
                    let num: [number, number][] = [];

                    let moves = [
                        [-2, 1], [-2, -1],
                        [2, 1],  [2, -1],
                        [-1, 2], [-1, -2],
                        [1, 2],  [1, -2]
                    ];

                    for(let [di, dj] of moves){
                        let ni = i + di;
                        let nj = j + dj;

                        if(ni >= 0 && ni < 8 && nj >= 0 && nj < 8){
                            if(square[ni][nj] == "" || isWhite(square[ni][nj]) != 1){
                                num.push([ni, nj]);
                            }
                        }
                    }

                    setMoves(num);
                }else if(square[i][j] == "♞"){
                    let num: [number, number][] = [];

                    let moves = [
                        [-2, 1], [-2, -1],
                        [2, 1],  [2, -1],
                        [-1, 2], [-1, -2],
                        [1, 2],  [1, -2]
                    ];

                    for(let [di, dj] of moves){
                        let ni = i + di;
                        let nj = j + dj;

                        if(ni >= 0 && ni < 8 && nj >= 0 && nj < 8){

                            // Empty square OR white piece
                            if(square[ni][nj] == "" || isWhite(square[ni][nj]) == 1){
                                num.push([ni, nj]);
                            }
                        }
                    }

                    setMoves(num);
                }else if(square[i][j] == "♜" || square[i][j] == "♖"){
                let num :[number,number][] = [];

                let x = i+1;
                let y = j+1;

                while(x < 8){
                    if(square[x][j] != "") {
                        if(turn != isWhite(square[x][j])) num.push([x,j]);
                        break;
                    }
                    num.push([x,j]);
                    x++;
                }
                
                x = i-1;
                while(x >= 0){
                    if(square[x][j] != "") {
                        if(turn != isWhite(square[x][j])) num.push([x,j]);
                        break;
                    }
                    num.push([x,j]);
                    x--;
                }

                while(y < 8){
                    if(square[i][y] != "") {
                        if(turn != isWhite(square[i][y])) num.push([i,y]);
                        break;}
                    num.push([i,y]);
                    y++;
                }

                y = j-1;
                while(y >= 0 ){
                    if(square[i][y] != "") {
                        if(turn != isWhite(square[i][y])) num.push([i,y]);
                        break;
                    }
                    num.push([i,y]);
                    y--;
                }

                setMoves(num);
            }else if(square[i][j] == "♝" || square[i][j] =="♗"){
                let num :[number,number][] = [];

                let x = i+1;
                let y = j+1;

                while(x < 8 && y<8){
                    if(square[x][y] != "") {
                        if(turn != isWhite(square[x][y])) num.push([x,y]);
                        break;
                    }
                    num.push([x,y])
                    x++;
                    y++;
                }
                
                x = i+1;
                y = j-1;
                while(x < 8 && y>=0){
                    if(square[x][y] != "") {
                        if(turn != isWhite(square[x][y])) num.push([x,y]);
                        break;
                    }
                    num.push([x,y])
                    x++;
                    y--;
                }

                x = i-1;
                y = j+1;
                while(x >= 0 && y<8){
                    if(square[x][y] != "") {
                        if(turn != isWhite(square[x][y])) num.push([x,y]);
                        break;
                    }
                    num.push([x,y])
                    x--;
                    y++;
                }

                x = i-1;
                y = j-1;
                while(x >= 0 && y>=0){
                    if(square[x][y] != "") {
                        if(turn != isWhite(square[x][y])) num.push([x,y]);
                        break;
                    }
                    num.push([x,y])
                    x--;
                    y--;
                }

                setMoves(num);
            }else if(square[i][j] == "♛" || square[i][j] =="♕"){
                let num :[number,number][] = [];

                let x = i+1;
                let y = j+1;

                while(x < 8){
                    if(square[x][j] != "") {
                        if(turn != isWhite(square[x][j])) num.push([x,j]);
                        break;
                    }
                    num.push([x,j]);
                    x++;
                }
                
                x = i-1;
                while(x >= 0){
                    if(square[x][j] != "") {
                        if(turn != isWhite(square[x][j])) num.push([x,j]);
                        break;
                    }
                    num.push([x,j]);
                    x--;
                }

                while(y < 8){
                    if(square[i][y] != "") {
                        if(turn != isWhite(square[i][y])) num.push([i,y]);
                        break;}
                    num.push([i,y]);
                    y++;
                }

                y = j-1;
                while(y >= 0 ){
                    if(square[i][y] != "") {
                        if(turn != isWhite(square[i][y])) num.push([i,y]);
                        break;
                    }
                    num.push([i,y]);
                    y--;
                }

                x = i+1;
                y = j+1;

                while(x < 8 && y<8){
                    if(square[x][y] != "") {
                        if(turn != isWhite(square[x][y])) num.push([x,y]);
                        break;
                    }
                    num.push([x,y])
                    x++;
                    y++;
                }
                
                x = i+1;
                y = j-1;
                while(x < 8 && y>=0){
                    if(square[x][y] != "") {
                        if(turn != isWhite(square[x][y])) num.push([x,y]);
                        break;
                    }
                    num.push([x,y])
                    x++;
                    y--;
                }

                x = i-1;
                y = j+1;
                while(x >= 0 && y<8){
                    if(square[x][y] != "") {
                        if(turn != isWhite(square[x][y])) num.push([x,y]);
                        break;
                    }
                    num.push([x,y])
                    x--;
                    y++;
                }

                x = i-1;
                y = j-1;
                while(x >= 0 && y>=0){
                    if(square[x][y] != "") {
                        if(turn != isWhite(square[x][y])) num.push([x,y]);
                        break;
                    }
                    num.push([x,y])
                    x--;
                    y--;
                }

                setMoves(num);
            }else if(square[i][j] == "♔" || square[i][j] =="♚"){
                const directions = [
                    [-1, -1], [-1, 0], [-1, 1],
                    [0, -1],           [0, 1],
                    [1, -1],  [1, 0],  [1, 1]
                ];

                let num: [number, number][] = [];

                for (const [di, dj] of directions) {
                    const ni = i + di;
                    const nj = j + dj;

                    if (
                        ni >= 0 && ni < 8 &&
                        nj >= 0 && nj < 8 &&
                        square[ni][nj] === ""
                    ) {
                        num.push([ni, nj]);
                    }
                }

                // Castling
                if (square[i][j] === "♔" && !hasMoved.whiteKing) {
                    // kingside
                    if (
                        !hasMoved.whiteRookH &&
                        square[i][5] === "" &&
                        square[i][6] === "" &&
                        square[i][7] === "♖"
                    ) {
                        num.push([i, 6]);
                    }
                    // queenside
                    if (
                        !hasMoved.whiteRookA &&
                        square[i][1] === "" &&
                        square[i][2] === "" &&
                        square[i][3] === "" &&
                        square[i][0] === "♖"
                    ) {
                        num.push([i, 2]);
                    }
                }

                if (square[i][j] === "♚" && !hasMoved.blackKing) {
                    // kingside
                    if (
                        !hasMoved.blackRookH &&
                        square[i][5] === "" &&
                        square[i][6] === "" &&
                        square[i][7] === "♜"
                    ) {
                        num.push([i, 6]);
                    }
                    // queenside
                    if (
                        !hasMoved.blackRookA &&
                        square[i][1] === "" &&
                        square[i][2] === "" &&
                        square[i][3] === "" &&
                        square[i][0] === "♜"
                    ) {
                        num.push([i, 2]);
                    }
                }

                setMoves(num);
            }
        }
    
        
    }

    function isWhite(piece : string){
        return ["♖","♘" ,"♗" ,"♕" ,"♔" ,"♙"].includes(piece) ? 1: 0;
    } 
    return (
        <div>
            <h2 className="text-2xl">Chess</h2>

            {square.map((_, i) => (
                <div key={i} className="flex flex-row">
                    {square.map((_, j) => (
                        <div
                            key={`${i}-${j}`}
                            onClick={() => handleClick(i, j, isWhite(square[i][j]))}
                            className={`${active && active[0] === i && active[1] === j ? "bg-purple-600" : ""} 
                                        ${moves.some(([x, y]) => x === i && y === j) ? "bg-purple-600" : ""}
                                        ${(i + j) % 2 !== 0 ? "bg-green-300" : ""} 
                                        border border-black h-16 w-16`}
                        >
                            {square[i][j]}
                        </div>
                    ))}
                </div>
            ))}

             {pop && (
                <div className="fixed inset-0 flex justify-center items-center">
                    <div className="border border-black backdrop-blur-sm flex flex-row">
                        <div onClick={() => choosePromotion("♘", "♞")} className="w-16 h-16 border border-black">♘</div>
                        <div onClick={() => choosePromotion("♗", "♝")} className="w-16 h-16 border border-black">♗</div>
                        <div onClick={() => choosePromotion("♕", "♛")} className="w-16 h-16 border border-black">♕</div>
                        <div onClick={() => choosePromotion("♖", "♜")} className="w-16 h-16 border border-black">♖</div>
                    </div>
                </div>
            )}
        </div>
    );
}