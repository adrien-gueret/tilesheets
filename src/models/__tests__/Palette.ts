import Palette from '../Palette';

describe('Palette', () => {
    let palette;
    let red;
    let green;
    let blue;

    beforeEach(() => {
        red = [255, 0, 0, 255];
        green = [0, 255, 0, 255];
        blue = [0, 0, 255, 255];

        palette = new Palette();
        palette.addColor(red);
    });

    describe('addColor', () => {
        it('should add given color to the palette', () => {
            expect(palette.hasColor(green)).toBe(false);

            palette.addColor(green);

            expect(palette.hasColor(green)).toBe(true);
        });

        it('should add given color to the palette only once', () => {
            palette.addColor(red);
            palette.addColor(red);
            palette.addColor(red);

            expect(palette.colors).toHaveLength(1);
        });
    });

    describe('getColorByIndex', () => {
        it('should get color by its index', () => {
            expect(palette.getColorByIndex(0)).toBe(red);
        });
    });

    describe('getIndexFromColor', () => {
        it('should get color index', () => {
            expect(palette.getIndexFromColor(red)).toBe(0);
        });
    });
});