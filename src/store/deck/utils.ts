import {Color, ICard, Rank, Suit} from "./types";

export const orderedDeck = generateDeck();

export function getColor(card: ICard): Color {
    if (['hearts', 'diamonds'].includes(card.suit)) {
        return 'red';
    }
    return 'black';
}

export function getShortName(card: ICard) {
    return `${card.rank}${card.suit.slice(0, 1).toUpperCase()}`;
}

export const getRankValue = (() => {
    const rankValues: Record<Rank, number> = {
        '2': 2,
        '3': 3,
        '4': 4,
        '5': 5,
        '6': 6,
        '7': 7,
        '8': 8,
        '9': 9,
        '10': 10,
        'J': 11,
        'Q': 12,
        'K': 13,
        'A': 1
    };

    return (card: ICard) => rankValues[card.rank]
})();

function generateDeck(): ICard[] {
    const cards = [];

    const suits: Suit[] = ['clubs', 'diamonds', 'hearts', 'spades'];

    const ranks: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

    for (let suit of suits) {
        for (let rank of ranks) {
            cards.push({rank, suit, isUpturned: false});
        }
    }

    return cards;
}