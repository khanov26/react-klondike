import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {shuffle} from "lodash";
import {ICard, IDeckState, MoveCardsPayload} from "./types";
import {orderedDeck} from "./utils";

let initialState = getInitialState();

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
        moveCards: (state, action: PayloadAction<MoveCardsPayload>) => {
            const {cards, from, to} = action.payload;

            if (from.type === 'stock') {
                if (to.type === 'pile') {
                    moveFromStockToPile(state.stock.upturned, state.piles[to.index]);
                } else if (to.type === 'foundation') {
                    moveFromStockToFoundation(state.stock.upturned, state.foundations[to.index]);
                }
            } else if (from.type === 'foundation') {
                if (to.type === 'foundation') {
                    moveFromFoundationToFoundation(state.foundations[from.index], state.foundations[to.index]);
                } else if (to.type === 'pile') {
                    moveFromFoundationToPile(state.foundations[from.index], state.piles[to.index]);
                }
            } else if (from.type === 'pile') {
                if (to.type === 'foundation') {
                    moveFromPileToFoundation(state.piles[from.index], state.foundations[to.index]);
                } else if (to.type === 'pile') {
                    moveFromPileToPile(state.piles[from.index], state.piles[to.index], cards);
                }
            }
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
                initialState = getInitialState();
                return initialState;
            })
            .addCase('game/restart', () => initialState);
    }
});

export default deckSlice.reducer;
export const {openNextCard, turnStock, moveCards, turnCard} = deckSlice.actions;

function getInitialState(): IDeckState {
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
        foundations: [
            [],
            [],
            [],
            []
        ]
    };
}

function moveFromStockToPile(stock: ICard[], pile: ICard[]) {
    const card = stock.pop() as ICard;
    pile.push(card);
}

function moveFromStockToFoundation(stock: ICard[], foundation: ICard[]) {
    const card = stock.pop() as ICard;
    foundation.push(card);
}

function moveFromFoundationToFoundation(foundationFrom: ICard[], foundationTo: ICard[]) {
    const card = foundationFrom.pop() as ICard;
    foundationTo.push(card);
}

function moveFromFoundationToPile(foundation: ICard[], pile: ICard[]) {
    const card = foundation.pop() as ICard;
    pile.push(card);
}

function moveFromPileToFoundation(pile: ICard[], foundation: ICard[]) {
    const card = pile.pop() as ICard;
    foundation.push(card);
}

function moveFromPileToPile(pileFrom: ICard[], pileTo: ICard[], cards: ICard[]) {
    const movingFirstCard = cards[0];
    const movingFirstCardIndex = pileFrom.findIndex(curCard =>
        curCard.suit === movingFirstCard.suit && curCard.rank === movingFirstCard.rank
    );
    pileFrom.splice(movingFirstCardIndex, 52);
    pileTo.push(...cards);
}
