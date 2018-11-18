import { Tilesheet, Scene } from '../';
import imageSpring from './images/spring.png';
import imageSummer from './images/summer.png';
import imageFall from './images/fall.png';
import imageWinter from './images/winter.png';

function getTree(sheet) {
    let tree = document.createElement('figure');
    tree.className = 'tree';

    let tile = sheet.getTileDomElement(23);
    tree.appendChild(tile);
    tile = sheet.getTileDomElement(24);
    tree.appendChild(tile);
    tree.appendChild(document.createElement('br'));
    tile = sheet.getTileDomElement(30);
    tree.appendChild(tile);
    tile = sheet.getTileDomElement(31);
    tree.appendChild(tile);

    return tree;
}

(async () => {
    const sheetSpring = new Tilesheet(imageSpring);
    const sheetSummer = new Tilesheet(imageSummer);
    const sheetFall = new Tilesheet(imageFall);
    const sheetWinter = new Tilesheet(imageWinter);

    const animationSpeed = 300;
    const waterAnimation = {
        tiles: [38, 39, 40, 41],
        speed: animationSpeed,
    };
    const driedWater1Animation = {
        tiles: [45, 39],
        speed: animationSpeed,
    };
    const driedWater2Animation = {
        tiles: [46, 39],
        speed: animationSpeed,
    };
    const frozenWaterAnimation = {
        tiles: [47, 39],
        speed: animationSpeed,
    };
    const flowersAnimation = {
        tiles: [1, 12, 19, 20],
        speed: animationSpeed,
    };

    sheetSpring.setAnimations([waterAnimation, driedWater1Animation, driedWater2Animation, frozenWaterAnimation, flowersAnimation]);
    sheetSummer.setAnimations([waterAnimation, frozenWaterAnimation, flowersAnimation]);
    sheetFall.setAnimations([waterAnimation, driedWater1Animation, driedWater2Animation, frozenWaterAnimation]);
    sheetWinter.setAnimations([waterAnimation, driedWater1Animation, driedWater2Animation]);
    
    const allSheets = [sheetSpring, sheetSummer, sheetFall, sheetWinter];
    
    allSheets.forEach((sheet) => {
        sheet.setTileSize(16).setMargin(1);
    });
    
    await Promise.all(allSheets.map(sheet => sheet.waitForLoading()));

    const container = document.getElementById('container');
    
    allSheets.forEach((sheet) => {
        let tree = getTree(sheet);
        // container.appendChild(tree);
    });

    /////////
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
    ], document.getElementById('canvas') as HTMLCanvasElement);

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

        scene.resetTiles();
        scene.useTilesheet(seasonToTilesheet[season]);
    }

    document.body.onclick = (e) => {
        const target = e.target as HTMLButtonElement;

        if (!target.dataset.season) {
            return;
        }

        activeButton.disabled = false;

        switchSeason(target.dataset.season);
       
        e.preventDefault();
    };

    switchSeason('spring');
})();