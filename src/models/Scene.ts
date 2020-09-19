import Timer, { Counter } from '../interfaces/Timer';
import Tilesheet from './Tilesheet';

function cloneDeepArrays(arraysToClone) {
    return arraysToClone.map(arr => arr.slice());
}

type TileNumber = number|null;

class Scene {
    protected initialTiles: Array<Array<TileNumber>>;
    protected tiles: Array<Array<TileNumber>>;
    protected tilesheet: Tilesheet;
    protected canvas: HTMLCanvasElement;
    protected timer: Timer;
    protected animationClocks: Array<Counter> = [];

    constructor(tiles: Array<Array<TileNumber>> = [], canvas: HTMLCanvasElement = null, timer: Timer = window) {
        this.initialTiles = cloneDeepArrays(tiles);
        this.tiles = cloneDeepArrays(tiles);
        this.canvas = canvas;
        this.timer = timer;
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

    setTile(x: number, y: number, newTile: TileNumber): this {
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

        const destX = columnIndex * width + deltaX;
        const destY = rowIndex * height + deltaY;

        if (tileIndex === null) {
            ctx.clearRect(destX, destY, width, height);
            return this;
        }

        ctx.drawImage(this.tilesheet.getImage(), x, y, width, height, destX, destY, width, height);

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

    updateTilesFromArray(tiles: Array<TileNumber>, currentTileIndex: number, deltaX: number = 0, deltaY: number = 0): number {
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
                    this.renderTile(columnIndex, rowIndex, this.canvas, deltaX, deltaY);
                }
            });
        });

        return nextTileIndex;
    }

    playAnimations(x: number = 0, y: number = 0): this {
        this.stopAnimations();
        
        this.animationClocks = this.tilesheet.getAnimations().map((animation) => {
            let tileIndex = 0;

            return this.timer.setInterval(() => {
                tileIndex = this.updateTilesFromArray(animation.tiles, tileIndex, x, y);
            }, animation.speed);
        });

        return this;
    }

    stopAnimations(): this {
        this.animationClocks.forEach((clock) => {
            this.timer.clearInterval(clock);
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