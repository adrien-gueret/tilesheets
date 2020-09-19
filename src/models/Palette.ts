type Color = [number, number, number, number];

function areColorsEqual(color1: Color, color2: Color): boolean {
    return color1.every((value, index) => value === color2[index]);
}

export default class Palette {
    protected colors: Array<Color> =[];

    addColor(color: Color): this {
        if (this.hasColor(color)) {
            return this;
        }

        this.colors.push(color);

        return this;
    }

    hasColor(colorToFind: Color): boolean {
        return this.colors.some(color => areColorsEqual(color, colorToFind));
    }

    getColorByIndex(index: number): Color {
        return this.colors[index];
    }
    
    getIndexFromColor(colorToFind: Color): number {
        return this.colors.findIndex(color => areColorsEqual(color, colorToFind));
    }
}