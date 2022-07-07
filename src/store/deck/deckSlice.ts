import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {shuffle} from "lodash";
import {ICard, IDeckState} from "./types";
import {orderedDeck} from "./utils";

const initialState: IDeckState = {
    piles: Array(7).fill([]),
    stock: {
        downturned: orderedDeck,
        upturned: [],
    },
    foundations: Array(4).fill([]),
};
let dealtCards: IDeckState;

const deckSlice = createSlice({
    name: 'deck',
    initialState,
    reducers: {
        openNextCard: state => {
            const {downturned, upturned} = state.stock;
            const card = downturned.pop() as ICard;
            card.isUpturned = true;
            upturned.push(card);
        },
        turnStock: state => {
            const {stock} = state;

            stock.downturned = stock.upturned.reverse().map(card => {
                card.isUpturned = false;
                return card;
            });
            stock.upturned = [];
        },
        moveFromStockToPile: (state, action: PayloadAction<number>) => {
            const card = state.stock.upturned.pop() as ICard;
            const pileIndex = action.payload;
            state.piles[pileIndex].push(card);
        },
        moveFromStockToFoundation: (state, action: PayloadAction<number>) => {
            const card = state.stock.upturned.pop() as ICard;
            const foundationIndex = action.payload;
            state.foundations[foundationIndex].push(card);
        },
        moveFromFoundationToFoundation: (state, action: PayloadAction<{fromIndex: number, toIndex: number}>) => {
            const {fromIndex, toIndex} = action.payload;
            const card = state.foundations[fromIndex].pop() as ICard;
            state.foundations[toIndex].push(card);
        },
        moveFromFoundationToPile: (state, action: PayloadAction<{fromIndex: number, toIndex: number}>) => {
            const {fromIndex, toIndex} = action.payload;
            const card = state.foundations[fromIndex].pop() as ICard;
            state.piles[toIndex].push(card);
        },
        moveFromPileToFoundation: (state, action: PayloadAction<{fromIndex: number, toIndex: number}>) => {
            const {fromIndex, toIndex} = action.payload;
            const card = state.piles[fromIndex].pop() as ICard;
            state.foundations[toIndex].push(card);
        },
        moveFromPileToPile: (state, action: PayloadAction<{fromIndex: number, toIndex: number, cards: ICard[]}>) => {
            const {fromIndex, toIndex, cards} = action.payload;
            const movingFirstCard = cards[0];
            const pileFrom = state.piles[fromIndex];
            const pileTo = state.piles[toIndex];
            const movingFirstCardIndex = pileFrom.findIndex(curCard =>
                curCard.suit === movingFirstCard.suit && curCard.rank === movingFirstCard.rank
            );
            pileFrom.splice(movingFirstCardIndex, 52);
            pileTo.push(...cards);
        },
        turnCard: (state, action: PayloadAction<number>) => {
            const pileIndex = action.payload;
            const pile = state.piles[pileIndex];
            const pileLastCard = pile[pile.length - 1];
            pileLastCard.isUpturned = true;
        },
    },
    extraReducers: builder => {
        builder
            .addCase('game/start', () => {
                dealtCards = dealCards();
                return dealtCards;
            })
            .addCase('game/restart', () => dealtCards);
    }
});

export default deckSlice.reducer;
export const {
    openNextCard,
    turnStock,
    turnCard,
    moveFromFoundationToFoundation,
    moveFromFoundationToPile,
    moveFromPileToFoundation,
    moveFromPileToPile,
    moveFromStockToFoundation,
    moveFromStockToPile,
} = deckSlice.actions;

function dealCards(): IDeckState {
    const shuffledDeck = shuffle(orderedDeck);

    const piles = [];
    for (let pileIndex = 1; pileIndex <= 7; pileIndex++) {
        let pileCards: ICard[] = [];
        for (let cardsCount = 0; cardsCount < pileIndex; cardsCount++) {
            pileCards.push(shuffledDeck.pop() as ICard);
        }
        const pileLastCard = pileCards.pop() as ICard;
        pileCards.push({...pileLastCard, isUpturned: true});
        piles.push(pileCards);
    }

    return {
        piles,
        stock: {
            downturned: shuffledDeck,
            upturned: [],
        },
        foundations: Array(4).fill([]),
    };
}
