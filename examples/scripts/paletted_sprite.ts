import { Sprite } from '../../';

export default async (sheetYoshi, palettes) => {
    const spriteYoshiAnimated = new Sprite(document.getElementById('canvas_sprite_yoshi_animated') as HTMLCanvasElement);
    spriteYoshiAnimated.useTilesheet(sheetYoshi).playAnimation('hourray'); 
    
    const spriteYellowYoshiAnimated = new Sprite(document.getElementById('canvas_sprite_yellow_yoshi_animated') as HTMLCanvasElement);
    spriteYellowYoshiAnimated.useTilesheet(sheetYoshi).usePalette(palettes[1]).playAnimation('hourray'); 

    const palettedSprite = new Sprite(document.getElementById('canvas_paletted_sprite') as HTMLCanvasElement);
    
    let activeButton: HTMLButtonElement;

    function switchPalette(newPalette) {
        activeButton = document.querySelector(`[data-palette="${newPalette}"]`);
        activeButton.disabled = true;
        activeButton.classList.add('is-outlined');
    
        palettedSprite.usePalette(palettes[newPalette]).render();
    }

    document.body.addEventListener('click', (e) => {
        const target = e.target as HTMLButtonElement;

        if (!target.dataset.palette) {
            return;
        }

        activeButton.disabled = false;
        activeButton.classList.remove('is-outlined');

        switchPalette(target.dataset.palette);
       
        e.preventDefault();
    });

    palettedSprite.useTilesheet(sheetYoshi).playAnimation('hourray'); 
    
    switchPalette(1);
};