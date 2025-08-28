export class DOMController {
        constructor(gameInstance) {
        this.gameInstance = gameInstance;
    }
} 


// export class DOMManager {
//   constructor(gameManager) {
//     this.gameManager = gameManager;
//   }

//   createGameboard(player, isEnemy = false) {
//     const container = document.createElement('div');
//     container.className = `gameboard ${isEnemy ? 'enemy-board' : 'player-board'}`;
    
//     const title = document.createElement('h3');
//     title.textContent = isEnemy ? 'Enemy Waters' : 'Your Fleet';
//     container.appendChild(title);
    
//     const board = document.createElement('div');
//     board.className = 'board-grid';
    
//     for (let y = 0; y < 10; y++) {
//       for (let x = 0; x < 10; x++) {
//         const cell = document.createElement('div');
//         cell.className = 'cell';
//         cell.dataset.x = x;
//         cell.dataset.y = y;
        
//         if (isEnemy) {
//           cell.addEventListener('click', () => this.handleEnemyCellClick(x, y));
//           cell.style.cursor = 'crosshair';
//         }
        
//         board.appendChild(cell);
//       }
//     }
    
//     container.appendChild(board);
//     return container;
//   }

//   updateDisplay() {
//     const playerBoard = document.getElementById('player-board');
//     const enemyBoard = document.getElementById('enemy-board');
    
//     if (playerBoard) {
//       this.renderGameboard(this.gameManager.getPlayer().getGameboard(), playerBoard, true);
//     }
    
//     if (enemyBoard) {
//       this.renderGameboard(this.gameManager.getComputer().getGameboard(), enemyBoard, false);
//     }

//     // Update game status
//     this.updateGameStatus();
//   }

//   renderGameboard(gameboard, container, showShips = false) {
//     const cells = container.querySelectorAll('.cell');
    
//     cells.forEach(cell => {
//       const x = parseInt(cell.dataset.x);
//       const y = parseInt(cell.dataset.y);
      
//       // Clear previous classes
//       cell.className = 'cell';
      
//       const ship = gameboard.getShipAt(x, y);
//       const hasBeenAttacked = gameboard.hasBeenAttacked(x, y);
      
//       if (hasBeenAttacked) {
//         if (ship) {
//           cell.classList.add('hit');
//           if (ship.isSunk()) {
//             cell.classList.add('sunk');
//           }
//         } else {
//           cell.classList.add('miss');
//         }
//       } else if (showShips && ship) {
//         cell.classList.add('ship');
//       }
//     });
//   }

//    setupGame() {
//     const gameContainer = document.getElementById('game-container');
//     if (!gameContainer) {
//       console.error('Game container not found');
//       return;
//     }

//     // Clear existing content
//     gameContainer.innerHTML = '';

//     // Create game status
//     const statusDiv = document.createElement('div');
//     statusDiv.id = 'game-status';
//     statusDiv.className = 'game-status';
//     gameContainer.appendChild(statusDiv);

//     // Create game controls
//     const controlsDiv = document.createElement('div');
//     controlsDiv.className = 'game-controls';
    
//     const newGameButton = document.createElement('button');
//     newGameButton.textContent = 'New Game';
//     newGameButton.id = 'new-game-btn';
//     newGameButton.addEventListener('click', () => {
//       this.gameManager.resetGame();
//       this.setupGame();
//     });
    
//     controlsDiv.appendChild(newGameButton);
//     gameContainer.appendChild(controlsDiv);

//     // Create boards container
//     const boardsContainer = document.createElement('div');
//     boardsContainer.className = 'boards-container';

//     // Create player board
//     const playerBoardContainer = this.createGameboard(this.gameManager.getPlayer(), false);
//     playerBoardContainer.id = 'player-board';
//     boardsContainer.appendChild(playerBoardContainer);

//     // Create enemy board
//     const enemyBoardContainer = this.createGameboard(this.gameManager.getComputer(), true);
//     enemyBoardContainer.id = 'enemy-board';
//     boardsContainer.appendChild(enemyBoardContainer);

//     gameContainer.appendChild(boardsContainer);

//     // Initial display update
//     this.updateDisplay();
//   }
// }