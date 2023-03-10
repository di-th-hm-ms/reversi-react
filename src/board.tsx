import Cell from './cell.tsx'
import { size } from './setting.ts'
function Board(props) {
    // const size = 8
    const renderCell = (x: number, y: number) => {
    // const renderCell = (index: number) => {
        return <Cell
                value={props.cells[x][y]}
                onClick={() => props.onClick(x,y)}
                key={y*size + x}/>
    }

    const generateBoard = (size: number) => {
        const board = [];
        for (let i=0;i<size;i++) {
            let row = [];
            for (let j=0;j<size;j++)
                row.push(renderCell(i,j));
            board.push(<div key={i}>{row}</div>)
        }
        return board
    }

    return (
        <div>
            {generateBoard(size)}
        </div>
    )
}

export default Board;
