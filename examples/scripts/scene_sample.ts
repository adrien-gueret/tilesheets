import { Scene } from '../../';

export default (sheetSpring, sheetWinter) => {
    const tiles = [
        [21, 22, 23, 24,  9],
        [28, 29, 30, 31,  9],
        [22,  5,  3,  6, 10],
        [29,  5, 17, 17, 18],
    ];

    const springSceneCanvas = document.getElementById('scene_sample') as HTMLCanvasElement;
    const mySpringScene = new Scene(tiles, springSceneCanvas);

    mySpringScene
        .useTilesheet(sheetSpring)
        .render();

    const winterSceneCanvas = document.getElementById('scene_sample_winter') as HTMLCanvasElement;
    const myWinterScene = new Scene(tiles, winterSceneCanvas);

    myWinterScene
        .useTilesheet(sheetWinter)
        .render();

    const tilesWithSomeAnimation = [
        [ 1,  1,  1,  1,  1],
        [17, 17, 17, 17, 17],
        [36, 36, 36, 36, 36],
        [38, 38, 38, 38, 38],
    ];

    const animatedSceneCanvas = document.getElementById('scene_sample_animation') as HTMLCanvasElement;
    const myAnimatedScene = new Scene(tilesWithSomeAnimation, animatedSceneCanvas);

    myAnimatedScene
        .useTilesheet(sheetSpring)
        .render();
};