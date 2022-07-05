import React from "react";
import { useMediaQuery } from "@mui/material";
import { mobileQuery } from "../mediaQueries";
import {ICard} from "../store/deck/types";
import {getShortName} from "../store/deck/utils";
import MobileCardContent from "./MobileCardContent";

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

    const isMobile = useMediaQuery(mobileQuery);

    let CardImage: string;
    let cardContent: React.ReactElement;
    if (card.isUpturned) {
        if (isMobile) {
            cardContent = <MobileCardContent card={card} />;
        } else {
            CardImage = svgs[cardShortName];
            cardContent = <CardImage />;
        }
    } else {
        CardImage = svgs['1B'];
        cardContent = <CardImage />;
    }

    return (
        <div className="card">
            {cardContent}
        </div>

    );
};

export default React.memo(Card);