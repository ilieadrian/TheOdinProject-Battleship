// function renderBoard(board, container, showShips = false) {
//   container.innerHTML = '';
//   for (let x = 0; x < 10; x++) {
//     for (let y = 0; y < 10; y++) {
//       const cell = document.createElement('div');
//       cell.dataset.x = x;
//       cell.dataset.y = y;
//       cell.classList.add('cell');

//       const value = board[x][y];
//       if (value === 'miss') cell.classList.add('miss');
//       else if (value === 'hit') cell.classList.add('hit');
//       else if (typeof value === 'object' && showShips) cell.classList.add('ship');

//       container.appendChild(cell);
//     }
//   }
// }

// export default { renderBoard };
