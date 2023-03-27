import { useState, useEffect } from "react";
import Board from "./board.tsx";
import { size } from "./setting.ts";

function Game(props) {
    const white = '○', black = '●';
    const [whiteCnt, setWhiteCnt] = useState(2);
    const [blackCnt, setBlackCnt] = useState(2);
    // ['○', '●']
    const [turnState, setTurnState] = useState([white]);
    const [history, setHistory] = useState(
        () => {
            const res = [];
            for (let i=0;i<size;i++) {
                const row = Array(size).fill(null);
                res.push(row);
            }
            const m = size/2;
            res[m-1][m-1] = res[m][m] = white;
            res[m-1][m] = res[m][m-1] = black;
            return [res];
        }
    )
    // to have an index for turnState and history
    const [step, setStep] = useState(0);
    // This is for the state of the board for the current step
    const [cellsState, setCellsState] = useState(history[step]);
    //
    const [prevrMovable, setPrevMovable] = useState(false);
    const [shouldEnd, setShouldEnd] = useState(false);

    /**
     * certainly define who the next turn is.
     */
    useEffect(() => {
        // If all stones are set in all places, this game is end.
        if (calcStones()) return;

        // set the title of the current tab with the next turn.
        document.title = `Next player is ${turnState[step] ? white : black}`;

        // check if there is a place to set a stone.
        let movable = false;
        for (let y=0;y<cellsState.length;y++) {
            for (let x=0;x<cellsState[y].length;x++) {
                if (!(cellsState[y][x] === null)) continue;
                movable = movable || search(x,y,false);
            }
        }

        // If no moves happen two times in a row, this game should end
        if (!movable && !prevrMovable) {
            setShouldEnd(true);
            return;
        }

        // If there's no place to set a stone, the player has to passes this turn.
        if (!movable) {
            console.log("can't move")
            turnState[step] = turnState[step] === black ? white : black
            setTurnState([...turnState]);
        }

        // to check no moves two times in a row.
        setPrevMovable(movable);

    }, [turnState]);

    /**
     * If the sum of both stones are the max after calculation, the outcome must be on display
     */
    useEffect(() => {
        let status: string = "";
        // stones are all set or either stone is out of stock
        if (whiteCnt + blackCnt === size * size || whiteCnt * blackCnt === 0 || shouldEnd) {
            if (whiteCnt === blackCnt) status = "Draw";
            else if (whiteCnt < blackCnt) status = "Black";
            else status = "White";
        }
        document.title = status;
    }, [whiteCnt, blackCnt, shouldEnd]);

    /**
     * how it handles when a cell is clicked.
     * @param x column
     * @param y row
     */
    const handleClick = (x: number, y: number) => {
        if (whiteCnt+blackCnt === size*size || cellsState[y][x]) {
            return;
        }

        search(x, y, true);
    }

    /**
     *
     * @param x column
     * @param y row
     * @param flip whether it handles flipping stones(cells)
     */
    const search = (x: number, y: number, flip: boolean) => {
        let ny: number, nx: number;
        const currentTurn = turnState[step] === white ? white : black;
        const tmp = cellsState.slice();
        const dxs = [-1,-1,-1,0,0,1,1,1], dys = [0,-1,1,-1,1,0,-1,1];
        let changed: boolean;
        let check = false;
        // check 8 directions except center position
        for(let i=0;i<dxs.length;i++) {
            ny = y+dys[i];
            nx = x+dxs[i];
            // check as much as possible
            changed = false;
            while (ny>=0 && ny<size && nx>=0 && nx<size) {
                // except exceeding the edges(limits)
                // turn the stones having opposite color
                if (tmp[ny][nx] === null || tmp[ny][nx] === currentTurn) break;
                // proceed until it finds the stone having a same color.
                // this priority is the depth.
                while (ny>=0 && ny<size && nx>=0 && nx<size) {
                    if (tmp[ny][nx] === null) break;
                    if (tmp[ny][nx] === currentTurn) {
                        changed = true;
                        // flip the stones on its way back to the first position.
                        if (flip) {
                            while (!(x === nx && y === ny)) {
                                tmp[ny][nx] = currentTurn;
                                ny-=dys[i];
                                nx-=dxs[i];
                            }
                        }
                        break;
                    }
                    ny+=dys[i];
                    nx+=dxs[i];
                }
                if (changed) {
                    // set the new stone on the board to prove previous flipping middle stones.
                    if (flip) tmp[y][x] = currentTurn;
                    break;
                }
                ny += dys[i];
                nx += dxs[i];
            }
            check = check || changed;
        }
        // set whole of new states for the next turn.
        if (flip && check) {
            const next = currentTurn === white ? black : white;
            setTurnState(prev => [...prev, next]);
            setStep(step+1)
            setCellsState(tmp);
            setHistory([...history, tmp])
        }
        return check;
    }

    /**
     * calculate how many stones for each color there are.
     */
    const calcStones = () => {
        let wCnt = 0, bCnt = 0;
        for (const row of cellsState) {
            for (const cell of row) {
                if (cell === white) wCnt++;
                else if (cell === black) bCnt++;
            }
        }
        setWhiteCnt(wCnt);
        setBlackCnt(bCnt);
        // let shouldEnd = false;
        setShouldEnd(shouldEnd || (wCnt === 0 || bCnt === 0));
        setShouldEnd(shouldEnd || wCnt + bCnt === size * size);
        return shouldEnd;
    }

    return (
        <div className="game">
            <Board
                cells={cellsState}
                onClick={(x: number, y: number) => handleClick(y, x) }/>
            <div>
                {/* <div>{status}</div> */}
                <div>white {whiteCnt}</div>
                <div>black {blackCnt}</div>
                {/* <div><button>{</button></div> */}
            </div>
        </div>
    )
}

export default Game;
