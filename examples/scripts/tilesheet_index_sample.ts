import type { Tilesheet } from "../../";

export default (sheetSpring: Tilesheet) => {
  const table = document.getElementById("tilesheet_index_sample");

  if (!table) {
    return;
  }

  const image = sheetSpring.getImage() as HTMLImageElement;

  table.style.backgroundImage = `linear-gradient(rgba(255, 255, 255, .7), rgba(255, 255, 255, .7)), url(${image.src})`;
  table.style.width = `${image.naturalWidth}px`;

  table.style.height = `${image.naturalHeight}px`;

  const rowsFragment = document.createDocumentFragment();
  let tileIndex = 0;

  for (let row = 0; row <= 7; row++) {
    const columnsFragment = document.createDocumentFragment();

    for (let column = 0; column <= 6; column++) {
      const td = document.createElement("td");
      td.appendChild(document.createTextNode(`${tileIndex}`));
      columnsFragment.appendChild(td);
      tileIndex++;
    }

    const tr = document.createElement("tr");
    tr.appendChild(columnsFragment);

    rowsFragment.appendChild(tr);
  }

  table.appendChild(rowsFragment);
};
