import React from 'react';
import MemoryCard from './MemoryCard';

function MemoryRow({cards, onClick}) {
    return (
        <div className="memory-row">
            {cards.map(
                card => <MemoryCard onClick={() => onClick(card)} key={card.id} {...card}/>
            )}
        </div>  
    );
}

export default MemoryRow;