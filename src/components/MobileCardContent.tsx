import React from 'react'
import { ICard } from '../store/deck/types';
import { getColor } from '../store/deck/utils';

interface Props {
    card: ICard;
}

const suitCodesMap: Record<ICard['suit'], string> = {
    clubs: '♣',
    diamonds: '♦',
    hearts: '♥',
    spades: '♠',
};

const MobileCardContent: React.FC<Props> = ({card}) => {
  return (
      <svg viewBox='0 0 50 70' xmlns="http://www.w3.org/2000/svg">
          <rect x="0" y="0" width="50" height="70" fill='white' rx="2.5" ry="2.5" stroke='black' strokeWidth={0.25}/>
          <text x={4} y={16} fill={getColor(card)} fontSize="1.2rem">{card.rank}</text>
          <text x={46} y={17} fill={getColor(card)} textAnchor="end" fontSize="1.4rem">{suitCodesMap[card.suit]}</text>
          <text x={25} y={47} fill={getColor(card)} textAnchor="middle" fontSize="3rem">{suitCodesMap[card.suit]}</text>
          <g fill={getColor(card)} transform="rotate(180) translate(-50 -70)">
              <text x={4} y={16} fontSize="1.2rem">{card.rank}</text>
              <text x={46} y={17} textAnchor="end" fontSize="1.4rem">{suitCodesMap[card.suit]}</text>
          </g>
      </svg>
  )
}

export default MobileCardContent;
