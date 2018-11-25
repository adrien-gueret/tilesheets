import Tilesheet from './Tilesheet';

function cloneDeepArrays(arraysToClone) {
    return arraysToClone.map(arr => arr.slice());
}

class Scene {
    private initialTiles: Array<Array<number>>;
    private tiles: Array<Array<number>>;
    private tilesheet: Tilesheet;
    private canvas: HTMLCanvasElement;
    private animationClocks: Array<number> = [];

    constructor(tiles: Array<Array<number>> = [], canvas: HTMLCanvasElement = null) {
        this.initialTiles = cloneDeepArrays(tiles);
        this.tiles = cloneDeepArrays(tiles);
        this.canvas = canvas;
    }

    getWidth(): number {
        const { width } = this.tilesheet.getTileSize();
        const maxLength = Math.max(...this.tiles.map(row => row.length));
        return width * maxLength;
    }

    getHeight(): number {
        const { height } = this.tilesheet.getTileSize();
        return this.tiles.length * height;
    }

    getCanvas(): HTMLCanvasElement {
        return this.canvas;
    }

    setCanvas(canvas: HTMLCanvasElement): this {
        this.canvas = canvas;
        this.resizeCanvas();
        return this;
    }

    resizeCanvas(): this {
        if(this.canvas && this.tilesheet) {
            this.canvas.width = this.getWidth();
            this.canvas.height = this.getHeight();
        }
        
        return this;
    }

    setTile(x: number, y: number, newTile: number): this {
        this.tiles[y][x] = newTile;
        return this;
    }

    renderTile(
        columnIndex: number,
        rowIndex: number,
        canvas: HTMLCanvasElement = this.canvas,
        deltaX: number = 0,
        deltaY: number = 0
    ): this {
        const ctx = canvas.getContext('2d');
        const tileIndex = this.tiles[rowIndex][columnIndex];

        const { x, y, width, height } = this.tilesheet.getTileRect(tileIndex);

        ctx.drawImage(
            this.tilesheet.getImage(),
            x,
            y,
            width,
            height,
            columnIndex * width + deltaX,
            rowIndex * height + deltaY,
            width,
            height,
        );

        return this;
    }

    render(canvas: HTMLCanvasElement = this.canvas, x: number = 0, y: number = 0): this {
        if (!this.tilesheet) {
            throw new Error('Scene::render: tilesheet is not defined.');
        }

        if (!canvas) {
            throw new Error('Scene::render: no canvas provided.');
        }

        this.canvas = canvas;

        this.tiles.forEach((rowTiles, rowIndex) => {
            rowTiles.forEach((tileIndex, columnIndex) => {
                this.renderTile(columnIndex, rowIndex, canvas, x, y);
            });
        });

        return this;
    }

    resetTiles(): this {
        this.tiles = cloneDeepArrays(this.initialTiles);
        return this;
    }

    updateTilesFromArray(tiles: Array<number>, currentTileIndex: number): number {
        let nextTileIndex = currentTileIndex + 1;

        if (!tiles[nextTileIndex]) {
            nextTileIndex = 0;
        }
        
        this.tiles.forEach((rowTiles, rowIndex) => {
            rowTiles.forEach((tileIndex, columnIndex) => {
                if (tileIndex !== tiles[currentTileIndex]) {
                    return;
                }

                const newTile = tiles[nextTileIndex]
                this.setTile(columnIndex, rowIndex, newTile);

                if (this.canvas) {
                    this.renderTile(columnIndex, rowIndex);
                }
            });
        });

        return nextTileIndex;
    }

    playAnimations(): this {
        this.stopAnimations();
        
        this.animationClocks = this.tilesheet.getAnimations().map((animation) => {
            let tileIndex = 0;

            return window.setInterval(() => {
                tileIndex = this.updateTilesFromArray(animation.tiles, tileIndex);
            }, animation.speed);
        });

        return this;
    }

    stopAnimations(): this {
        this.animationClocks.forEach((clock) => {
            window.clearInterval(clock);
        });
        return this;
    }

    useTilesheet(tilesheet: Tilesheet): this {
        this.tilesheet = tilesheet;

        this.resizeCanvas();
        this.playAnimations();

        return this;
    }
}

export default Scene;