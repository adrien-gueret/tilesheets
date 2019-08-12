import { Tilesheet } from '../';

import favicon from './scripts/favicon';
import tilesheetBushSample from './scripts/tilesheet_bush';
import tilesheetIndexSample from './scripts/tilesheet_index_sample';
import tilesheetAdvanced from './scripts/tilesheet_advanced';
import sceneSample from './scripts/scene_sample';
import spriteAnimated from './scripts/sprite_animated';
import palettedSprite from './scripts/paletted_sprite';
import imageSpring from './images/spring.png';
import imageSummer from './images/summer.png';
import imageFall from './images/fall.png';
import imageWinter from './images/winter.png';
import imageYoshi from './images/yoshi.png';
import imageBlueYoshiPalette from './images/blue_yoshi_palette.png';
import imageGreenYoshiPalette from './images/green_yoshi_palette.png';
import imageRedYoshiPalette from './images/red_yoshi_palette.png';
import imageYellowYoshiPalette from './images/yellow_yoshi_palette.png';
import imageCustomYoshiPalette from './images/custom_yoshi_palette.png';

(async () => {
    const sheetSpring = new Tilesheet(imageSpring);
    const sheetSummer = new Tilesheet(imageSummer);
    const sheetFall = new Tilesheet(imageFall);
    const sheetWinter = new Tilesheet(imageWinter);
    const sheetYoshi = new Tilesheet(imageYoshi);
    const sheetGreenYoshiPalette = new Tilesheet(imageGreenYoshiPalette);
    const sheetYellowYoshiPalette = new Tilesheet(imageYellowYoshiPalette);
    const sheetRedYoshiPalette = new Tilesheet(imageRedYoshiPalette);
    const sheetBlueYoshiPalette = new Tilesheet(imageBlueYoshiPalette);
    const sheetCustomYoshiPalette = new Tilesheet(imageCustomYoshiPalette);

    const animationSpeed = 300;
    const waterAnimation = {
        tiles: [38, 39, 40, 41],
        speed: animationSpeed,
        name: 'water',
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
        name: 'flower',
    };
    const yoshiAnimation = {
        tiles: [0, 1],
        speed: animationSpeed,
        name: 'hourray',
    };

    sheetSpring.setAnimations([waterAnimation, driedWater1Animation, driedWater2Animation, frozenWaterAnimation, flowersAnimation]);
    sheetSummer.setAnimations([waterAnimation, frozenWaterAnimation, flowersAnimation]);
    sheetFall.setAnimations([waterAnimation, driedWater1Animation, driedWater2Animation, frozenWaterAnimation]);
    sheetWinter.setAnimations([waterAnimation, driedWater1Animation, driedWater2Animation]);
    sheetYoshi.setAnimations([yoshiAnimation]);

    const allSheets = [sheetSpring, sheetSummer, sheetFall, sheetWinter];
    const paletteSheets = [sheetGreenYoshiPalette, sheetYellowYoshiPalette, sheetRedYoshiPalette, sheetBlueYoshiPalette, sheetCustomYoshiPalette];
    
    allSheets.forEach((sheet) => {
        sheet.setTileSize(16).setMargin(1);
    });
    paletteSheets.forEach((sheet) => {
        sheet.setTileSize(5).setMargin(0);
    });
    sheetYoshi.setTileSize(25, 32).setMargin(1);
    
    allSheets.push(sheetYoshi, ...paletteSheets);

    await Promise.all(allSheets.map(sheet => sheet.waitForLoading()));
    sheetYoshi.setReferencePalette(sheetGreenYoshiPalette.getReferencePalette());

    const yoshiPalettes = paletteSheets.map(palette => palette.getReferencePalette());

    favicon(sheetYoshi, yoshiPalettes);
    tilesheetIndexSample(sheetSpring);
    tilesheetBushSample(sheetSpring, sheetFall);
    spriteAnimated(sheetSpring);
    palettedSprite(sheetYoshi, yoshiPalettes);
    sceneSample(sheetSpring, sheetWinter);
    tilesheetAdvanced(sheetSpring, sheetSummer, sheetFall, sheetWinter);    
})();