import { Sprite } from '../../';

export default (sheetSpring) => {
    const flowers = new Sprite(document.getElementById('canvas_sprite_animated') as HTMLCanvasElement);
    
    flowers
        .useTilesheet(sheetSpring)
        .playAnimation('flower')
        .render();

    const advancedSprite = new Sprite(document.getElementById('canvas_sprite_animated_advanced') as HTMLCanvasElement);
    advancedSprite.useTilesheet(sheetSpring);

    let activeButton: HTMLButtonElement;

    function switchAnimation(newAnimation) {
        const possibleAnimations = ['water', 'flower'];

        activeButton = document.querySelector(`[data-animation="${newAnimation}"]`);
        activeButton.disabled = true;
        activeButton.classList.add('is-outlined');
    
        if (possibleAnimations.indexOf(newAnimation) >= 0) {
            advancedSprite.playAnimation(newAnimation).render();
        } else {
            advancedSprite.stopAnimation();
        }
    }

    document.body.addEventListener('click', (e) => {
        const target = e.target as HTMLButtonElement;

        if (!target.dataset.animation) {
            return;
        }

        activeButton.disabled = false;
        activeButton.classList.remove('is-outlined');

        switchAnimation(target.dataset.animation);
       
        e.preventDefault();
    });

    switchAnimation('flower');
};