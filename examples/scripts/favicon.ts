import { Sprite } from '../../';

export default (sheetSpring) => {
    const canvas = document.createElement('canvas');
    const flowers = new Sprite(canvas);

    const link = document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';

    document.getElementsByTagName('head')[0].appendChild(link);
    
    flowers
        .useTilesheet(sheetSpring)
        .playAnimation('flower')
        .render();

    window.setInterval(() => {
        link.href = canvas.toDataURL();
    }, 300);
};