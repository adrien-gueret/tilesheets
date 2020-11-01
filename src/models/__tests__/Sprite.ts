jest.mock('../Tilesheet.ts');

import Palette from '../Palette';
import Sprite from '../Sprite';
import Tilesheet from '../Tilesheet';

describe('Sprite', () => {
    let sprite;
    let sheet;
    let defaultSprite;
    let canvas;

    beforeEach(() => {
        canvas = document.createElement('canvas');
        sprite = new Sprite(canvas);
        defaultSprite = new Sprite();
        sheet = new Tilesheet('my-image');

        sprite.tilesheet = sheet;
    });

    describe('constructor', () => {
        it('should correctly init sprite', () => {
            expect(sprite.canvas).toEqual(canvas);
        })

        it('should handle defaultvalues', () => {
            expect(defaultSprite.canvas).toBeNull();
            expect(defaultSprite.timer).toBe(window);
        })
    });

    describe('setCanvas', () => {
        it('should set canvas', () => {
            expect(sprite.canvas).toBe(canvas);

            const newCanvas = document.createElement('canvas');
            sprite.setCanvas(newCanvas);

            expect(sprite.canvas).toBe(newCanvas);
        });
    });

    describe('setTimer', () => {
        it('should set timer', () => {
            expect(sprite.timer).toBe(window);

            const newTimer = {
                setInterval() {},
                clearInterval() {},

            };
            sprite.setTimer(newTimer);

            expect(sprite.timer).toBe(newTimer);
        });
    });

    describe('setCurrentTile/getCurrentTile', () => {
        it('should update/get current tile', () => {
            expect(sprite.getCurrentTile()).toBe(0);

            sprite.setCurrentTile(14);

            expect(sprite.getCurrentTile()).toBe(14);
        });
    });

    describe('stopAnimation', () => {
        it('should clearn clock animation', () => {
            sprite.animationClock = 123;
            window.clearInterval = jest.fn();

            sprite.stopAnimation();

            expect(window.clearInterval).toHaveBeenCalledWith(123);
        });
    });

    describe('render', () => {
        let ctx;
        let image;

        beforeEach(() => {
            ctx = {
                drawImage: jest.fn(),
            };

            sheet.getTileRect.mockReturnValue({
                x: 32,
                y: 64,
                width: 16,
                height: 10,
            });

            image = {};

            sheet.image = image;
            sheet.getImage = jest.fn(() => image);
        });

        it('should throw if sprite does not have tilesheet', () => {
            sprite.tilesheet = null;
            expect(() => sprite.render()).toThrow();
        });

        it('should throw if sprite does not have canvas', () => {
            sprite.canvas = null;
            expect(() => sprite.render()).toThrow();
        });

        it('should render sprite tile on sprite canvas', () => {
            sprite.canvas = {
                getContext: jest.fn(() => ctx),
            };

            sprite.render();

            expect(ctx.drawImage).toHaveBeenCalledWith(sheet.image, 32, 64, 16, 10, 0, 0, 16, 10);
        });

        it('should define canvas size when rendering on sprite canvas', () => {
            sprite.canvas = {
                getContext: jest.fn(() => ctx),
            };

            sprite.render();

            expect(sprite.canvas.width).toBe(16);
            expect(sprite.canvas.height).toBe(10);
        });

        it('should render sprite tile on given canvas', () => {
            const canvas = {
                getContext: jest.fn(() => ctx),
            };

            sprite.render(canvas, 222, 333);

            expect(ctx.drawImage).toHaveBeenCalledWith(sheet.image, 32, 64, 16, 10, 222, 333, 16, 10);
        });
    });

    describe('useTilesheet/getTilesheet', () => {
        it('should get/set sprite tilesheet', () => {
            const newTilesheet = new Tilesheet('my-image.png');

            sprite.useTilesheet(newTilesheet);

            expect(sprite.getTilesheet()).toBe(newTilesheet);
        });

        it('should stop current animation', () => {
            sprite.stopAnimation = jest.fn();

            sprite.useTilesheet(new Tilesheet('my-image.png'));

            expect(sprite.stopAnimation).toHaveBeenCalled();
        });
    });

    describe('playAnimation', () => {
        beforeEach(() => {
            jest.useFakeTimers();

            sheet.getAnimation.mockReturnValue({
                tiles: [4, 5, 6],
                speed: 300,
            });

            sprite.render = jest.fn();
            sprite.updateTilesFromArray = jest.fn();
        });

        it('should throw if sprite does not have tilesheet', () => {
            sprite.tilesheet = null;
            expect(() => sprite.playAnimation('foo')).toThrow();
        });

        it('should throw if animation is not found', () => {
            sheet.getAnimation.mockReturnValue(null);
            expect(() => sprite.playAnimation('not_found')).toThrow();
        });

        it('should stop current animation', () => {
            sprite.stopAnimation = jest.fn();
            
            sprite.playAnimation('foo');

            expect(sprite.stopAnimation).toHaveBeenCalled();
        });

        it('should set current tile to first one of given animation and render it', () => {
            sprite.playAnimation('foo');

            expect(sprite.currentTileIndex).toBe(4);
            expect(sprite.render).toHaveBeenCalled();
        });

        it('should play given animation', () => {
            const shouldLoop = false;
            const onUpdate = jest.fn();
            const onEnd = jest.fn();
            const shouldRender = false;

            sprite.playAnimation('foo', shouldLoop, onUpdate, onEnd, shouldRender);

            expect(sprite.animationClock).toBeDefined();

            jest.advanceTimersByTime(300);

            expect(sprite.updateTilesFromArray)
                .toHaveBeenCalledWith([4, 5, 6], 0, shouldLoop, onUpdate, onEnd, shouldRender);
        });

        it('should NOT play given animation if it does not have speed', () => {
            sheet.getAnimation.mockReturnValue({
                tiles: [4, 5, 6],
            });

            sprite.playAnimation('foo');

            expect(sprite.animationClock).toBeDefined();

            jest.advanceTimersByTime(300);

            expect(sprite.updateTilesFromArray).not.toHaveBeenCalled();
        });

        it('should fire given onUpdate function', () => {
            const onUpdate = jest.fn();

            sprite.playAnimation('foo', true, onUpdate);

            expect(onUpdate).toHaveBeenCalled();
        });

        it('should fire render function', () => {
            sprite.render = jest.fn();

            sprite.playAnimation('foo');

            expect(sprite.render).toHaveBeenCalled();
        });

        it('should NOT fire render function', () => {
            const shouldLoop = false;
            const onUpdate = jest.fn();
            const onEnd = jest.fn();
            const shouldRender = false;

            sprite.render = jest.fn();
            sprite.playAnimation('foo', shouldLoop, onUpdate, onEnd, shouldRender);

            expect(sprite.render).not.toHaveBeenCalled();
        });
    });

    describe('updateTilesFromArray', () => {
        beforeEach(() => {
            sprite.render = jest.fn();
            sprite.stopAnimation = jest.fn();
        });

        it('should replace current tile index with the next one', () => {
            sprite.currentTileIndex = 5;

            sprite.updateTilesFromArray([5, 7, 9], 0);

            expect(sprite.currentTileIndex).toBe(7);
        });

        it('should replace current tile index with the first one if next index is out of range and if loop is requested', () => {
            const shouldLoop = true;
            const onUpdate = jest.fn();
            const onEnd = jest.fn();
            sprite.currentTileIndex = 9;

            sprite.updateTilesFromArray([5, 7, 9], 2, shouldLoop, onUpdate, onEnd);

            expect(sprite.currentTileIndex).toBe(5);
            expect(onUpdate).toHaveBeenCalledWith(5);
            expect(onEnd).not.toHaveBeenCalled();
        });

        it('should stop animation if next index is out of range and if loop is NOT requested', () => {
            const shouldLoop = false;
            const onUpdate = jest.fn();
            const onEnd = jest.fn();
            sprite.currentTileIndex = 9;

            sprite.updateTilesFromArray([5, 7, 9], 2, shouldLoop, onUpdate, onEnd);

            expect(sprite.currentTileIndex).toBe(9);
            expect(sprite.stopAnimation).toHaveBeenCalled();
            expect(onUpdate).not.toHaveBeenCalled();
            expect(onEnd).toHaveBeenCalled();
        });

        it('should fire render function', () => {
            sprite.render = jest.fn();

            sprite.updateTilesFromArray([5, 7, 9], 0);

            expect(sprite.render).toHaveBeenCalled();
        });

        it('should NOT fire render function', () => {
            const shouldLoop = false;
            const onUpdate = jest.fn();
            const onEnd = jest.fn();
            const shouldRender = false;

            sprite.render = jest.fn();
            
            sprite.updateTilesFromArray([5, 7, 9], 0, shouldLoop, onUpdate, onEnd, shouldRender);

            expect(sprite.render).not.toHaveBeenCalled();
        });
    });

    describe('usePalette', () => {
        it('should set palette', () => {
            const newPalette = new Palette();

            sprite.usePalette(newPalette);

            expect(sprite.palette).toBe(newPalette);
        });
    });
});