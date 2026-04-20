import { UseKanban } from "@/stores/usekanban"

export const Board = () => {
    const {boards, createBoard} = UseKanban();
    return <div>
        <button onClick={() =>
            createBoard({id: `${boards.length}`, name:'新板'})
        }>创建</button>
        
        {boards.map(board => (
            <div key={board.id}>{board.name}</div>
        ))}
        
    </div>
}