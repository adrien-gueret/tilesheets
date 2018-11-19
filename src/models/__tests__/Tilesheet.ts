import Tilesheet from '../Tilesheet';

describe('Tilesheet', () => {
    let sheet;

    beforeEach(() => {
        sheet = new Tilesheet('https://my-site.com/my-image.png');
    });

    describe('constructor', () => {
        it('should set sheet image', () => {
            expect(sheet.image.src).toBe('https://my-site.com/my-image.png');
        })
    });

    describe('getAnimations/setAnimations', () => {
        it('should get/set sheet animations', () => {
            const animations = [{ tiles: [1, 2], speed: 200}];
            sheet.setAnimations(animations);

            expect(sheet.getAnimations()).toBe(animations);
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

    describe('getImage', () => {
        it('should return sheet image', () => {
            const  image = sheet.getImage();
            expect(image).toBe(sheet.image);
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
        it('should resolve directly if image is loaded', async () => {
            sheet.image = { complete: true };

            await sheet.waitForLoading();

            expect(sheet.image.onload).toBeUndefined();
        });

        it('should resolve when image is loaded', (done) => {
            sheet.image = { complete: false };

            sheet.waitForLoading().then(() => {
                done();
            });

            sheet.image.onload();
        });

        it('should reject if image can not be loaded', (done) => {
            sheet.image = { complete: false };

            sheet.waitForLoading().catch(() => {
                done();
            });

            sheet.image.onerror();
        });
    });
});