# Tilesheets.js
## A small library providing helpers to handle tile sheets.

*Tilesheets.js* helps you handling tile sheets with JavaScript.  

```shell
npm i tilesheets
# or
yarn add tilesheets
```

```js
import { Sprite, Tilesheet } from 'tilesheets';

const mySheet = new Tilesheet('./images/sheet.png');
mySheet
    .settTileSize(16)   // Tiles on the sheet are 16px*16px
    .setMargin(1);      // There is a 1px gap between each tile

const myCanvas = document.getElementById('my-canvas');

// Be sure that the sheet is loaded
mySheet.waitForLoading().then(() => {
    // Create a new sprite from a canvas
    const mySprite = new Sprite(myCanvas);

    mySprite
        .useTilesheet(mySheet)  // Tell the sprite to use our sheet
        .setCurrentTile(5)      // Set current tile to 5
        .render();              // And render it!
});
```

You can also use it directly in your browser: by including the lib file via a `script` tag,
you can access a global variable `TilesheetsJS`:

```html
<script src="https://unpkg.com/tilesheets/tilesheets.min.js"></script>
<script>
    const { Sprite, Tilesheet } = TilesheetsJS;
</script>
```

__Know more on on <a href="https://adrien-gueret.github.io/tilesheets/">the demo page</a>!__