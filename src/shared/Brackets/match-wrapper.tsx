import React, { useContext } from 'react';
import { sortTeamsSeedOrder } from './match-functions';
import { defaultStyle, getCalculatedStyles } from './settings';

function Match({
    rowIndex,
    columnIndex,
    match,

    previousBottomMatch = null,
    teams,
    topText,
    bottomText,
    style = defaultStyle,
    matchComponent: MatchComponent,
    onMatchClick,
    onPartyClick,
    ...rest
}: any) {
    const computedStyles = getCalculatedStyles(style);
    const { width = 300, boxHeight = 70, connectorColor } = computedStyles;
    const sortedTeams = teams.sort(sortTeamsSeedOrder(previousBottomMatch));

    return (
        <svg
            width={width}
            height={boxHeight}
            viewBox={`0 0 ${width} ${boxHeight}`}
            {...rest}
        >
            <foreignObject x={0} y={0} width={width} height={boxHeight}>
                {/* TODO: Add OnClick Match handler */}
                {MatchComponent && (
                    <MatchComponent
                        {...{
                            match,
                            onMatchClick,
                            onPartyClick,
                            topText,
                            bottomText,
                            connectorColor,
                            computedStyles,
                        }}
                    />
                )}
            </foreignObject>
        </svg>
    );
}

export default Match;