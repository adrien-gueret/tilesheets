import Timer, { Counter } from '../interfaces/Timer';
import Palette from './Palette';
import Tilesheet from './Tilesheet';

export default class Sprite {
    private palette: Palette = null;
    private tilesheet: Tilesheet;
    private canvas: HTMLCanvasElement;
    private currentTileIndex: number = 0;
    private timer: Timer;
    private animationClock: Counter;

    constructor(canvas: HTMLCanvasElement = null, timer = window) {
        this.canvas = canvas;
        this.timer = timer;
    }

    setCanvas(canvas: HTMLCanvasElement): this {
        this.canvas = canvas;
        return this;
    }

    setCurrentTile(tileIndex: number): this {
        this.currentTileIndex = tileIndex;
        return this;
    }

    stopAnimation(): this {
        this.timer.clearInterval(this.animationClock);
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

    render(canvas: HTMLCanvasElement = this.canvas, destX: number = 0, destY: number = 0): this {
        const { x, y, width, height } = this.tilesheet.getTileRect(this.currentTileIndex);

        if (canvas === this.canvas) {
            canvas.width = width;
            canvas.height = height;
        }

        const ctx = canvas.getContext('2d');

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
}