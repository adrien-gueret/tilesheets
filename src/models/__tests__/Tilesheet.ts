import Tilesheet from '../Tilesheet';
import Palette from '../Palette';

describe('Tilesheet', () => {
    let sheet;
    let createSheet;

    beforeEach(() => {
        createSheet = (shouldAutoLoad) => {
            sheet = new Tilesheet('https://my-site.com/my-image.png', shouldAutoLoad);
        };
    });

    describe('constructor', () => {
        describe('by default', () => {
            it('should set sheet image', () => {
                createSheet();
    
                expect(sheet.image).toBeInstanceOf(Image);
                expect(sheet.imagePath).toBe('https://my-site.com/my-image.png');
                expect(sheet.image.src).toBe('https://my-site.com/my-image.png');
            });
    
        });
        
        describe('without autoload', () => {
            it('should NOT set sheet image src', () => {
                createSheet(false);

                expect(sheet.image).toBeInstanceOf(Image);
                expect(sheet.imagePath).toBe('https://my-site.com/my-image.png');
                expect(sheet.image.src).toBe('');
            });
        });
    });

    describe('other methods', () => {
        beforeEach(() => createSheet());

        describe('load', () => {
            it('should set image src', () => {
                createSheet(false);

                expect(sheet.image.src).toBe('');

                sheet.load();

                expect(sheet.image.src).toBe('https://my-site.com/my-image.png');
            });
        });
    
        describe('getAnimations/setAnimations', () => {
            it('should get/set sheet animations', () => {
                const animations = [{ tiles: [1, 2], speed: 200 }];
                sheet.setAnimations(animations);
    
                expect(sheet.getAnimations()).toBe(animations);
            });
        });
    
        describe('getAnimation', () => {
            it('should get animation by its name', () => {
                const animations = [
                    { tiles: [1, 2], speed: 200 },
                    { tiles: [3, 4], speed: 200, name: 'foo' },
                ];
                sheet.setAnimations(animations);
    
                expect(sheet.getAnimation('foo')).toBe(animations[1]);
            });
        });
    
        describe('setTileSize', () => {
            it('should set tiles width and height', () => {
                sheet.setTileSize(32, 24);
                expect(sheet.tileWidth).toBe(32);
                expect(sheet.tileHeight).toBe(24);
            });
    
            it('should use same value for width and height if only one value is provided', () => {
                sheet.setTileSize(32);
                expect(sheet.tileWidth).toBe(32);
                expect(sheet.tileHeight).toBe(32);
            });
        });
    
        describe('setMargin', () => {
            it('should set tiles margin', () => {
                sheet.setMargin(3);
                expect(sheet.margin).toBe(3);
            });
        });
    
        describe('setReferencePalette', () => {
            it('should set reference palette', () => {
                const palette = new Palette();
                sheet.setReferencePalette(palette);
                expect(sheet.referencePalette).toBe(palette);
            });
        });
    
        describe('getTileRect', () => {
            it('should throw error if image is not loaded', () => {
                sheet.image = { complete: false };
                expect(() => sheet.getTileRect(3)).toThrow();
            });
    
            it('should return rectangle representation of the requested tile', () => {
                [
                    {
                        given: {
                            image: {
                                naturalWidth: 50,
                            },
                            tileWidth: 16,
                            tileHeight: 16,
                            margin: 1,
                            tileIndex: 0,
                        },
                        expected: {
                            x: 0,
                            y: 0,
                            width: 16,
                            height: 16,
                        },
                    },
                    {
                        given: {
                            image: {
                                naturalWidth: 50,
                            },
                            tileWidth: 16,
                            tileHeight: 16,
                            margin: 1,
                            tileIndex: 1,
                        },
                        expected: {
                            x: 17,
                            y: 0,
                            width: 16,
                            height: 16,
                        },
                    },
                    {
                        given: {
                            image: {
                                naturalWidth: 50,
                            },
                            tileWidth: 16,
                            tileHeight: 16,
                            margin: 1,
                            tileIndex: 4,
                        },
                        expected: {
                            x: 17,
                            y: 17,
                            width: 16,
                            height: 16,
                        },
                    },
                    {
                        given: {
                            image: {
                                naturalWidth: 144,
                            },
                            tileWidth: 24,
                            tileHeight: 32,
                            margin: 16,
                            tileIndex: 10,
                        },
                        expected: {
                            x: 80,
                            y: 96,
                            width: 24,
                            height: 32,
                        },
                    },
                ].forEach(({ given, expected }) => {
                    sheet.setTileSize(given.tileWidth, given.tileHeight).setMargin(given.margin);
                    sheet.image = given.image;
                    sheet.image.complete = true;
    
                    const rect = sheet.getTileRect(given.tileIndex);
    
                    expect(rect).toEqual(expected);
                });
            });
        });
    
        describe('getTileStyle', () => {
            it('should throw error if image is not loaded', () => {
                sheet.image = { complete: false, src: 'my-image.png' };
                expect(() => sheet.getTileStyle(3)).toThrow();
            });
    
            it('should return CSS style of the requested tile', () => {
                [
                    {
                        given: {
                            image: {
                                naturalWidth: 50,
                            },
                            tileWidth: 16,
                            tileHeight: 16,
                            margin: 1,
                            tileIndex: 0,
                        },
                        expected: {
                            backgroundPosition: '-0px -0px',
                            width: '16px',
                            height: '16px',
                        },
                    },
                    {
                        given: {
                            image: {
                                naturalWidth: 50,
                            },
                            tileWidth: 16,
                            tileHeight: 16,
                            margin: 1,
                            tileIndex: 1,
                        },
                        expected: {
                            backgroundPosition: '-17px -0px',
                            width: '16px',
                            height: '16px',
                        },
                    },
                    {
                        given: {
                            image: {
                                naturalWidth: 50,
                            },
                            tileWidth: 16,
                            tileHeight: 16,
                            margin: 1,
                            tileIndex: 4,
                        },
                        expected: {
                            backgroundPosition: '-17px -17px',
                            width: '16px',
                            height: '16px',
                        },
                    },
                    {
                        given: {
                            image: {
                                naturalWidth: 144,
                            },
                            tileWidth: 24,
                            tileHeight: 32,
                            margin: 16,
                            tileIndex: 10,
                        },
                        expected: {
                            backgroundPosition: '-80px -96px',
                            width: '24px',
                            height: '32px',
                        },
                    },
                ].forEach(({ given, expected }) => {
                    sheet.setTileSize(given.tileWidth, given.tileHeight).setMargin(given.margin);
                    sheet.image = given.image;
                    sheet.image.complete = true;
    
                    const style = sheet.getTileStyle(given.tileIndex);
    
                    expect(style).toEqual({
                        display: 'inline-block',
                        backgroundImage: `url(${sheet.image.src})`,
                        ...expected,
                    });
                });
            });
        });
    
        describe('getTileDomElement', () => {
            it('should throw error if image is not loaded', () => {
                sheet.image = { complete: false, src: 'my-image.png' };
                expect(() => sheet.getTileDomElement(3)).toThrow();
            });
    
            it('should return DOM element displaying requested tile', () => {
                [
                    {
                        given: {
                            image: {
                                naturalWidth: 50,
                            },
                            tileWidth: 16,
                            tileHeight: 16,
                            margin: 1,
                            tileIndex: 0,
                        },
                        expected: {
                            backgroundPosition: '-0px -0px',
                            width: '16px',
                            height: '16px',
                        },
                    },
                    {
                        given: {
                            image: {
                                naturalWidth: 50,
                            },
                            tileWidth: 16,
                            tileHeight: 16,
                            margin: 1,
                            tileIndex: 1,
                        },
                        expected: {
                            backgroundPosition: '-17px -0px',
                            width: '16px',
                            height: '16px',
                        },
                    },
                    {
                        given: {
                            image: {
                                naturalWidth: 50,
                            },
                            tileWidth: 16,
                            tileHeight: 16,
                            margin: 1,
                            tileIndex: 4,
                        },
                        expected: {
                            backgroundPosition: '-17px -17px',
                            width: '16px',
                            height: '16px',
                        },
                    },
                    {
                        given: {
                            image: {
                                naturalWidth: 144,
                            },
                            tileWidth: 24,
                            tileHeight: 32,
                            margin: 16,
                            tileIndex: 10,
                        },
                        expected: {
                            backgroundPosition: '-80px -96px',
                            width: '24px',
                            height: '32px',
                        },
                    },
                ].forEach(({ given, expected }) => {
                    sheet.setTileSize(given.tileWidth, given.tileHeight).setMargin(given.margin);
                    sheet.image = given.image;
                    sheet.image.complete = true;
    
                    const domElement = sheet.getTileDomElement(given.tileIndex);
                    
                    expect(domElement).toBeInstanceOf(HTMLSpanElement);
                    expect(domElement.style.display).toBe('inline-block');
                    expect(domElement.style.backgroundPosition).toBe(expected.backgroundPosition);
                    expect(domElement.style.width).toBe(expected.width);
                    expect(domElement.style.height).toBe(expected.height);
                    expect(domElement.style.backgroundImage).toBe(`url(${sheet.image.src})`);
                });
            });
        });
    
        describe('waitForLoading', () => {
            beforeEach(() => {
                sheet.image = {
                    complete: false,
                    src: 'image.png',
                    callbacks: {},
                    onload: () => sheet.image.callbacks.load(),
                    onerror: () => sheet.image.callbacks.error(),
                    addEventListener: jest.fn((eventName, callback) => sheet.image.callbacks[eventName] = callback),
                };
            });
            it('should resolve directly if image is loaded', async () => {
                sheet.image.complete = true;
    
                await sheet.waitForLoading();
    
                expect(sheet.image.addEventListener).not.toHaveBeenCalled();
            });
    
            it('should resolve when image is loaded', (done) => {
                sheet.waitForLoading().then(() => {
                    done();
                });
    
                sheet.image.onload();
            });
    
            it('should reject if image can not be loaded', (done) => {
                sheet.waitForLoading().catch(() => {
                    done();
                });
    
                sheet.image.onerror();
            });
        });
    
        describe('initNewCanvasWithImage', () => {
            let expectedCtx;
            let expectedImageData;
    
            beforeEach(() => {
                expectedCtx = { getImageData: jest.fn(() => expectedImageData), drawImage: jest.fn() };
                HTMLCanvasElement.prototype.getContext = jest.fn(() => expectedCtx);
                sheet.image = { width: 200, height: 200 };
            });
    
            it('should return an object with canvas, context and imageData', () => {
                const { canvas, ctx, imageData } = sheet.initNewCanvasWithImage();
    
                expect(canvas).toBeInstanceOf(HTMLCanvasElement);
                expect(ctx).toBe(expectedCtx);
                expect(imageData).toBe(expectedImageData);
                expect(ctx.drawImage).toHaveBeenCalledWith(sheet.image, 0, 0, 200, 200);
                expect(ctx.getImageData).toHaveBeenCalledWith(0, 0, 200, 200);
           }); 
        });
    
        describe('getReferencePalette', () => {
            beforeEach(() => {
                sheet.image = {};
            });
    
            describe('when image is not complete', () => {
                beforeEach(() => {
                    sheet.image.complete = false;
                });
    
                it('should throw an error if image is not complete', () => {
                    expect(() => sheet.getReferencePalette()).toThrow();
                });
            });
    
            describe('when image is complete', () => {
                beforeEach(() => {
                    const imageData = {
                        data: [255, 0, 0, 255, 0, 255, 0, 255, 0, 0, 255, 255],
                    };
    
                    sheet.image.complete = true;
                    sheet.initNewCanvasWithImage = jest.fn(() => ({ imageData }));
                });
    
                it('should return reference palette if exists', () => {
                    const expectedReferencePalette = new Palette();
                    sheet.setReferencePalette(expectedReferencePalette);
                    
                    const referencePalette = sheet.getReferencePalette();
                    expect(referencePalette).toBe(expectedReferencePalette);
                });
    
                it('should generate and set new reference palette if none yet', () => {
                    sheet.setReferencePalette(null);
                    
                    const referencePalette = sheet.getReferencePalette();
                    expect(referencePalette).toBeInstanceOf(Palette);
                });
            });
        });
    
        describe('generatePalettedImage', () => {
            let palette: Palette;
    
            beforeEach(() => {
                sheet.image = {};
                palette = new Palette();
                palette.addColor([0, 255, 0, 255]);
                palette.addColor([255, 0, 0, 255]);                
            });
    
            describe('when image is not complete', () => {
                beforeEach(() => {
                    sheet.image.complete = false;
                });
    
                it('should throw an error if image is not complete', () => {
                    expect(() => sheet.generatePalettedImage(palette)).toThrow();
                });
            });
    
            describe('when image is complete', () => {
                let canvas;
    
                beforeEach(() => {
                    sheet.image.complete = true;
                    sheet.image.src = 'image.png';
    
                    const referencePalette = new Palette();
                    referencePalette.addColor([255, 0, 0, 255]);
                    referencePalette.addColor([0, 255, 0, 255]);
                
                    sheet.getReferencePalette = jest.fn(() => referencePalette);
    
                    const imageData = {
                        data: [255, 0, 0, 255, 0, 255, 0, 255, 0, 0, 255, 255],
                    };
    
                    const ctx = { putImageData: jest.fn() };
                    sheet.initNewCanvasWithImage = jest.fn(() => ({
                        canvas,
                        ctx,
                        imageData,
    
                    }));
                });
    
                it('should store and return a canvas', () => {
                    const palettedImage = sheet.generatePalettedImage(palette);
                    expect(sheet.palettedImages.get(palette)).toBe(canvas);
                    expect(palettedImage).toBe(canvas);
                });
            });
        });
    
        describe('getImage', () => {
            beforeEach(() => {
                jest.spyOn(sheet, 'generatePalettedImage');
            });
    
            describe('without palette', () => {
                it('should return sheet image', () => {
                    const  image = sheet.getImage();
                    expect(image).toBe(sheet.image);
                });
            });
    
            describe('with palette', () => {
                let palette: Palette;
                let image: HTMLCanvasElement;
    
                beforeEach(() => {
                    palette = new Palette();
                    image = document.createElement('canvas');
                });
    
                describe('with stored image for given palette', () => {
                    beforeEach(() => {
                        sheet.palettedImages.set(palette, image);
                    });
    
                    it('should return stored image', () => {
                        const  sheetImage = sheet.getImage(palette);
                        expect(sheetImage).toBe(image);
                    });
                });
    
                describe('without stored image for given palette', () => {
                    beforeEach(() => {
                        sheet.generatePalettedImage.mockReturnValue(image);
                    });
    
                    it('should generate and return a new image', () => {
                        const  sheetImage = sheet.getImage(palette);
                        
                        expect(sheet.generatePalettedImage).toHaveBeenCalledWith(palette);
                        expect(sheetImage).toBe(image);
                    });
                });
            });
        });
    });
});