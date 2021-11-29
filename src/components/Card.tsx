import React from "react";
import {ICard} from "../store/deck/types";
import {getShortName} from "../store/deck/utils";

interface Props {
    card: ICard;
}

const Card: React.FC<Props> = ({card}) => {
    const cardShortName = getShortName(card);
    const cardImage = card.isUpturned ?
        require(`../assets/images/cards/${cardShortName}.svg`).default :
        require('../assets/images/cards/1B.svg').default;

    return (
        <img src={cardImage} className="card" alt=""/>
    );
};

export default Card;