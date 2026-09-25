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
    const [blackKing, setBlackKing] = useState<[number,number]>([0,4]);
    const [whiteKing, setWhiteKing] = useState<[number,number]>([7,4]);

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

    function isCheck() {
        let x: number;
        let y: number;

        // Find current player's king
        if (turn == 1) {
            x = whiteKing[0];
            y = whiteKing[1];
        } else {
            x = blackKing[0];
            y = blackKing[1];
        }

        // =========================================
        // 1. ROOK / QUEEN — horizontal + vertical
        // =========================================

        const straightDirections: [number, number][] = [
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1]
        ];

        for (const [dx, dy] of straightDirections) {

            let i = x + dx;
            let j = y + dy;

            while (i >= 0 && i < 8 && j >= 0 && j < 8) {

                if (square[i][j] != "") {

                    if (turn == 1) {
                        // White king -> attacked by black rook/queen
                        if (square[i][j] == "♜" || square[i][j] == "♛") {
                            return true;
                        }
                    } else {
                        // Black king -> attacked by white rook/queen
                        if (square[i][j] == "♖" || square[i][j] == "♕") {
                            return true;
                        }
                    }

                    // Any piece blocks the ray
                    break;
                }

                i += dx;
                j += dy;
            }
        }


        // =========================================
        // 2. BISHOP / QUEEN — diagonals
        // =========================================

        const diagonalDirections: [number, number][] = [
            [1, 1],
            [1, -1],
            [-1, 1],
            [-1, -1]
        ];

        for (const [dx, dy] of diagonalDirections) {

            let i = x + dx;
            let j = y + dy;

            while (i >= 0 && i < 8 && j >= 0 && j < 8) {

                if (square[i][j] != "") {

                    if (turn == 1) {
                        // White king -> attacked by black bishop/queen
                        if (square[i][j] == "♝" || square[i][j] == "♛") {
                            return true;
                        }
                    } else {
                        // Black king -> attacked by white bishop/queen
                        if (square[i][j] == "♗" || square[i][j] == "♕") {
                            return true;
                        }
                    }

                    // Any piece blocks the ray
                    break;
                }

                i += dx;
                j += dy;
            }
        }


        // =========================================
        // 3. KNIGHT
        // =========================================

        const knightMoves: [number, number][] = [
            [-2, 1],
            [-2, -1],
            [2, 1],
            [2, -1],
            [-1, 2],
            [-1, -2],
            [1, 2],
            [1, -2]
        ];

        for (const [dx, dy] of knightMoves) {

            const i = x + dx;
            const j = y + dy;

            if (i >= 0 && i < 8 && j >= 0 && j < 8) {

                if (turn == 1 && square[i][j] == "♞") {
                    return true;
                }

                if (turn == 0 && square[i][j] == "♘") {
                    return true;
                }
            }
        }


        // =========================================
        // 4. ENEMY KING
        // =========================================

        for (let dx = -1; dx <= 1; dx++) {

            for (let dy = -1; dy <= 1; dy++) {

                if (dx == 0 && dy == 0) {
                    continue;
                }

                const i = x + dx;
                const j = y + dy;

                if (i >= 0 && i < 8 && j >= 0 && j < 8) {

                    if (turn == 1 && square[i][j] == "♚") {
                        return true;
                    }

                    if (turn == 0 && square[i][j] == "♔") {
                        return true;
                    }
                }
            }
        }


        // =========================================
        // 5. ENEMY PAWN
        // =========================================

        if (turn == 1) {

            // White king is attacked by black pawns.
            // Black pawns move +i, so they must be at x-1.
            const i = x - 1;

            if (i >= 0) {

                if (y - 1 >= 0 && square[i][y - 1] == "♟") {
                    return true;
                }

                if (y + 1 < 8 && square[i][y + 1] == "♟") {
                    return true;
                }
            }

        } else {

            // Black king is attacked by white pawns.
            // White pawns move -i, so they must be at x+1.
            const i = x + 1;

            if (i < 8) {

                if (y - 1 >= 0 && square[i][y - 1] == "♙") {
                    return true;
                }

                if (y + 1 < 8 && square[i][y + 1] == "♙") {
                    return true;
                }
            }
        }


        // No enemy piece attacks the king
        return false;
    }


    const [turn, setTurn] = useState(1);
    //1 for white
    //0 for black
  
    function whitePawn(i : number, j : number){
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
                    return num;
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
                    
                    return num;
                }
    }

    function blackPawn(i : number, j : number){
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

                return num;
    }

    function knight(i : number, j : number){
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
                            if (turn == 1){
                                if(square[ni][nj] == "" || isWhite(square[ni][nj]) != 1){
                                num.push([ni, nj]);
                                }
                            }else{
                                 // Empty square OR white piece
                                if(square[ni][nj] == "" || isWhite(square[ni][nj]) == 1){
                                    num.push([ni, nj]);
                                }
                            }
                        }
                    }

                    return num;
    }

    function rook(i: number, j: number) {
        const moves: [number, number][] = [];

        const directions: [number, number][] = [
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1]
        ];

        for (const [dx, dy] of directions) {
            let x = i + dx;
            let y = j + dy;

            while (x >= 0 && x < 8 && y >= 0 && y < 8) {

                if (square[x][y] !== "") {
                    if (turn !== isWhite(square[x][y])) {
                        moves.push([x, y]);
                    }

                    break;
                }

                moves.push([x, y]);

                x += dx;
                y += dy;
            }
        }

        return moves;
    }

    function bishop(i: number, j: number) {
        const moves: [number, number][] = [];

        const directions: [number, number][] = [
            [1, 1],
            [1, -1],
            [-1, 1],
            [-1, -1]
        ];

        for (const [dx, dy] of directions) {
            let x = i + dx;
            let y = j + dy;

            while (x >= 0 && x < 8 && y >= 0 && y < 8) {

                if (square[x][y] !== "") {
                    if (turn !== isWhite(square[x][y])) {
                        moves.push([x, y]);
                    }
                    break;
                }

                moves.push([x, y]);

                x += dx;
                y += dy;
            }
        }

        return moves;
    }
    const [popup, setPopup] = useState("");
    function showPopup(message: string) {
    setPopup(message);

    setTimeout(() => {
        setPopup("");
    }, 2000);
}

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
                console.log(i,j);
                square[start][end] = "";
                setSquare(square);

                if (movingPiece === "♔" ){
                    setWhiteKing([i,j]);
                    console.log(whiteKing)
                }else if(movingPiece === "♚"){
                    setBlackKing([i,j])
                    console.log(blackKing)
                }


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
                
                if (isCheck()) {
                    showPopup("Check!");
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
                setMoves(whitePawn(i,j))
            }else if(square[i][j] == "♟"){
                setMoves(blackPawn(i,j))
            }  else if(square[i][j] == "♘" || square[i][j] == "♞"){
                setMoves(knight(i,j));
            }else if(square[i][j] == "♜" || square[i][j] == "♖"){
                setMoves(rook(i,j));
            }else if(square[i][j] == "♝" || square[i][j] =="♗"){
                setMoves(bishop(i,j));
            }else if(square[i][j] == "♛" || square[i][j] =="♕"){
                setMoves([...bishop(i, j), ...rook(i, j)]);
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
        <div className="min-h-screen bg-black flex items-center justify-center">
            <h2 className="text-2xl">

            {square.map((_, i) => (
                <div key={i} className="flex flex-row bg-white">
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
            </h2>

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

            {popup && (
                <div className="fixed top-5 left-1/2 -translate-x-1/2 
                                bg-black text-white px-4 py-2 rounded-lg">
                    {popup}
                </div>
            )}
        </div>
    );
}