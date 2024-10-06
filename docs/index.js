(function () {
    'use strict';

    function areColorsEqual(color1, color2) {
        return color1.every(function (value, index) { return value === color2[index]; });
    }
    var Palette = (function () {
        function Palette() {
            this.colors = [];
        }
        Palette.prototype.addColor = function (color) {
            if (this.hasColor(color)) {
                return this;
            }
            this.colors.push(color);
            return this;
        };
        Palette.prototype.hasColor = function (colorToFind) {
            return this.colors.some(function (color) { return areColorsEqual(color, colorToFind); });
        };
        Palette.prototype.getColorByIndex = function (index) {
            return this.colors[index];
        };
        Palette.prototype.getIndexFromColor = function (colorToFind) {
            return this.colors.findIndex(function (color) { return areColorsEqual(color, colorToFind); });
        };
        return Palette;
    }());

    var __read$2 = (undefined && undefined.__read) || function (o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    };
    var __spreadArray$1 = (undefined && undefined.__spreadArray) || function (to, from, pack) {
        if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
            if (ar || !(i in from)) {
                if (!ar) ar = Array.prototype.slice.call(from, 0, i);
                ar[i] = from[i];
            }
        }
        return to.concat(ar || Array.prototype.slice.call(from));
    };
    function cloneDeepArrays(arraysToClone) {
        return arraysToClone.map(function (arr) { return arr.slice(); });
    }
    var Scene = (function () {
        function Scene(tiles, canvas, timer) {
            if (tiles === void 0) { tiles = []; }
            if (canvas === void 0) { canvas = null; }
            if (timer === void 0) { timer = window; }
            this.tilesheet = null;
            this.animationClocks = [];
            this.initialTiles = cloneDeepArrays(tiles);
            this.tiles = cloneDeepArrays(tiles);
            this.canvas = canvas;
            this.timer = timer;
        }
        Scene.prototype.getWidth = function () {
            if (!this.tilesheet) {
                return 0;
            }
            var width = this.tilesheet.getTileSize().width;
            var maxLength = Math.max.apply(Math, __spreadArray$1([], __read$2(this.tiles.map(function (row) { return row.length; })), false));
            return width * maxLength;
        };
        Scene.prototype.getHeight = function () {
            if (!this.tilesheet) {
                return 0;
            }
            var height = this.tilesheet.getTileSize().height;
            return this.tiles.length * height;
        };
        Scene.prototype.getCanvas = function () {
            return this.canvas;
        };
        Scene.prototype.setCanvas = function (canvas) {
            this.canvas = canvas;
            this.resizeCanvas();
            return this;
        };
        Scene.prototype.resizeCanvas = function () {
            if (this.canvas && this.tilesheet) {
                this.canvas.width = this.getWidth();
                this.canvas.height = this.getHeight();
            }
            return this;
        };
        Scene.prototype.setTile = function (x, y, newTile) {
            this.tiles[y][x] = newTile;
            return this;
        };
        Scene.prototype.renderTile = function (columnIndex, rowIndex, canvas, deltaX, deltaY) {
            if (canvas === void 0) { canvas = this.canvas; }
            if (deltaX === void 0) { deltaX = 0; }
            if (deltaY === void 0) { deltaY = 0; }
            if (!canvas || !this.tilesheet) {
                return this;
            }
            var ctx = canvas.getContext('2d');
            var tileIndex = this.tiles[rowIndex][columnIndex];
            var _a = this.tilesheet.getTileRect(tileIndex), x = _a.x, y = _a.y, width = _a.width, height = _a.height;
            var destX = columnIndex * width + deltaX;
            var destY = rowIndex * height + deltaY;
            if (tileIndex === null) {
                ctx.clearRect(destX, destY, width, height);
                return this;
            }
            ctx.drawImage(this.tilesheet.getImage(), x, y, width, height, destX, destY, width, height);
            return this;
        };
        Scene.prototype.render = function (canvas, x, y) {
            var _this = this;
            if (canvas === void 0) { canvas = this.canvas; }
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (!this.tilesheet) {
                throw new Error('Scene::render: tilesheet is not defined.');
            }
            if (!canvas) {
                throw new Error('Scene::render: no canvas provided.');
            }
            this.canvas = canvas;
            this.tiles.forEach(function (rowTiles, rowIndex) {
                rowTiles.forEach(function (tileIndex, columnIndex) {
                    _this.renderTile(columnIndex, rowIndex, canvas, x, y);
                });
            });
            return this;
        };
        Scene.prototype.resetTiles = function () {
            this.tiles = cloneDeepArrays(this.initialTiles);
            return this;
        };
        Scene.prototype.getTiles = function () {
            return this.tiles;
        };
        Scene.prototype.updateTilesFromArray = function (tiles, currentTileIndex, deltaX, deltaY) {
            var _this = this;
            if (deltaX === void 0) { deltaX = 0; }
            if (deltaY === void 0) { deltaY = 0; }
            var nextTileIndex = currentTileIndex + 1;
            if (!tiles[nextTileIndex]) {
                nextTileIndex = 0;
            }
            this.tiles.forEach(function (rowTiles, rowIndex) {
                rowTiles.forEach(function (tileIndex, columnIndex) {
                    if (tileIndex !== tiles[currentTileIndex]) {
                        return;
                    }
                    var newTile = tiles[nextTileIndex];
                    _this.setTile(columnIndex, rowIndex, newTile);
                    if (_this.canvas) {
                        _this.renderTile(columnIndex, rowIndex, _this.canvas, deltaX, deltaY);
                    }
                });
            });
            return nextTileIndex;
        };
        Scene.prototype.playAnimations = function (x, y) {
            var _this = this;
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            this.stopAnimations();
            if (!this.tilesheet) {
                return this;
            }
            this.animationClocks = this.tilesheet.getAnimations().map(function (animation) {
                var tileIndex = 0;
                if (!animation.speed) {
                    return;
                }
                return _this.timer.setInterval(function () {
                    tileIndex = _this.updateTilesFromArray(animation.tiles, tileIndex, x, y);
                }, animation.speed);
            });
            return this;
        };
        Scene.prototype.stopAnimations = function () {
            var _this = this;
            this.animationClocks.forEach(function (clock) {
                _this.timer.clearInterval(clock);
            });
            this.animationClocks = [];
            return this;
        };
        Scene.prototype.useTilesheet = function (tilesheet) {
            this.tilesheet = tilesheet;
            this.resizeCanvas();
            this.playAnimations();
            return this;
        };
        Scene.prototype.getTilesheet = function () {
            return this.tilesheet;
        };
        return Scene;
    }());

    var Sprite = (function () {
        function Sprite(canvas, timer) {
            if (canvas === void 0) { canvas = null; }
            if (timer === void 0) { timer = window; }
            this.tilesheet = null;
            this.currentTileIndex = 0;
            this.animationClock = null;
            this.canvas = canvas;
            this.timer = timer;
        }
        Sprite.prototype.setCanvas = function (canvas) {
            this.canvas = canvas;
            return this;
        };
        Sprite.prototype.setTimer = function (timer) {
            this.timer = timer;
            return this;
        };
        Sprite.prototype.getCurrentTile = function () {
            return this.currentTileIndex;
        };
        Sprite.prototype.setCurrentTile = function (tileIndex) {
            this.currentTileIndex = tileIndex;
            return this;
        };
        Sprite.prototype.stopAnimation = function () {
            if (this.animationClock) {
                this.timer.clearInterval(this.animationClock);
            }
            return this;
        };
        Sprite.prototype.updateTilesFromArray = function (tiles, currentTileIndex, shouldLoop, onUpdate, onEnd, shouldRender) {
            if (shouldLoop === void 0) { shouldLoop = false; }
            if (onUpdate === void 0) { onUpdate = function () { }; }
            if (onEnd === void 0) { onEnd = function () { }; }
            if (shouldRender === void 0) { shouldRender = true; }
            var nextTileIndex = currentTileIndex + 1;
            if (!tiles[nextTileIndex]) {
                nextTileIndex = 0;
                if (!shouldLoop) {
                    onEnd();
                    this.stopAnimation();
                    return nextTileIndex;
                }
            }
            var newTile = tiles[nextTileIndex];
            onUpdate(newTile);
            this.setCurrentTile(newTile);
            if (shouldRender) {
                this.render();
            }
            return nextTileIndex;
        };
        Sprite.prototype.playAnimation = function (name, shouldLoop, onUpdate, onEnd, shouldRender) {
            var _this = this;
            if (shouldLoop === void 0) { shouldLoop = true; }
            if (onUpdate === void 0) { onUpdate = function () { }; }
            if (onEnd === void 0) { onEnd = function () { }; }
            if (shouldRender === void 0) { shouldRender = true; }
            if (!this.tilesheet) {
                throw new Error("Sprite::playAnimation: this sprite does not have any tilesheet");
            }
            var animation = this.tilesheet.getAnimation(name);
            if (!animation) {
                throw new Error("Sprite::playAnimation: animation \"".concat(name, "\" not found"));
            }
            this.stopAnimation();
            var currentAnimationIndex = 0;
            var firstTile = animation.tiles[currentAnimationIndex];
            onUpdate(firstTile);
            this.setCurrentTile(firstTile);
            if (shouldRender) {
                this.render();
            }
            if (animation.tiles.length === 1 || !animation.speed) {
                return this;
            }
            this.animationClock = this.timer.setInterval(function () {
                currentAnimationIndex = _this.updateTilesFromArray(animation.tiles, currentAnimationIndex, shouldLoop, onUpdate, onEnd, shouldRender);
            }, animation.speed);
            return this;
        };
        Sprite.prototype.render = function (canvas, destX, destY) {
            if (canvas === void 0) { canvas = this.canvas; }
            if (destX === void 0) { destX = 0; }
            if (destY === void 0) { destY = 0; }
            if (!this.tilesheet) {
                throw new Error("Sprite::render: this sprite does not have any tilesheet");
            }
            if (!canvas) {
                throw new Error("Sprite::render: this sprite does not have any canvas");
            }
            var _a = this.tilesheet.getTileRect(this.currentTileIndex), x = _a.x, y = _a.y, width = _a.width, height = _a.height;
            if (canvas === this.canvas) {
                canvas.width = width;
                canvas.height = height;
            }
            var ctx = canvas.getContext('2d');
            ctx.drawImage(this.tilesheet.getImage(this.palette), x, y, width, height, destX, destY, width, height);
            return this;
        };
        Sprite.prototype.usePalette = function (palette) {
            this.palette = palette;
            return this;
        };
        Sprite.prototype.useTilesheet = function (tilesheet) {
            this.tilesheet = tilesheet;
            this.stopAnimation();
            return this;
        };
        Sprite.prototype.getTilesheet = function () {
            return this.tilesheet;
        };
        return Sprite;
    }());

    var __assign = (undefined && undefined.__assign) || function () {
        __assign = Object.assign || function(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                    t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };
    var __awaiter$2 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    var __generator$2 = (undefined && undefined.__generator) || function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
        return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (g && (g = 0, op[0] && (_ = 0)), _) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    };
    var __read$1 = (undefined && undefined.__read) || function (o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    };
    var Tilesheet = (function () {
        function Tilesheet(imagePath, shouldAutoload) {
            if (shouldAutoload === void 0) { shouldAutoload = true; }
            this.tileWidth = 16;
            this.tileHeight = 16;
            this.margin = 1;
            this.animations = [];
            this.referencePalette = null;
            this.palettedImages = new Map();
            this.image = new Image();
            this.imagePath = imagePath;
            if (shouldAutoload) {
                this.load();
            }
        }
        Tilesheet.prototype.load = function () {
            this.image.src = this.imagePath;
            return this;
        };
        Tilesheet.prototype.getAnimations = function () {
            return this.animations;
        };
        Tilesheet.prototype.getAnimation = function (name) {
            return this.animations.filter(function (animation) { return animation.name === name; })[0];
        };
        Tilesheet.prototype.setAnimations = function (animations) {
            this.animations = animations;
            return this;
        };
        Tilesheet.prototype.getTileSize = function () {
            return {
                width: this.tileWidth,
                height: this.tileHeight,
            };
        };
        Tilesheet.prototype.setTileSize = function (width, height) {
            if (height === void 0) { height = width; }
            this.tileWidth = width;
            this.tileHeight = height;
            return this;
        };
        Tilesheet.prototype.setMargin = function (margin) {
            this.margin = margin;
            return this;
        };
        Tilesheet.prototype.generatePalettedImage = function (palette) {
            if (!this.image.complete) {
                throw new Error("Tilesheets::generatePalettedImage: image is not fully loaded yet.");
            }
            var referencePalette = this.getReferencePalette();
            var _a = this.initNewCanvasWithImage(), palettedImage = _a.canvas, ctx = _a.ctx, imageData = _a.imageData;
            var pixelData = imageData.data;
            for (var i = 0, l = pixelData.length; i < l; i += 4) {
                var red = pixelData[i];
                var green = pixelData[i + 1];
                var blue = pixelData[i + 2];
                var alpha = pixelData[i + 3];
                var color = [red, green, blue, alpha];
                var index = referencePalette.getIndexFromColor(color);
                if (index < 0) {
                    continue;
                }
                var _b = __read$1(palette.getColorByIndex(index), 4), newRed = _b[0], newGreen = _b[1], newBlue = _b[2], newAlpha = _b[3];
                pixelData[i] = newRed;
                pixelData[i + 1] = newGreen;
                pixelData[i + 2] = newBlue;
                pixelData[i + 3] = newAlpha;
            }
            ctx.putImageData(imageData, 0, 0);
            this.palettedImages.set(palette, palettedImage);
            return palettedImage;
        };
        Tilesheet.prototype.getImage = function (paletteToUse) {
            if (!paletteToUse) {
                return this.image;
            }
            if (!this.palettedImages.has(paletteToUse)) {
                return this.generatePalettedImage(paletteToUse);
            }
            return this.palettedImages.get(paletteToUse);
        };
        Tilesheet.prototype.getTileRect = function (tileIndex) {
            if (!this.image.complete) {
                throw new Error("Tilesheets::getTileRect: image is not fully loaded yet.");
            }
            var naturalWidth = this.image.naturalWidth;
            var totalTilesOnRow = Math.ceil(naturalWidth / (this.tileWidth + this.margin));
            var row = Math.floor(tileIndex / totalTilesOnRow);
            var column = tileIndex % totalTilesOnRow;
            return __assign({ x: column * this.tileWidth + column * this.margin, y: row * this.tileHeight + row * this.margin }, this.getTileSize());
        };
        Tilesheet.prototype.getTileStyle = function (tileIndex) {
            if (!this.image.complete) {
                throw new Error("Tilesheets::getTileStyle: image is not fully loaded yet.");
            }
            var rectangle = this.getTileRect(tileIndex);
            return {
                display: "inline-block",
                width: "".concat(rectangle.width, "px"),
                height: "".concat(rectangle.height, "px"),
                backgroundImage: "url(".concat(this.image.src, ")"),
                backgroundPosition: "-".concat(rectangle.x, "px -").concat(rectangle.y, "px"),
            };
        };
        Tilesheet.prototype.getTileDomElement = function (tileIndex) {
            if (!this.image.complete) {
                throw new Error("Tilesheets::getTileDomElement: image is not fully loaded yet.");
            }
            var domElement = document.createElement("span");
            var tileStyle = this.getTileStyle(tileIndex);
            Object.keys(tileStyle).forEach(function (styleProp) {
                domElement.style[styleProp] =
                    tileStyle[styleProp];
            });
            return domElement;
        };
        Tilesheet.prototype.initNewCanvasWithImage = function () {
            var canvas = document.createElement("canvas");
            var ctx = canvas.getContext("2d");
            var _a = this.image, width = _a.width, height = _a.height;
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(this.image, 0, 0, width, height);
            var imageData = ctx.getImageData(0, 0, width, height);
            return { canvas: canvas, ctx: ctx, imageData: imageData };
        };
        Tilesheet.prototype.getReferencePalette = function () {
            if (!this.image.complete) {
                throw new Error("Tilesheets::getReferencePalette: image is not fully loaded yet.");
            }
            if (this.referencePalette) {
                return this.referencePalette;
            }
            var referencePalette = new Palette();
            this.setReferencePalette(referencePalette);
            var imageData = this.initNewCanvasWithImage().imageData;
            var pixelData = imageData.data;
            for (var i = 0, l = pixelData.length; i < l; i += 4) {
                var red = pixelData[i];
                var green = pixelData[i + 1];
                var blue = pixelData[i + 2];
                var alpha = pixelData[i + 3];
                referencePalette.addColor([red, green, blue, alpha]);
            }
            return referencePalette;
        };
        Tilesheet.prototype.setReferencePalette = function (palette) {
            this.referencePalette = palette;
            return this;
        };
        Tilesheet.prototype.waitForLoading = function () {
            return __awaiter$2(this, void 0, void 0, function () {
                var _this = this;
                return __generator$2(this, function (_a) {
                    if (this.image.src && this.image.complete) {
                        return [2];
                    }
                    return [2, new Promise(function (resolve, reject) {
                            _this.image.addEventListener("load", resolve);
                            _this.image.addEventListener("error", reject);
                        })];
                });
            });
        };
        return Tilesheet;
    }());

    var favicon = (function (sheet, palettes) {
        var faviconCanvas = document.createElement("canvas");
        faviconCanvas.width = 16;
        faviconCanvas.height = 16;
        var faviconCtx = faviconCanvas.getContext("2d");
        var canvas = document.createElement("canvas");
        var sprite = new Sprite(canvas);
        var link = document.createElement("link");
        link.type = "image/x-icon";
        link.rel = "shortcut icon";
        document.getElementsByTagName("head")[0].appendChild(link);
        document.body.addEventListener("click", function (e) {
            var target = e.target;
            if (!target.dataset.palette) {
                return;
            }
            var paletteIndex = Number(target.dataset.palette);
            sprite.usePalette(palettes[paletteIndex]).render();
            renderFavicon();
            e.preventDefault();
        });
        function renderFavicon() {
            if (faviconCtx) {
                faviconCtx.clearRect(0, 0, 16, 16);
                faviconCtx.drawImage(canvas, 0, 0);
                link.href = faviconCanvas.toDataURL();
            }
        }
        sprite.useTilesheet(sheet).usePalette(palettes[1]).playAnimation("hourray");
        window.setInterval(renderFavicon, 300);
        renderFavicon();
    });

    var tilesheetBushSample = (function (sheetSpring, sheetFall) {
        var bushTile = sheetSpring.getTileDomElement(5);
        document.getElementById("bush_sample").appendChild(bushTile);
        var bush = new Sprite(document.getElementById("canvas_bush_sample"));
        bush.useTilesheet(sheetSpring).setCurrentTile(5).render();
        var bush2 = new Sprite(document.getElementById("canvas_bush_sample2"));
        bush2.useTilesheet(sheetFall).setCurrentTile(5).render();
    });

    var tilesheetIndexSample = (function (sheetSpring) {
        var table = document.getElementById("tilesheet_index_sample");
        if (!table) {
            return;
        }
        var image = sheetSpring.getImage();
        table.style.backgroundImage = "linear-gradient(rgba(255, 255, 255, .7), rgba(255, 255, 255, .7)), url(".concat(image.src, ")");
        table.style.width = "".concat(image.naturalWidth, "px");
        table.style.height = "".concat(image.naturalHeight, "px");
        var rowsFragment = document.createDocumentFragment();
        var tileIndex = 0;
        for (var row = 0; row <= 7; row++) {
            var columnsFragment = document.createDocumentFragment();
            for (var column = 0; column <= 6; column++) {
                var td = document.createElement("td");
                td.appendChild(document.createTextNode("".concat(tileIndex)));
                columnsFragment.appendChild(td);
                tileIndex++;
            }
            var tr = document.createElement("tr");
            tr.appendChild(columnsFragment);
            rowsFragment.appendChild(tr);
        }
        table.appendChild(rowsFragment);
    });

    var tilesheetAdvanced = (function (sheetSpring, sheetSummer, sheetFall, sheetWinter) {
        var scene = new Scene([
            [
                28, 29, 28, 29, 21, 22, 28, 29, 21, 22, 21, 22, 28, 29, 0, 0, 11, 42,
                47, 47,
            ],
            [8, 25, 26, 27, 28, 29, 5, 5, 28, 29, 28, 29, 5, 5, 5, 6, 5, 42, 47, 47],
            [4, 32, 33, 34, 21, 22, 8, 8, 2, 3, 4, 21, 22, 17, 13, 5, 5, 42, 47, 47],
            [
                17, 14, 14, 14, 28, 29, 8, 8, 9, 10, 7, 28, 29, 36, 36, 36, 36, 51, 47,
                47,
            ],
            [
                21, 22, 23, 24, 13, 13, 3, 3, 10, 10, 0, 11, 42, 38, 38, 38, 47, 47, 47,
                47,
            ],
            [
                28, 29, 30, 31, 13, 21, 22, 6, 1, 10, 0, 11, 42, 38, 38, 38, 47, 47, 47,
                47,
            ],
            [22, 2, 3, 3, 7, 28, 29, 6, 1, 7, 7, 18, 42, 45, 46, 45, 35, 50, 50, 50],
            [29, 16, 7, 7, 0, 1, 1, 21, 22, 21, 22, 8, 42, 45, 45, 46, 44, 8, 8, 8],
            [21, 22, 9, 0, 0, 0, 7, 28, 29, 28, 29, 21, 22, 50, 50, 50, 8, 2, 3, 3],
        ], document.getElementById("canvas_advanced"));
        var activeButton;
        function switchSeason(season) {
            var seasonToTilesheet = {
                spring: sheetSpring,
                summer: sheetSummer,
                fall: sheetFall,
                winter: sheetWinter,
            };
            activeButton = document.querySelector("[data-season=\"".concat(season, "\"]"));
            if (!activeButton) {
                return;
            }
            activeButton.disabled = true;
            activeButton.classList.add("is-outlined");
            scene.resetTiles().useTilesheet(seasonToTilesheet[season]).render();
        }
        document.body.addEventListener("click", function (e) {
            var target = e.target;
            if (!target.dataset.season || !activeButton) {
                return;
            }
            activeButton.disabled = false;
            activeButton.classList.remove("is-outlined");
            switchSeason(target.dataset.season);
            e.preventDefault();
        });
        switchSeason("spring");
    });

    var sceneSample = (function (sheetSpring, sheetWinter) {
        var tiles = [
            [21, 22, 23, 24, 9],
            [28, 29, 30, 31, 9],
            [22, 5, 3, 6, 10],
            [29, 5, 17, 17, 18],
        ];
        var springSceneCanvas = document.getElementById("scene_sample");
        var mySpringScene = new Scene(tiles, springSceneCanvas);
        mySpringScene.useTilesheet(sheetSpring).render();
        var winterSceneCanvas = document.getElementById("scene_sample_winter");
        var myWinterScene = new Scene(tiles, winterSceneCanvas);
        myWinterScene.useTilesheet(sheetWinter).render();
        var tilesWithSomeAnimation = [
            [1, 1, 1, 1, 1],
            [17, 17, 17, 17, 17],
            [36, 36, 36, 36, 36],
            [38, 38, 38, 38, 38],
        ];
        var animatedSceneCanvas = document.getElementById("scene_sample_animation");
        var myAnimatedScene = new Scene(tilesWithSomeAnimation, animatedSceneCanvas);
        myAnimatedScene.useTilesheet(sheetSpring).render();
    });

    var spriteAnimated = (function (sheetSpring) {
        var flowers = new Sprite(document.getElementById("canvas_sprite_animated"));
        flowers.useTilesheet(sheetSpring).playAnimation("flower").render();
        var advancedSprite = new Sprite(document.getElementById("canvas_sprite_animated_advanced"));
        advancedSprite.useTilesheet(sheetSpring);
        var activeButton;
        function switchAnimation(newAnimation) {
            var possibleAnimations = ["water", "flower"];
            activeButton = document.querySelector("[data-animation=\"".concat(newAnimation, "\"]"));
            if (!activeButton) {
                return;
            }
            activeButton.disabled = true;
            activeButton.classList.add("is-outlined");
            if (possibleAnimations.indexOf(newAnimation) >= 0) {
                advancedSprite.playAnimation(newAnimation).render();
            }
            else {
                advancedSprite.stopAnimation();
            }
        }
        document.body.addEventListener("click", function (e) {
            var target = e.target;
            if (!target.dataset.animation || !activeButton) {
                return;
            }
            activeButton.disabled = false;
            activeButton.classList.remove("is-outlined");
            switchAnimation(target.dataset.animation);
            e.preventDefault();
        });
        switchAnimation("flower");
    });

    var __awaiter$1 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    var __generator$1 = (undefined && undefined.__generator) || function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
        return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (g && (g = 0, op[0] && (_ = 0)), _) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    };
    var palettedSprite = (function (sheetYoshi, palettes) { return __awaiter$1(void 0, void 0, void 0, function () {
        function switchPalette(paletteIndex) {
            activeButton = document.querySelector("[data-palette=\"".concat(paletteIndex, "\"]"));
            if (!activeButton) {
                return;
            }
            activeButton.disabled = true;
            activeButton.classList.add("is-outlined");
            palettedSprite.usePalette(palettes[paletteIndex]).render();
        }
        var spriteYoshiAnimated, spriteYellowYoshiAnimated, palettedSprite, activeButton;
        return __generator$1(this, function (_a) {
            spriteYoshiAnimated = new Sprite(document.getElementById("canvas_sprite_yoshi_animated"));
            spriteYoshiAnimated.useTilesheet(sheetYoshi).playAnimation("hourray");
            spriteYellowYoshiAnimated = new Sprite(document.getElementById("canvas_sprite_yellow_yoshi_animated"));
            spriteYellowYoshiAnimated
                .useTilesheet(sheetYoshi)
                .usePalette(palettes[1])
                .playAnimation("hourray");
            palettedSprite = new Sprite(document.getElementById("canvas_paletted_sprite"));
            document.body.addEventListener("click", function (e) {
                var target = e.target;
                if (!target.dataset.palette || !activeButton) {
                    return;
                }
                activeButton.disabled = false;
                activeButton.classList.remove("is-outlined");
                switchPalette(Number(target.dataset.palette));
                e.preventDefault();
            });
            palettedSprite.useTilesheet(sheetYoshi).playAnimation("hourray");
            switchPalette(1);
            return [2];
        });
    }); });

    var img$9 = "data:image/png;base64,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";

    var img$8 = "data:image/png;base64,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";

    var img$7 = "data:image/png;base64,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";

    var img$6 = "data:image/png;base64,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";

    var img$5 = "data:image/png;base64,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";

    var img$4 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAKCAIAAABJ+IsHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAB0SURBVDhPY5zy+z8DEnh+A8qAgB/3r0NZYNDjeQzKgoJeKA0G91H1KkpAGVBwHEpDABOUpjsYtZhugPF/pheUCQb7PkAZEOC0aCuUBQUvoDQEfHgPZUDAjftQBhhopZZAWWBQc/galAUGo3FMNzBAFjMwAABjxxh8RO0lUAAAAABJRU5ErkJggg==";

    var img$3 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAKCAIAAABJ+IsHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAABZSURBVDhPYyj+nY2MLB9bIiPNTZrI6P/hYygoMRkFMTCgoNfFKAioHQmNWjwCLP6f6YWM9kaioP+//6Oi5yjo9TUUdHgrMtLU0ERGS1//R0ajFg93i1//BwAV6wP1Uqc9hAAAAABJRU5ErkJggg==";

    var img$2 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAKCAIAAABJ+IsHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAB3SURBVDhPY/zfVMyABF5cfw5lgcHWFy+gLAhYtBTKAIP7D+5DWWBw//gxKAsMliaiGMVwfBuUAQZMUJruYNRiugHG/5leUCYY7PsAZUCA06KtUBYUoKa1D++hDAi4gZLWtFJLoCwwqDl8DcoCg9E4phsYIIsZGABsKR18+/x9eAAAAABJRU5ErkJggg==";

    var img$1 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAKCAIAAABJ+IsHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAB5SURBVDhPY/z/W5MBGVwwhDIgYN06KAMM9jWthbLA4P6H51AWGJy/cR7KAoMpGvugLAg4DqUhgAlK0x2MWkw3wPg/0wvKBIN9H6AMCHBatBXKgoIXUBoCPryHMiDgxn0oAwy0UkugLDCoOXwNygKD0TimGxggixkYAM0oGnxaS+G0AAAAAElFTkSuQmCC";

    var img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAKCAYAAADGmhxQAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAALiIAAC4iAari3ZIAAAAHdElNRQfjCAwJNwcnEDntAAAAGXRFWHRDb21tZW50AENyZWF0ZWQgd2l0aCBHSU1QV4EOFwAAAIJJREFUOE9jXGa69j8DGrj5/xKUhQD3ft6DshDg04IsKAsBHj14CmUhwKeLmOYJnLCAshDgG+cdKAsBmKD0oAWjDqQUDHoHMur1LcLIJPxXj0NZCHBoxjQoCxm8gNJI4MN7KAMJ3LgPZSCAVmoJlIUANYevQVkIMBrFlIJRB1IGGBgAGlQfqruTXkQAAAAASUVORK5CYII=";

    var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
        return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (g && (g = 0, op[0] && (_ = 0)), _) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    };
    var __read = (undefined && undefined.__read) || function (o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    };
    var __spreadArray = (undefined && undefined.__spreadArray) || function (to, from, pack) {
        if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
            if (ar || !(i in from)) {
                if (!ar) ar = Array.prototype.slice.call(from, 0, i);
                ar[i] = from[i];
            }
        }
        return to.concat(ar || Array.prototype.slice.call(from));
    };
    (function () { return __awaiter(void 0, void 0, void 0, function () {
        var sheetSpring, sheetSummer, sheetFall, sheetWinter, sheetYoshi, sheetGreenYoshiPalette, sheetYellowYoshiPalette, sheetRedYoshiPalette, sheetBlueYoshiPalette, sheetCustomYoshiPalette, animationSpeed, waterAnimation, driedWater1Animation, driedWater2Animation, frozenWaterAnimation, flowersAnimation, yoshiAnimation, allSheets, paletteSheets, yoshiPalettes;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sheetSpring = new Tilesheet(img$9);
                    sheetSummer = new Tilesheet(img$8);
                    sheetFall = new Tilesheet(img$7);
                    sheetWinter = new Tilesheet(img$6);
                    sheetYoshi = new Tilesheet(img$5);
                    sheetGreenYoshiPalette = new Tilesheet(img$3);
                    sheetYellowYoshiPalette = new Tilesheet(img$1);
                    sheetRedYoshiPalette = new Tilesheet(img$2);
                    sheetBlueYoshiPalette = new Tilesheet(img$4);
                    sheetCustomYoshiPalette = new Tilesheet(img);
                    animationSpeed = 300;
                    waterAnimation = {
                        tiles: [38, 39, 40, 41],
                        speed: animationSpeed,
                        name: "water",
                    };
                    driedWater1Animation = {
                        tiles: [45, 39],
                        speed: animationSpeed,
                    };
                    driedWater2Animation = {
                        tiles: [46, 39],
                        speed: animationSpeed,
                    };
                    frozenWaterAnimation = {
                        tiles: [47, 39],
                        speed: animationSpeed,
                    };
                    flowersAnimation = {
                        tiles: [1, 12, 19, 20],
                        speed: animationSpeed,
                        name: "flower",
                    };
                    yoshiAnimation = {
                        tiles: [0, 1],
                        speed: animationSpeed,
                        name: "hourray",
                    };
                    sheetSpring.setAnimations([
                        waterAnimation,
                        driedWater1Animation,
                        driedWater2Animation,
                        frozenWaterAnimation,
                        flowersAnimation,
                    ]);
                    sheetSummer.setAnimations([
                        waterAnimation,
                        frozenWaterAnimation,
                        flowersAnimation,
                    ]);
                    sheetFall.setAnimations([
                        waterAnimation,
                        driedWater1Animation,
                        driedWater2Animation,
                        frozenWaterAnimation,
                    ]);
                    sheetWinter.setAnimations([
                        waterAnimation,
                        driedWater1Animation,
                        driedWater2Animation,
                    ]);
                    sheetYoshi.setAnimations([yoshiAnimation]);
                    allSheets = [sheetSpring, sheetSummer, sheetFall, sheetWinter];
                    paletteSheets = [
                        sheetGreenYoshiPalette,
                        sheetYellowYoshiPalette,
                        sheetRedYoshiPalette,
                        sheetBlueYoshiPalette,
                        sheetCustomYoshiPalette,
                    ];
                    allSheets.forEach(function (sheet) {
                        sheet.setTileSize(16).setMargin(1);
                    });
                    paletteSheets.forEach(function (sheet) {
                        sheet.setTileSize(5).setMargin(0);
                    });
                    sheetYoshi.setTileSize(25, 32).setMargin(1);
                    allSheets.push.apply(allSheets, __spreadArray([sheetYoshi], __read(paletteSheets), false));
                    return [4, Promise.all(allSheets.map(function (sheet) { return sheet.waitForLoading(); }))];
                case 1:
                    _a.sent();
                    sheetYoshi.setReferencePalette(sheetGreenYoshiPalette.getReferencePalette());
                    yoshiPalettes = paletteSheets.map(function (palette) {
                        return palette.getReferencePalette();
                    });
                    favicon(sheetYoshi, yoshiPalettes);
                    tilesheetIndexSample(sheetSpring);
                    tilesheetBushSample(sheetSpring, sheetFall);
                    spriteAnimated(sheetSpring);
                    palettedSprite(sheetYoshi, yoshiPalettes);
                    sceneSample(sheetSpring, sheetWinter);
                    tilesheetAdvanced(sheetSpring, sheetSummer, sheetFall, sheetWinter);
                    return [2];
            }
        });
    }); })();

})();
