console.log("Hello from dom control")
export class DOMManager {
  constructor(gameManager) {
    this.gameManager = gameManager;
  }

  createGameboard(player, isEnemy = false) {
    const container = document.createElement('div');
    container.className = `gameboard ${isEnemy ? 'enemy-board' : 'player-board'}`;
    
    const title = document.createElement('h3');
    title.textContent = isEnemy ? 'Enemy Waters' : 'Your Fleet';
    container.appendChild(title);
    
    const board = document.createElement('div');
    board.className = 'board-grid';
    
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.x = x;
        cell.dataset.y = y;
        
        if (isEnemy) {
          cell.addEventListener('click', () => this.handleEnemyCellClick(x, y));
          cell.style.cursor = 'crosshair';
        }
        
        board.appendChild(cell);
      }
    }
    
    container.appendChild(board);
    return container;
  }
}