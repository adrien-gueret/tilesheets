import { Tilesheet } from '../';

import tilesheetBushSample from './scripts/tilesheet_bush';
import tilesheetIndexSample from './scripts/tilesheet_index_sample';
import tilesheetAdvanced from './scripts/tilesheet_advanced';
import sceneSample from './scripts/scene_sample';
import spriteAnimated from './scripts/sprite_animated';

import imageSpring from './images/spring.png';
import imageSummer from './images/summer.png';
import imageFall from './images/fall.png';
import imageWinter from './images/winter.png';

(async () => {
    const sheetSpring = new Tilesheet(imageSpring);
    const sheetSummer = new Tilesheet(imageSummer);
    const sheetFall = new Tilesheet(imageFall);
    const sheetWinter = new Tilesheet(imageWinter);

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

    sheetSpring.setAnimations([waterAnimation, driedWater1Animation, driedWater2Animation, frozenWaterAnimation, flowersAnimation]);
    sheetSummer.setAnimations([waterAnimation, frozenWaterAnimation, flowersAnimation]);
    sheetFall.setAnimations([waterAnimation, driedWater1Animation, driedWater2Animation, frozenWaterAnimation]);
    sheetWinter.setAnimations([waterAnimation, driedWater1Animation, driedWater2Animation]);
    
    const allSheets = [sheetSpring, sheetSummer, sheetFall, sheetWinter];
    
    allSheets.forEach((sheet) => {
        sheet.setTileSize(16).setMargin(1);
    });
    
    await Promise.all(allSheets.map(sheet => sheet.waitForLoading()));

    tilesheetIndexSample(sheetSpring);
    tilesheetBushSample(sheetSpring, sheetFall);
    spriteAnimated(sheetSpring);
    sceneSample(sheetSpring, sheetWinter);
    tilesheetAdvanced(sheetSpring, sheetSummer, sheetFall, sheetWinter);    
})();