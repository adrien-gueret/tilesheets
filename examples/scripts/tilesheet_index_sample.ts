export default (sheetSpring) => {
    const table = document.getElementById('tilesheet_index_sample');
    
    table.style.backgroundImage = `linear-gradient(rgba(255, 255, 255, .7), rgba(255, 255, 255, .7)), url(${sheetSpring.image.src})`;
    table.style.width = `${sheetSpring.image.naturalWidth}px`;
    table.style.height = `${sheetSpring.image.naturalHeight}px`;

    const rowsFragment = document.createDocumentFragment();
    let tileIndex = 0;
    
    for (let row = 0; row <= 7; row++) {
        const columnsFragment = document.createDocumentFragment();

        for (let column = 0; column <= 6; column++) {
            const td = document.createElement('td');
            td.appendChild(document.createTextNode(`${tileIndex}`));
            columnsFragment.appendChild(td);
            tileIndex++;
        }

        const tr = document.createElement('tr');
        tr.appendChild(columnsFragment);

        rowsFragment.appendChild(tr);
    }

    table.appendChild(rowsFragment);
};