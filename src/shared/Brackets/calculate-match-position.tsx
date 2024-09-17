export const calculateVerticalStartingPoint = (columnIndex: number, height: number) =>
    2 ** columnIndex * (height / 2) - height / 2;

export const columnIncrement = (columnIndex: number, height: number) =>
    2 ** columnIndex * height;

export const calculateHeightIncrease = (columnIndex: number, rowIndex: number, height: number) =>
    columnIncrement(columnIndex, height) * rowIndex;

export const calculateVerticalPositioning = ({
    rowIndex,
    columnIndex,
    rowHeight: height,
}: any) => {
    return (
        calculateHeightIncrease(columnIndex, rowIndex, height) +
        calculateVerticalStartingPoint(columnIndex, height)
    );
};

export const calculatePositionOfMatch = (
    rowIndex: any,
    columnIndex: any,
    { canvasPadding, rowHeight, columnWidth, offsetX = 0, offsetY = 0 }: any
) => {
    const result = calculateVerticalPositioning({
        rowHeight,
        rowIndex,
        columnIndex,
    });

    return {
        x: columnIndex * columnWidth + canvasPadding + offsetX,
        y: result + canvasPadding + offsetY,
    };
};