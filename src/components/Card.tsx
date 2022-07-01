import React from "react";
import {ICard} from "../store/deck/types";
import {getShortName} from "../store/deck/utils";

interface Props {
    card: ICard;
}

const reqSvgs = require.context('!@svgr/webpack!../assets/images/cards', false, /\.svg$/);
const paths = reqSvgs.keys();
const svgs = paths.reduce((images: Record<string, string>, path) => {
    let match = path.match(/\.\/([\da-z]+)\.svg/i);
    if (match !== null) {
        const cardName = match[1];
        images[cardName] = reqSvgs(path).default;
    }
    return images;
}, {});

const Card: React.FC<Props> = ({card}) => {
    const cardShortName = getShortName(card);

    const CardImage = card.isUpturned ?
        svgs[cardShortName] :
        svgs['1B'];

    return (
        <div className="card">
            <CardImage/>
        </div>

    );
};

export default React.memo(Card);