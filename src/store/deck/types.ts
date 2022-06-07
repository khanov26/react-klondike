export interface IDeckState {
    piles: ICard[][];
    stock: {
        downturned: ICard[];
        upturned: ICard[];
    };
    foundations: ICard[][];
}

export interface MoveCardsPayload {
    cards: ICard[];
    from: FoundationPlace | PilePlace | StockPlace;
    to: FoundationPlace | PilePlace;
}

export interface FoundationPlace {
    type: 'foundation';
    index: 0 | 1 | 2 | 3;
}

export interface  PilePlace {
    type: 'pile';
    index: 0 | 1 | 2 | 3 | 4 | 5 | 6;
}

export interface StockPlace {
    type: 'stock';
}

export type Suit = 'hearts' | 'spades' | 'diamonds' | 'clubs';

export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';

export type Color = 'black' | 'red';

export interface ICard {
    suit: Suit;
    rank: Rank;
    isUpturned: boolean;
}