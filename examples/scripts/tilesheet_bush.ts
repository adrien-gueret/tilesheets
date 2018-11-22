import { Sprite } from '../../';

export default (sheetSpring, sheetFall) => {
    const bushTile = sheetSpring.getTileDomElement(5);
    document.getElementById('bush_sample').appendChild(bushTile);

    const bush = new Sprite(document.getElementById('canvas_bush_sample') as HTMLCanvasElement);
    bush
        .useTilesheet(sheetSpring)
        .setCurrentTile(5)
        .render();

    const bush2 = new Sprite(document.getElementById('canvas_bush_sample2') as HTMLCanvasElement);
    bush2
        .useTilesheet(sheetFall)
        .setCurrentTile(5)
        .render();
};