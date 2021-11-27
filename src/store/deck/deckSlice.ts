import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {shuffle} from "lodash";
import {ICard, IDeckState, MoveCardsPayload} from "./types";
import {getColor, getRankValue, orderedDeck} from "./utils";

let initialState = getInitialState();

const deckSlice = createSlice({
    name: 'deck',
    initialState,
    reducers: {
        restart: state => initialState,
        start: state => getInitialState(),
        openNextCard: state => {
            const {downturned, upturned} = state.stock;

            if (downturned.length !== 0) {
                const card = downturned.pop() as ICard;
                card.isUpturned = true;
                upturned.push(card);
            } else {
                state.stock.downturned = upturned.reverse().map(card => {
                    card.isUpturned = false;
                    return card;
                });
                state.stock.upturned = [];
            }
        },
        moveCards: (state, action: PayloadAction<MoveCardsPayload>) => {
            const {cards, from, to} = action.payload;

            if (from.type === 'stock') {
                if (to.type === 'pile') {
                    moveFromStockToPile(state.stock.upturned, state.piles[to.index], cards);
                } else if (to.type === 'foundation') {
                    moveFromStockToFoundation(state.stock.upturned, state.foundations[to.index], cards);
                    state.win = checkIfWin(state.foundations);
                }
            } else if (from.type === 'foundation') {
                if (to.type === 'foundation') {
                    moveFromFoundationToFoundation(state.foundations[from.index], state.foundations[to.index], cards);
                } else if (to.type === 'pile') {
                    moveFromFoundationToPile(state.foundations[from.index], state.piles[to.index], cards);
                }
            } else if (from.type === 'pile') {
                if (to.type === 'foundation') {
                    moveFromPileToFoundation(state.piles[from.index], state.foundations[to.index], cards);
                    state.win = checkIfWin(state.foundations);
                } else if (to.type === 'pile') {
                    moveFromPileToPile(state.piles[from.index], state.piles[to.index], cards);
                }
            }
        },
        turnCard: (state, action: PayloadAction<number>) => {
            const pileIndex = action.payload;
            const pile = state.piles[pileIndex];
            const pileLastCard = pile.length ? pile[pile.length - 1] : null;

            if (pileLastCard && !pileLastCard.isUpturned) {
                pileLastCard.isUpturned = true
            }
        },
    }
});

export default deckSlice.reducer;
export const {start, restart, openNextCard, moveCards, turnCard} = deckSlice.actions;

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
        ],
        win: false,
    };
}

function moveFromStockToPile(stock: ICard[], pile: ICard[], cards: ICard[]) {
    const card = cards[0];

    const pileLastCard = pile.length ? pile[pile.length - 1] : null;

    if ((pileLastCard === null && card.rank === 'K') ||
        (pileLastCard !== null && getColor(pileLastCard) !== getColor(card)
            && getRankValue(pileLastCard) === getRankValue(card) + 1)
    ) {
        stock.pop();
        pile.push(...cards);
    }
}

function moveFromStockToFoundation(stock: ICard[], foundation: ICard[], cards: ICard[]) {
    const card = cards[0];
    const stockLastCard = stock.length ? stock[stock.length - 1] : null;

    if(stockLastCard === null || stockLastCard.rank !== card.rank || stockLastCard.suit !== card.suit) {
        return;
    }

    const foundationLastCard = foundation.length ? foundation[foundation.length - 1] : null;

    if ((foundationLastCard === null && card.rank === 'A') ||
        (foundationLastCard !== null && foundationLastCard.suit === card.suit
            && getRankValue(foundationLastCard) === getRankValue(card) - 1)
    ) {
        stock.pop();
        foundation.push(card);
    }
}

function moveFromFoundationToFoundation(foundationFrom: ICard[], foundationTo: ICard[], cards: ICard[]) {
    const card = cards[0];
    if (card.rank !== 'A') {
        return;
    }

    if (foundationTo.length > 0) {
        return;
    }

    foundationFrom.pop();
    foundationTo.push(card);
}

function moveFromFoundationToPile(foundation: ICard[], pile: ICard[], cards: ICard[]) {
    const card = cards[0];

    const pileLastCard = pile.length ? pile[pile.length - 1] : null;

    if ((pileLastCard === null && card.rank === 'K') ||
        (pileLastCard !== null && getColor(pileLastCard) !== getColor(card)
            && getRankValue(pileLastCard) === getRankValue(card) + 1)
    ) {
        foundation.pop();
        pile.push(...cards);
    }
}

function moveFromPileToFoundation(pile: ICard[], foundation: ICard[], cards: ICard[]) {
    if (cards.length !== 1) {
        return;
    }

    const card = cards[0];
    const pileLastCard = pile.length ? pile[pile.length - 1] : null;

    if(pileLastCard === null || pileLastCard.rank !== card.rank || pileLastCard.suit !== card.suit) {
        return;
    }

    const foundationLastCard = foundation.length ? foundation[foundation.length - 1] : null;

    if ((foundationLastCard === null && card.rank === 'A') ||
        (foundationLastCard !== null && foundationLastCard.suit === card.suit
            && getRankValue(foundationLastCard) === getRankValue(card) - 1)
    ) {
        pile.pop();
        foundation.push(card);
    }
}

function moveFromPileToPile(pileFrom: ICard[], pileTo: ICard[], cards: ICard[]) {
    const movingFirstCard = cards[0];
    const pileToLastCard = pileTo.length ? pileTo[pileTo.length - 1] : null;

    if ((pileToLastCard === null && movingFirstCard.rank === 'K') ||
        (pileToLastCard !== null && getColor(pileToLastCard) !== getColor(movingFirstCard)
            && getRankValue(pileToLastCard) === getRankValue(movingFirstCard) + 1)
    ) {
        const movingFirstCardIndex = pileFrom.findIndex(curCard =>
            curCard.isUpturned === true && curCard.suit === movingFirstCard.suit && curCard.rank === movingFirstCard.rank
        );
        pileFrom.splice(movingFirstCardIndex, 52);
        pileTo.push(...cards);
    }
}

function checkIfWin(foundations: IDeckState['foundations']): boolean {
    for (let foundation of foundations) {
        const foundationLastCard = foundation.length ? foundation[foundation.length - 1] : null;
        if (foundationLastCard === null || foundationLastCard.rank !== 'K') {
            return false;
        }
    }
    return true;
}
