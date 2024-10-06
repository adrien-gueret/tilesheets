import { Sprite } from "../../";
import type { Tilesheet, Palette } from "../../";

export default (sheet: Tilesheet, palettes: Array<Palette>) => {
  const faviconCanvas = document.createElement("canvas");
  faviconCanvas.width = 16;
  faviconCanvas.height = 16;
  const faviconCtx = faviconCanvas.getContext("2d");

  const canvas = document.createElement("canvas");
  const sprite = new Sprite(canvas);

  const link = document.createElement("link");
  link.type = "image/x-icon";
  link.rel = "shortcut icon";

  document.getElementsByTagName("head")[0].appendChild(link);

  document.body.addEventListener("click", (e) => {
    const target = e.target as HTMLButtonElement;

    if (!target.dataset.palette) {
      return;
    }

    const paletteIndex = Number(target.dataset.palette);
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
};
