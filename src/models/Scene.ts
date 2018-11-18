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

    setCanvas(canvas: HTMLCanvasElement): this {
        this.canvas = canvas;
        return this;
    }

    setTile(x: number, y: number, newTile: number): this {
        this.tiles[y][x] = newTile;
        this.renderTile(x, y);
        return this;
    }

    renderTile(columnIndex: number, rowIndex: number, canvas: HTMLCanvasElement = this.canvas): this {
        const ctx = canvas.getContext('2d');
        const tileIndex = this.tiles[rowIndex][columnIndex];

        const { x, y, width, height } = this.tilesheet.getTileRect(tileIndex);

        ctx.drawImage(
            this.tilesheet.getImage(),
            x,
            y,
            width,
            height,
            columnIndex * width,
            rowIndex * height,
            width,
            height,
        );

        return this;
    }

    render(canvas: HTMLCanvasElement = this.canvas): this {
        if (!this.tilesheet) {
            throw new Error('Scene::render: tilesheet is not defined.');
        }

        if (!canvas) {
            throw new Error('Scene::render: no canvas provided.');
        }

        canvas.width = this.getWidth();
        canvas.height = this.getHeight();

        this.tiles.forEach((rowTiles, rowIndex) => {
            rowTiles.forEach((tileIndex, columnIndex) => {
                this.renderTile(columnIndex, rowIndex, canvas);
            });
        });

        return this;
    }

    resetTiles(): this {
        this.tiles = cloneDeepArrays(this.initialTiles);
        return this;
    }

    useTilesheet(tilesheet: Tilesheet): this {
        this.tilesheet = tilesheet;

        if (this.canvas) {
            this.render();
        }

        this.animationClocks.forEach((clock) => {
            window.clearInterval(clock);
        });
        this.animationClocks = [];

        this.tilesheet.getAnimations().forEach((animation) => {
            let animationIndex = 0;

            const clock = window.setInterval(() => {
                let nextAnimationIndex = animationIndex + 1;

                if (!animation.tiles[nextAnimationIndex]) {
                    nextAnimationIndex = 0;
                }
                
                this.tiles.forEach((rowTiles, rowIndex) => {
                    rowTiles.forEach((tileIndex, columnIndex) => {
                        if (tileIndex === animation.tiles[animationIndex]) {
                            const newTile = animation.tiles[nextAnimationIndex]
                            this.setTile(columnIndex, rowIndex, newTile);
                        }
                    });
                });
                
                animationIndex = nextAnimationIndex;
            }, animation.speed);

            this.animationClocks.push(clock);
        });
    
        return this;
    }
}

export default Scene;