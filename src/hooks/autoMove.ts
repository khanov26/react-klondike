import { useEffect, useRef } from "react";
import { moveCards } from "../store/deck/deckSlice";
import { canMoveToFoundation } from "../store/deck/gameRules";
import { FoundationPlace, PilePlace, StockPlace } from "../store/deck/types";
import { useAppDispatch, useAppSelector } from "../store/hooks";

export default function useAutoMove() {
    const {piles, foundations, stock: {upturned}} = useAppSelector(state => state.deck.present);
    const dispatch = useAppDispatch();

    const moved = useRef<boolean>();

    useEffect(() => {
        if (moved.current) {
            doAutoMove();
        }
    });

    const doAutoMove = () => {
        moved.current = false;

        if (moveFromStock()) {
            moved.current = true;
            return;
        }
        if (moveFromPiles()) {
            moved.current = true;
            return;
        }
    };

    const moveFromStock = () => {
        const upturnedStockLastCard = upturned.length ? upturned[upturned.length - 1] : null;
        if (upturnedStockLastCard === null) {
            return false;
        }

        for (let foundationIndex = 0; foundationIndex < 4; foundationIndex++) {
            if (canMoveToFoundation([upturnedStockLastCard], foundations[foundationIndex])) {
                const from: StockPlace = {
                    type: 'stock'
                };

                const to: FoundationPlace = {
                    type: 'foundation',
                    index: foundationIndex as FoundationPlace['index'],
                };
                dispatch(moveCards({cards: [upturnedStockLastCard], from, to}));
                return true;
            }
        }
        return false;
    };

    const moveFromPiles = () => {
        let movedFromPiles = false;

        for (let index = 0; index < piles.length; index++) {
            const pile = piles[index];
            const pileLastCard = pile.length ? pile[pile.length - 1] : null;
            if (pileLastCard === null || !pileLastCard.isUpturned) {
                continue;
            }
            for (let foundationIndex = 0; foundationIndex < 4; foundationIndex++) {
                if (canMoveToFoundation([pileLastCard], foundations[foundationIndex])) {
                    const from: PilePlace = {
                        type: 'pile',
                        index: index as PilePlace['index'],
                    };

                    const to: FoundationPlace = {
                        type: 'foundation',
                        index: foundationIndex as FoundationPlace['index'],
                    };
                    dispatch(moveCards({cards: [pileLastCard], from, to}));
                    return true;
                }
            }
        }

        return movedFromPiles;
    };

    return doAutoMove;
}
