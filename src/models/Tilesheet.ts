import Animation from '../interfaces/Animation';
import Rectangle from '../interfaces/Rectangle';

class Tilesheet {
    private image: HTMLImageElement;
    private tileWidth: number = 16;
    private tileHeight: number = 16;
    private margin: number = 1;
    private animations: Array<Animation> = [];

    constructor(imagePath: string) {
        this.image = new Image();
        this.image.src = imagePath;
    }

    getAnimations(): Array<Animation> {
        return this.animations;
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

    getImage(): HTMLImageElement {
        return this.image;
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

    getTileStyle(tileIndex: number): Partial<CSSStyleDeclaration> {
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
            domElement.style[styleProp] = tileStyle[styleProp];
        });

        return domElement;
    }

    async waitForLoading() {
        if (this.image.complete) {
            return;
        }

        return new Promise((resolve, reject) => {
            this.image.onload = resolve;
            this.image.onerror = reject;
        });
    }
}

export default Tilesheet;