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

    describe('setCurrentTile', () => {
        it('should update current tile', () => {
            sprite.setCurrentTile(14);

            expect(sprite.currentTileIndex).toBe(14);
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

    describe('useTilesheet', () => {
        it('should set sprite tilesheet', () => {
            const newTilesheet = new Tilesheet('my-image.png');

            sprite.useTilesheet(newTilesheet);

            expect(sprite.tilesheet).toBe(newTilesheet);
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
            sprite.playAnimation('foo');

            expect(sprite.animationClock).toBeDefined();

            jest.advanceTimersByTime(300);

            expect(sprite.updateTilesFromArray).toHaveBeenCalled();
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
            sprite.currentTileIndex = 9;

            sprite.updateTilesFromArray([5, 7, 9], 2, true);

            expect(sprite.currentTileIndex).toBe(5);
        });

        it('should stop animation if next index is out of range and if loop is NOT requested', () => {
            sprite.currentTileIndex = 9;

            sprite.updateTilesFromArray([5, 7, 9], 2);

            expect(sprite.currentTileIndex).toBe(9);
            expect(sprite.stopAnimation).toHaveBeenCalled();
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