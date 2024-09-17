

export const sortAlphanumerically = (a: any, b: any) => {
    const collator = new Intl.Collator(undefined, {
        numeric: true,
        sensitivity: 'base',
    });

    return collator.compare(a, b);
};

export const generatePreviousRound = (matchesColumn: any, listOfMatches: any) =>
    matchesColumn.reduce((result: any, match: any) => {
        return [
            ...result,
            ...listOfMatches
                .filter((m: any) => m.nextMatchId === match.id)
                .sort((a: any, b: any) => sortAlphanumerically(a.name, b.name)),
        ];
    }, []);

export function getPreviousMatches(
    columnIndex: number,
    columns: any[],
    previousBottomPosition: number
) {
    const previousTopMatch =
        columnIndex !== 0 && columns[columnIndex - 1][previousBottomPosition - 1];
    const previousBottomMatch =
        columnIndex !== 0 && columns[columnIndex - 1][previousBottomPosition];
    return { previousTopMatch, previousBottomMatch };
}

export function sortTeamsSeedOrder(previousBottomMatch: any): any {
    return (partyA: any, partyB: any) => {
        const partyAInBottomMatch = previousBottomMatch?.participants?.find(
            (p: any) => p.id === partyA.id
        );

        const partyBInBottomMatch = previousBottomMatch?.participants?.find(
            (p: any) => p.id === partyB.id
        );

        if (partyAInBottomMatch) {
            return 1;
        }
        if (partyBInBottomMatch) {
            return -1;
        }
        return 0;
    };
}