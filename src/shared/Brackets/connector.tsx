import { getCalculatedStyles } from "./settings";

const Connector = ({
    bracketSnippet,
    previousBottomMatchPosition = null,
    previousTopMatchPosition = null,
    currentMatchPosition,
    style,
}: any) => {
    const {
        boxHeight,
        connectorColor,
        roundHeader,
        roundSeparatorWidth,
        lineInfo,
        horizontalOffset,
        connectorColorHighlight,
        width,
    } = getCalculatedStyles(style);

    const pathInfo = (multiplier: any) => {
        const middlePointOfMatchComponent = (boxHeight ?? 0) / 2;
        const previousMatch =
            multiplier > 0 ? previousBottomMatchPosition : previousTopMatchPosition;
        const startPoint = `${currentMatchPosition.x - (horizontalOffset ?? 0) - (lineInfo?.separation ?? 0)
            } ${currentMatchPosition.y +
            (lineInfo?.homeVisitorSpread ?? 0) * multiplier +
            middlePointOfMatchComponent +
            (roundHeader?.isShown ? (roundHeader.height ?? 0) + (roundHeader.marginBottom ?? 0) : 0)
            }`;
        const horizontalWidthLeft =
            currentMatchPosition.x - (roundSeparatorWidth ?? 0) / 2 - (horizontalOffset ?? 0);
        const isPreviousMatchOnSameYLevel =
            Math.abs(currentMatchPosition.y - previousMatch.y) < 1;

        const verticalHeight =
            previousMatch.y +
            middlePointOfMatchComponent +
            (roundHeader?.isShown ? (roundHeader.height ?? 0) + (roundHeader.marginBottom ?? 0) : 0);
        const horizontalWidthRight = previousMatch.x + width;

        if (isPreviousMatchOnSameYLevel) {
            return [`M${startPoint}`, `H${horizontalWidthRight}`];
        }

        return [
            `M${startPoint}`,
            `H${horizontalWidthLeft}`,
            `V${verticalHeight}`,
            `H${horizontalWidthRight}`,
        ];
    };

    const { x, y } = currentMatchPosition;
    return (
        <>
            {bracketSnippet.previousTopMatch && (
                <path
                    d={pathInfo(-1).join(' ')}
                    id={`connector-${x}-${y}-${-1}`}
                    fill="transparent"
                    stroke={connectorColor}
                />
            )}
            {bracketSnippet.previousBottomMatch && (
                <path
                    d={pathInfo(1).join(' ')}
                    id={`connector-${x}-${y}-${1}`}
                    fill="transparent"
                    stroke={connectorColor}
                />
            )}
        </>
    );
};
export default Connector;