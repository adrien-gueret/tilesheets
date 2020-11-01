import Timer, { Counter } from '../interfaces/Timer';
import Tilesheet from './Tilesheet';

function cloneDeepArrays<T>(arraysToClone: Array<T[]>): Array<T[]> {
    return arraysToClone.map(arr => arr.slice());
}

type TileNumber = number;

class Scene {
    protected initialTiles: Array<Array<TileNumber>>;
    protected tiles: Array<Array<TileNumber>>;
    protected tilesheet: Tilesheet|null = null;
    protected canvas: HTMLCanvasElement|null;
    protected timer: Timer;
    protected animationClocks: Array<Counter> = [];

    constructor(tiles: Array<Array<TileNumber>> = [], canvas: HTMLCanvasElement|null = null, timer: Timer = window) {
        this.initialTiles = cloneDeepArrays(tiles);
        this.tiles = cloneDeepArrays(tiles);
        this.canvas = canvas;
        this.timer = timer;
    }

    getWidth(): number {
        if (!this.tilesheet) {
            return 0;
        }

        const { width } = this.tilesheet.getTileSize();
        const maxLength = Math.max(...this.tiles.map(row => row.length));
        return width * maxLength;
    }

    getHeight(): number {
        if (!this.tilesheet) {
            return 0;
        }

        const { height } = this.tilesheet.getTileSize();
        return this.tiles.length * height;
    }

    getCanvas(): HTMLCanvasElement|null {
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
        canvas: HTMLCanvasElement|null = this.canvas,
        deltaX: number = 0,
        deltaY: number = 0
    ): this {
        if (!canvas || !this.tilesheet) {
            return this;
        }

        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        const tileIndex = this.tiles[rowIndex][columnIndex] as number;

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

    render(canvas: HTMLCanvasElement|null = this.canvas, x: number = 0, y: number = 0): this {
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

    getTiles(): Array<Array<number>> {
        return this.tiles;
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

        if (!this.tilesheet) {
            return this;
        }
        
        this.animationClocks = this.tilesheet.getAnimations().map((animation) => {
            let tileIndex = 0;

            if (!animation.speed) {
                return;
            }

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
        this.animationClocks = [];
        return this;
    }

    useTilesheet(tilesheet: Tilesheet): this {
        this.tilesheet = tilesheet;

        this.resizeCanvas();
        this.playAnimations();

        return this;
    }

    getTilesheet(): Tilesheet|null {
        return this.tilesheet;
    }
}

export default Scene;