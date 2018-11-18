import { Scene } from '../../';

export default (sheetSpring, sheetSummer, sheetFall, sheetWinter) => {
    const scene = new Scene([
        [28, 29, 28, 29, 21, 22, 28, 29, 21, 22, 21, 22, 28, 29,  0,  0, 11, 42, 47, 47],
        [ 8, 25, 26, 27, 28, 29,  5,  5, 28, 29, 28, 29,  5,  5,  5,  6,  5, 42, 47, 47],
        [ 4, 32, 33, 34, 21, 22,  8,  8,  2,  3,  4, 21, 22, 17, 13,  5,  5, 42, 47, 47],
        [17, 14, 14, 14, 28, 29,  8,  8,  9, 10,  7, 28, 29, 36, 36, 36, 36, 51, 47, 47],
        [21, 22, 23, 24, 13, 13,  3,  3, 10, 10,  0, 11, 42, 38, 38, 38, 47, 47, 47, 47],
        [28, 29, 30, 31, 13, 21, 22,  6,  1, 10,  0, 11, 42, 38, 38, 38, 47, 47, 47, 47],
        [22,  2,  3,  3,  7, 28, 29,  6,  1,  7,  7, 18, 42, 45, 46, 45, 35, 50, 50, 50],
        [29, 16,  7,  7,  0,  1,  1, 21, 22, 21, 22,  8, 42, 45, 45, 46, 44,  8,  8,  8],
        [21, 22,  9,  0,  0,  0,  7, 28, 29, 28, 29, 21, 22, 50, 50, 50,  8,  2,  3,  3],
    ], document.getElementById('canvas_advanced') as HTMLCanvasElement);

    let activeButton: HTMLButtonElement;

    function switchSeason(season) {
        const seasonToTilesheet = {
            spring: sheetSpring,
            summer: sheetSummer,
            fall: sheetFall,
            winter: sheetWinter,
        };

        activeButton = document.querySelector(`[data-season="${season}"]`);
        activeButton.disabled = true;
        activeButton.classList.add('is-outlined');

        scene
            .resetTiles()
            .useTilesheet(seasonToTilesheet[season])
            .render();
    }

    document.body.onclick = (e) => {
        const target = e.target as HTMLButtonElement;

        if (!target.dataset.season) {
            return;
        }

        activeButton.disabled = false;
        activeButton.classList.remove('is-outlined');

        switchSeason(target.dataset.season);
       
        e.preventDefault();
    };

    switchSeason('spring');
};