import {ICard, IDeckState} from "./types";
import {getColor, getRankValue} from "./utils";

export const canMoveToPile = (movingCards: ICard[], pileCards: ICard[]) => {
    const movingFirstCard = movingCards[0];
    const pileLastCard = pileCards.length ? pileCards[pileCards.length - 1] : null;

    return (pileLastCard === null && movingFirstCard.rank === 'K') ||
        (pileLastCard !== null && getColor(pileLastCard) !== getColor(movingFirstCard)
            && getRankValue(pileLastCard) === getRankValue(movingFirstCard) + 1)
};

export const canMoveToFoundation = (movingCards: ICard[], foundationCards: ICard[]) => {
    if (movingCards.length !== 1) {
        return false;
    }

    const card = movingCards[0];

    const foundationLastCard = foundationCards.length ? foundationCards[foundationCards.length - 1] : null;

    return (foundationLastCard === null && card.rank === 'A') ||
        (foundationLastCard !== null && foundationLastCard.suit === card.suit
            && getRankValue(foundationLastCard) === getRankValue(card) - 1);
};

export const isGameOver = (foundations: IDeckState['foundations']) => {
    for (let foundation of foundations) {
        const foundationLastCard = foundation.length ? foundation[foundation.length - 1] : null;
        if (foundationLastCard === null || foundationLastCard.rank !== 'K') {
            return false;
        }
    }
    return true;
};
