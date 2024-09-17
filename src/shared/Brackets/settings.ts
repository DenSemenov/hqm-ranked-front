import { ComputedOptions, Options } from './types';

export const defaultStyle: Options = {
    width: 300,
    boxHeight: 66,
    canvasPadding: 0,
    spaceBetweenColumns: 36,
    spaceBetweenRows: 8,
    connectorColor: '#858585',
    connectorColorHighlight: '#DDD',
    roundHeader: {
        isShown: true,
        height: 36,
        marginBottom: 25,
        fontSize: 14,
        fontColor: 'white',
        backgroundColor: 'rgba(20, 20, 20, 0.45)',
        fontFamily: '"Roboto", "Arial", "Helvetica", "sans-serif"',
        roundTextGenerator: undefined,
    },
    roundSeparatorWidth: 8,
    lineInfo: {
        separation: -13,
        homeVisitorSpread: 0.5,
    },
    horizontalOffset: 13,
    wonBywalkOverText: 'WO',
    lostByNoShowText: 'NS',
};

export const getCalculatedStyles = (style = defaultStyle): ComputedOptions => {
    const { boxHeight, width, spaceBetweenColumns, spaceBetweenRows } = style;
    const columnWidth = (width ?? 0) + (spaceBetweenColumns ?? 0);
    const rowHeight = (boxHeight ?? 0) + (spaceBetweenRows ?? 0);
    return { ...style, rowHeight, columnWidth };
};
