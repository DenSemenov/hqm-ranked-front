import React from 'react';
import { Match } from './types';
import { getPreviousMatches, sortAlphanumerically } from './match-functions';
import { defaultStyle, getCalculatedStyles } from './settings';
import RoundHeader from './RoundHeader';
import Connector from './connector';
import MatchWrapper from './match-wrapper';
import { calculateSVGDimensions } from './calculate-svg-dimensions';
import Connectors from './connectors';
import { calculatePositionOfMatch } from './calculate-match-position';

const SingleEliminationBracket = ({
    matches,
    matchComponent,
}: any) => {
    const style = defaultStyle;

    const { roundHeader, columnWidth, canvasPadding, rowHeight, width } =
        getCalculatedStyles(style);

    const lastGame = matches.find((match: any) => !match.nextMatchId);

    const generateColumn = (matchesColumn: Match[]): Match[][] => {
        const previousMatchesColumn = matchesColumn.reduce<Match[]>(
            (result, match) => {
                return [
                    ...result,
                    ...matches
                        .filter((m: any) => m.nextMatchId === match.id)
                        .sort((a: any, b: any) => sortAlphanumerically(a.name, b.name)),
                ];
            },
            []
        );

        if (previousMatchesColumn.length > 0) {
            return [...generateColumn(previousMatchesColumn), previousMatchesColumn];
        }
        return [previousMatchesColumn];
    };
    const generate2DBracketArray = (final: Match) => {
        return final
            ? [...generateColumn([final]), [final]].filter(arr => arr.length > 0)
            : [];
    };
    const columns = generate2DBracketArray(lastGame);
    // [
    //   [ First column ]
    //   [ 2nd column ]
    //   [ 3rd column ]
    //   [ lastGame ]
    // ]

    const { gameWidth, gameHeight, startPosition } = calculateSVGDimensions(
        columns[1].length * 2,
        columns.length,
        rowHeight,
        columnWidth,
        canvasPadding,
        roundHeader,
        ""
    );

    return (
        <svg
            height={gameHeight}
            width={gameWidth}
            viewBox={`0 0 ${gameWidth} ${gameHeight}`}
        >
            <g>
                {columns.map((matchesColumn, columnIndex) =>
                    matchesColumn.map((match, rowIndex) => {
                        const { x, y } = calculatePositionOfMatch(
                            rowIndex,
                            columnIndex,
                            {
                                canvasPadding,
                                columnWidth,
                                rowHeight,
                            }
                        );
                        const previousBottomPosition = (rowIndex + 1) * 2 - 1;

                        const { previousTopMatch, previousBottomMatch } =
                            getPreviousMatches(
                                columnIndex,
                                columns,
                                previousBottomPosition
                            );
                        return (
                            <g key={x + y}>
                                {roundHeader?.isShown && (
                                    <RoundHeader
                                        x={x}
                                        roundHeader={roundHeader}
                                        canvasPadding={canvasPadding ?? 0}
                                        width={width ?? 0}
                                        numOfRounds={columns.length}
                                        tournamentRoundText={match.tournamentRoundText ?? ""}
                                        columnIndex={columnIndex}
                                    />
                                )}
                                {columnIndex !== 0 && (
                                    <Connectors
                                        {...{
                                            bracketSnippet: {
                                                currentMatch: match,
                                                previousTopMatch,
                                                previousBottomMatch,
                                            },
                                            rowIndex,
                                            columnIndex,
                                            gameHeight,
                                            gameWidth,
                                            style,
                                        }}
                                    />
                                )}
                                <g>
                                    <MatchWrapper
                                        x={x}
                                        y={
                                            y +
                                            (roundHeader?.isShown
                                                ? (roundHeader.height ?? 0) + (roundHeader.marginBottom ?? 0)
                                                : 0)
                                        }
                                        rowIndex={rowIndex}
                                        columnIndex={columnIndex}
                                        match={match}
                                        previousBottomMatch={previousBottomMatch}
                                        topText={match.startTime}
                                        bottomText={match.name}
                                        teams={match.participants}
                                        style={style}
                                        matchComponent={matchComponent}
                                    />
                                </g>
                            </g>
                        );
                    })
                )}
            </g>
        </svg>
    );
};

export default SingleEliminationBracket;
