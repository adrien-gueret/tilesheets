import Timer, { Counter } from '../interfaces/Timer';
import Palette from './Palette';
import Tilesheet from './Tilesheet';

export default class Sprite {
    protected palette?: Palette;
    protected tilesheet: Tilesheet|null = null;
    protected canvas: HTMLCanvasElement|null;
    protected currentTileIndex: number = 0;
    protected timer: Timer;
    protected animationClock: Counter|null = null;

    constructor(canvas: HTMLCanvasElement|null = null, timer: Timer = window) {
        this.canvas = canvas;
        this.timer = timer;
    }

    setCanvas(canvas: HTMLCanvasElement): this {
        this.canvas = canvas;
        return this;
    }

    setTimer(timer: Timer): this {
        this.timer = timer;
        return this;
    }

    getCurrentTile(): number {
        return this.currentTileIndex;
    }

    setCurrentTile(tileIndex: number): this {
        this.currentTileIndex = tileIndex;
        return this;
    }

    stopAnimation(): this {
        if (this.animationClock) {
            this.timer.clearInterval(this.animationClock);
        }
        
        return this;
    }

    updateTilesFromArray(
        tiles: Array<number>,
        currentTileIndex: number,
        shouldLoop: boolean = false,
        /* istanbul ignore next */
        onUpdate: Function = () => {},
        /* istanbul ignore next */
        onEnd: Function = () => {},
        shouldRender: boolean = true
    ): number {
        let nextTileIndex = currentTileIndex + 1;

        if (!tiles[nextTileIndex]) {
            nextTileIndex = 0;

            if (!shouldLoop) {
                onEnd();
                this.stopAnimation();
                return nextTileIndex;
            }
        }

        const newTile = tiles[nextTileIndex];
        onUpdate(newTile);
        
        this.setCurrentTile(newTile);
        
        if (shouldRender) {
            this.render();
        }

        return nextTileIndex;
    }

    playAnimation(
        name: string,
        shouldLoop: boolean = true,
        /* istanbul ignore next */
        onUpdate: Function = () => {},
        /* istanbul ignore next */
        onEnd: Function = () => {},
        shouldRender: boolean = true
    ): this {
        if (!this.tilesheet) {
            throw new Error(`Sprite::playAnimation: this sprite does not have any tilesheet`);
        }

        const animation = this.tilesheet.getAnimation(name);

        if (!animation) {
            throw new Error(`Sprite::playAnimation: animation "${name}" not found`);
        }

        this.stopAnimation();

        let currentAnimationIndex = 0;

        const firstTile = animation.tiles[currentAnimationIndex];
        onUpdate(firstTile);

        this.setCurrentTile(firstTile);

        if (shouldRender) {
            this.render();
        }

        if (animation.tiles.length === 1 || !animation.speed) {
            return this;
        }

        this.animationClock = this.timer.setInterval(() => {
            currentAnimationIndex = this.updateTilesFromArray(
                animation.tiles,
                currentAnimationIndex,
                shouldLoop,
                onUpdate,
                onEnd,
                shouldRender,
            );
        }, animation.speed);

        return this;
    }

    render(canvas: HTMLCanvasElement|null = this.canvas, destX: number = 0, destY: number = 0): this {
        if (!this.tilesheet) {
            throw new Error(`Sprite::render: this sprite does not have any tilesheet`);
        }

        if (!canvas) {
            throw new Error(`Sprite::render: this sprite does not have any canvas`);
        }

        const { x, y, width, height } = this.tilesheet.getTileRect(this.currentTileIndex);

        if (canvas === this.canvas) {
            canvas.width = width;
            canvas.height = height;
        }

        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

        ctx.drawImage(
            this.tilesheet.getImage(this.palette),
            x,
            y,
            width,
            height,
            destX,
            destY,
            width,
            height,
        );

        return this;
    }

    usePalette(palette?: Palette): this {
        this.palette = palette;
        return this;
    }

    useTilesheet(tilesheet: Tilesheet): this {
        this.tilesheet = tilesheet;
        this.stopAnimation();
        return this;
    }

    getTilesheet(): Tilesheet|null {
        return this.tilesheet;
    }
}