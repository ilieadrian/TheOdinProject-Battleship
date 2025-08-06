console.log("Hello from dom control")

export function renderBoard(board, container, showShips = false) {
  container.innerHTML = '';
  for (let x = 0; x < board.length; x++) {
    for (let y = 0; y < board[x].length; y++) {
      const cell = document.createElement('div');
      cell.dataset.x = x;
      cell.dataset.y = y;
      cell.classList.add('w-8', 'h-8', 'border', 'border-gray-400');

      const value = board[x][y];
      if (value === 'miss') cell.classList.add('bg-blue-300');
      else if (value === 'hit') cell.classList.add('bg-red-400');
      else if (typeof value === 'object' && showShips) cell.classList.add('bg-green-400');
      else cell.classList.add('bg-white');

      container.appendChild(cell);
    }
  }
}
