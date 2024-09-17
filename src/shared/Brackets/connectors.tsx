
import { calculatePositionOfMatch } from "./calculate-match-position";
import Connector from "./connector";
import { getCalculatedStyles } from "./settings";

const Connectors = ({
    bracketSnippet,
    rowIndex,
    columnIndex,
    style,
    offsetY = 0,
}: any) => {

    const {
        columnWidth,

        rowHeight,
        canvasPadding,
    } = getCalculatedStyles(style);

    const currentMatchPosition = calculatePositionOfMatch(rowIndex, columnIndex, {
        canvasPadding,
        rowHeight,
        columnWidth,
        offsetY,
    });
    const previousBottomPosition = (rowIndex + 1) * 2 - 1;
    const previousTopMatchPosition = calculatePositionOfMatch(
        previousBottomPosition - 1,
        columnIndex - 1,
        {
            canvasPadding,
            rowHeight,
            columnWidth,
            offsetY,
        }
    );
    const previousBottomMatchPosition = calculatePositionOfMatch(
        previousBottomPosition,
        columnIndex - 1,
        {
            canvasPadding,
            rowHeight,
            columnWidth,
            offsetY,
        }
    );

    return (
        <>
            <Connector
                bracketSnippet={bracketSnippet}
                previousBottomMatchPosition={previousBottomMatchPosition}
                previousTopMatchPosition={previousTopMatchPosition}
                currentMatchPosition={currentMatchPosition}
                style={style}
            />
        </>
    );
};

export default Connectors;