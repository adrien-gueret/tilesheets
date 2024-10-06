import { Sprite } from "../../";
import type { Tilesheet } from "../../";

export default (sheetSpring: Tilesheet, sheetFall: Tilesheet) => {
  const bushTile = sheetSpring.getTileDomElement(5);
  document.getElementById("bush_sample")!.appendChild(bushTile);

  const bush = new Sprite(
    document.getElementById("canvas_bush_sample") as HTMLCanvasElement
  );
  bush.useTilesheet(sheetSpring).setCurrentTile(5).render();

  const bush2 = new Sprite(
    document.getElementById("canvas_bush_sample2") as HTMLCanvasElement
  );
  bush2.useTilesheet(sheetFall).setCurrentTile(5).render();
};
