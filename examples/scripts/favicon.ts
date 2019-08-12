import { Sprite } from '../../';

export default (sheet, palettes) => {
    const faviconCanvas = document.createElement('canvas');
    faviconCanvas.width = 16;
    faviconCanvas.height = 16;
    const faviconCtx = faviconCanvas.getContext('2d');

    const canvas = document.createElement('canvas');
    const sprite = new Sprite(canvas);

    const link = document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';

    document.getElementsByTagName('head')[0].appendChild(link);

    document.body.addEventListener('click', (e) => {
        const target = e.target as HTMLButtonElement;

        if (!target.dataset.palette) {
            return;
        }

        sprite.usePalette(palettes[target.dataset.palette]).render();
        renderFavicon();
       
        e.preventDefault();
    });

    function renderFavicon() {
        faviconCtx.clearRect(0, 0, 16, 16);
        faviconCtx.drawImage(canvas, 0, 0);
        link.href = faviconCanvas.toDataURL();
    }

    sprite
        .useTilesheet(sheet)
        .usePalette(palettes[1])
        .playAnimation('hourray');

    window.setInterval(renderFavicon, 300);
    renderFavicon();
};