import { Sprite } from "../../";
import type { Tilesheet } from "../../";

export default (sheetSpring: Tilesheet) => {
  const flowers = new Sprite(
    document.getElementById("canvas_sprite_animated") as HTMLCanvasElement
  );

  flowers.useTilesheet(sheetSpring).playAnimation("flower").render();

  const advancedSprite = new Sprite(
    document.getElementById(
      "canvas_sprite_animated_advanced"
    ) as HTMLCanvasElement
  );
  advancedSprite.useTilesheet(sheetSpring);

  let activeButton: HTMLButtonElement | null;

  function switchAnimation(newAnimation: string) {
    const possibleAnimations = ["water", "flower"];

    activeButton = document.querySelector(`[data-animation="${newAnimation}"]`);

    if (!activeButton) {
      return;
    }

    activeButton.disabled = true;
    activeButton.classList.add("is-outlined");

    if (possibleAnimations.indexOf(newAnimation) >= 0) {
      advancedSprite.playAnimation(newAnimation).render();
    } else {
      advancedSprite.stopAnimation();
    }
  }

  document.body.addEventListener("click", (e) => {
    const target = e.target as HTMLButtonElement;

    if (!target.dataset.animation || !activeButton) {
      return;
    }

    activeButton.disabled = false;
    activeButton.classList.remove("is-outlined");

    switchAnimation(target.dataset.animation);

    e.preventDefault();
  });

  switchAnimation("flower");
};
