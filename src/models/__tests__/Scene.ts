jest.mock('../Tilesheet.ts');

import Scene from '../Scene';
import Tilesheet from '../Tilesheet';

describe('Scene', () => {
    let scene;
    let sheet;
    let defaultScene;
    let tiles;
    let canvas;

    beforeEach(() => {
        tiles = [
            [21, 22, 23, 24,  9],
            [28, 29, 30, 31,  9],
            [22,  5,  3,  6, 10],
            [29,  5, 17, 17, 18],
        ];
        canvas = document.createElement('canvas');
        scene = new Scene(tiles, canvas);
        defaultScene = new Scene();
        sheet = new Tilesheet('my-image');

        scene.tilesheet = sheet;
        sheet.getTileSize.mockReturnValue({
            width: 16,
            height: 10,
        });
    });

    describe('constructor', () => {
        it('should correctly init scene', () => {
            expect(scene.initialTiles).toEqual(tiles);
            expect(scene.tiles).toEqual(tiles);
            expect(scene.canvas).toEqual(canvas);
        })

        it('should handle defaultvalues', () => {
            expect(defaultScene.initialTiles).toEqual([]);
            expect(defaultScene.tiles).toEqual([]);
            expect(defaultScene.canvas).toBeNull();
        })
    });

    describe('getWidth', () => {
        it('should scene width in pixels', () => {
            const width = scene.getWidth();

            expect(width).toBe(80);
        });
     });

     describe('getHeight', () => {
        it('should scene height in pixels', () => {
            const height = scene.getHeight();

            expect(height).toBe(40);
        });
     });

     describe('getCanvas/setCanvas', () => {
        it('should set canvas', () => {
            expect(scene.getCanvas()).toBe(canvas);

            const newCanvas = document.createElement('canvas');
            scene.setCanvas(newCanvas);

            expect(scene.getCanvas()).toBe(newCanvas);
        });
     });

     describe('setTile', () => {
        it('should update given tile', () => {
            expect(scene.tiles[1]).toEqual([28, 29, 30, 31,  9]);

            scene.setTile(2, 1, 5);

            expect(scene.tiles[1]).toEqual([28, 29, 5, 31,  9]);
        });
     });

    describe('resetTiles', () => {
        it('should reset scene tiles to initial ones', () => {
            scene.tiles = [];

            scene.resetTiles();

            expect(scene.tiles).toEqual(tiles);
        });
    });

    describe('renderTile', () => {
        let ctx;

        beforeEach(() => {
            ctx = {
                drawImage: jest.fn(),
            };

            scene.tilesheet.getTileRect.mockReturnValue({
                x: 100,
                y: 150,
                width: 16,
                height: 16,
            });

            scene.tilesheet.getImage.mockReturnValue(scene.tilesheet.image);
        });

        it('should render tile on scene canvas', () => {
            scene.canvas.getContext = jest.fn(() => ctx);

            scene.renderTile(2, 1);

            expect(ctx.drawImage).toHaveBeenCalledWith(
                scene.tilesheet.image, 100, 150, 16, 16, 32, 16, 16, 16,
            );
        });

        it('should render tile on given canvas', () => {
            const canvas = {
                getContext: jest.fn(() => ctx),
            };
            
            scene.renderTile(2, 1, canvas);

            expect(ctx.drawImage).toHaveBeenCalledWith(
                scene.tilesheet.image, 100, 150, 16, 16, 32, 16, 16, 16,
            );
        });
    });

    describe('render', () => {
        beforeEach(() => {
            scene.renderTile = jest.fn();
        });

        it('should throw error if scene does not have tilesheet', () => {
            scene.tilesheet = null;
            expect(() => scene.render()).toThrow();
        });

        it('should throw error if no canvas is provided', () => {
            expect(() => scene.render(null)).toThrow();
        });

        it('should render each scene tile', () => {
            const canvas = {};
            
            scene.render(canvas);

            expect(scene.renderTile).toHaveBeenCalledTimes(20);
        });

        it('should set scene canvas to the given one', () => {
            const canvas = {};
       
            scene.render(canvas);

            expect(scene.canvas).toBe(canvas);
        });

        it('should set scene canvas width and height', () => {
            scene.render();

            expect(scene.canvas.width).toBe(80);
            expect(scene.canvas.height).toBe(40);
        });
    });

    describe('updateTilesFromArray', () => {
        beforeEach(() => {
            scene.renderTile = jest.fn();
        });

        it('should replace occurences of corresponding tile index with the next one', () => {
            expect(scene.tiles).toEqual([
                [21, 22, 23, 24,  9],
                [28, 29, 30, 31,  9],
                [22,  5,  3,  6, 10],
                [29,  5, 17, 17, 18],
            ]);

            scene.updateTilesFromArray([17, 19], 0);

            expect(scene.tiles).toEqual([
                [21, 22, 23, 24,  9],
                [28, 29, 30, 31,  9],
                [22,  5,  3,  6, 10],
                [29,  5, 19, 19, 18],
            ]);
        });

        it('should replace occurences of corresponding tile index with the first one if next index is out of range', () => {
            expect(scene.tiles).toEqual([
                [21, 22, 23, 24,  9],
                [28, 29, 30, 31,  9],
                [22,  5,  3,  6, 10],
                [29,  5, 17, 17, 18],
            ]);

            scene.updateTilesFromArray([8, 9], 1);

            expect(scene.tiles).toEqual([
                [21, 22, 23, 24,  8],
                [28, 29, 30, 31,  8],
                [22,  5,  3,  6, 10],
                [29,  5, 17, 17, 18],
            ]);
        });

        it('should render new tiles if scene has a canvas', () => {
            scene.canvas = {};

            scene.updateTilesFromArray([17, 19], 0);

            expect(scene.renderTile).toHaveBeenCalledTimes(2);
        });

        it('should NOT render new tiles if scene does not have a canvas', () => {
            scene.canvas = null;

            scene.updateTilesFromArray([17, 19], 0);

            expect(scene.renderTile).not.toHaveBeenCalled();
        });
    });

    describe('useTilesheet', () => {
        beforeEach(() => {
            jest.useFakeTimers();

            sheet.getAnimations.mockReturnValue([{
                tiles: [0, 1],
                speed: 200,
            }, {
                tiles: [1, 2],
                speed: 300,
            }]);
        });

        it('should set given tilesheet', () => {
            scene.tilesheet = null;

            scene.useTilesheet(sheet);

            expect(scene.tilesheet).toBe(sheet);
        });

        it('should clear current animations', () => {
            scene.animationClocks = [123, 234];
            window.clearInterval = jest.fn();

            scene.useTilesheet(sheet);

            expect(window.clearInterval).toHaveBeenCalledWith(123);
            expect(window.clearInterval).toHaveBeenCalledWith(234);
        });

        it('should set new animations', () => {
            scene.updateTilesFromArray = jest.fn();
            scene.useTilesheet(sheet);
            expect(scene.animationClocks).toHaveLength(2);

            jest.advanceTimersByTime(300);

            expect(scene.updateTilesFromArray).toHaveBeenCalledTimes(2);
        });
    });
});