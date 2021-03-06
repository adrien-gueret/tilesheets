import Animation from '../interfaces/Animation';
import Rectangle from '../interfaces/Rectangle';

import Palette from './Palette';

type TileCSSDeclaration = {
    display: 'inline-block';
    width: string;
    height: string;
    backgroundImage: string;
    backgroundPosition: string;
};

class Tilesheet {
    protected image: HTMLImageElement;
    protected imagePath: string;
    protected tileWidth: number = 16;
    protected tileHeight: number = 16;
    protected margin: number = 1;
    protected animations: Array<Animation> = [];
    protected referencePalette: Palette|null = null;
    protected palettedImages: Map<Palette, HTMLImageElement|HTMLCanvasElement> = new Map();

    constructor(imagePath: string, shouldAutoload: boolean = true) {
        this.image = new Image();
        this.imagePath = imagePath;
        
        if (shouldAutoload) {
            this.load();
        }
    }

    load(): this {
        this.image.src = this.imagePath;
        return this;
    }

    getAnimations(): Array<Animation> {
        return this.animations;
    }

    getAnimation(name: string): Animation {
        return this.animations.filter(animation => animation.name === name)[0];
    }

    setAnimations(animations: Array<Animation>): this {
        this.animations = animations;
        return this;
    }

    getTileSize(): { width: number, height: number } {
        return {
            width: this.tileWidth,
            height: this.tileHeight,
        };
    }

    setTileSize(width: number, height: number = width): this {
        this.tileWidth = width;
        this.tileHeight = height;
        return this;
    }

    setMargin(margin: number): this {
        this.margin = margin;
        return this;
    }

    generatePalettedImage(palette: Palette): HTMLCanvasElement {
        if (!this.image.complete) {
            throw new Error('Tilesheets::generatePalettedImage: image is not fully loaded yet.');
        }

        const referencePalette = this.getReferencePalette();
        const { canvas: palettedImage, ctx, imageData } = this.initNewCanvasWithImage();
        const pixelData = imageData.data;

        for (let i = 0, l = pixelData.length; i < l; i += 4) {
            const red = pixelData[i];
            const green = pixelData[i + 1];
            const blue = pixelData[i + 2];
            const alpha = pixelData[i + 3];

            const color = [red, green, blue, alpha] as [number, number, number, number];

            const index = referencePalette.getIndexFromColor(color);

            if (index < 0) {
                continue;
            }

            const [newRed, newGreen, newBlue, newAlpha] = palette.getColorByIndex(index);
            
            pixelData[i] = newRed;
            pixelData[i + 1] = newGreen;
            pixelData[i + 2] = newBlue;
            pixelData[i + 3] = newAlpha;
        }

        ctx.putImageData(imageData, 0, 0);

        this.palettedImages.set(palette, palettedImage);
       
        return palettedImage;
    }

    getImage(paletteToUse?: Palette): HTMLImageElement|HTMLCanvasElement {
        if (!paletteToUse) {
            return this.image;
        }

        if (!this.palettedImages.has(paletteToUse)) {
            return this.generatePalettedImage(paletteToUse);
        }
    
        return this.palettedImages.get(paletteToUse) as HTMLImageElement|HTMLCanvasElement;
    }

    getTileRect(tileIndex: number): Rectangle {
        if (!this.image.complete) {
            throw new Error('Tilesheets::getTileRect: image is not fully loaded yet.');
        }

        const { naturalWidth } = this.image;
        const totalTilesOnRow = Math.ceil(naturalWidth / (this.tileWidth + this.margin));
       
        const row = Math.floor(tileIndex / totalTilesOnRow);
        const column = tileIndex % totalTilesOnRow;

        return {
            x:  column * this.tileWidth + column * this.margin,
            y:  row * this.tileHeight + row * this.margin,
            ...this.getTileSize(),
        };
    }

    getTileStyle(tileIndex: number): TileCSSDeclaration {
        if (!this.image.complete) {
            throw new Error('Tilesheets::getTileStyle: image is not fully loaded yet.');
        }

        const rectangle = this.getTileRect(tileIndex);

        return {
            display: 'inline-block',
            width: `${rectangle.width}px`,
            height: `${rectangle.height}px`,
            backgroundImage: `url(${this.image.src})`,
            backgroundPosition: `-${rectangle.x}px -${rectangle.y}px`,
        };
    }

    getTileDomElement(tileIndex: number): HTMLSpanElement {
        if (!this.image.complete) {
            throw new Error('Tilesheets::getTileDomElement: image is not fully loaded yet.');
        }

        const domElement = document.createElement('span');
        const tileStyle = this.getTileStyle(tileIndex);

        Object.keys(tileStyle).forEach((styleProp) => {
            domElement.style[styleProp as keyof TileCSSDeclaration] = tileStyle[styleProp as keyof TileCSSDeclaration];
        });

        return domElement;
    }

    initNewCanvasWithImage(): {
        canvas: HTMLCanvasElement,
        ctx: CanvasRenderingContext2D,
        imageData: ImageData,
    } {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

        const { width, height } = this.image;

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(this.image, 0, 0, width, height);

        const imageData = ctx.getImageData(0, 0, width, height);

        return { canvas, ctx, imageData };
    }

    getReferencePalette(): Palette {
        if (!this.image.complete) {
            throw new Error('Tilesheets::getReferencePalette: image is not fully loaded yet.');
        }

        if (this.referencePalette) {
            return this.referencePalette;
        }

        const referencePalette = new Palette();
        this.setReferencePalette(referencePalette);

        const { imageData } = this.initNewCanvasWithImage();
        const pixelData = imageData.data;

        for (let i = 0, l = pixelData.length; i < l; i += 4) {
            const red = pixelData[i];
            const green = pixelData[i + 1];
            const blue = pixelData[i + 2];
            const alpha = pixelData[i + 3];

            referencePalette.addColor([red, green, blue, alpha]);
        }

        return referencePalette;
    }

    setReferencePalette(palette: Palette): this {
        this.referencePalette = palette;
        return this;
    }

    async waitForLoading() {
        if (this.image.src && this.image.complete) {
            return;
        }

        return new Promise((resolve, reject) => {
            this.image.addEventListener('load', resolve);
            this.image.addEventListener('error', reject);
        });
    }
}

export default Tilesheet;