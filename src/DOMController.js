export class DOMController {
        constructor(gameInstance) {
        this.gameInstance = gameInstance;
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

  handleEnemyCellClick(x, y) {
    if (this.gameInstance.isGameOver()) {
      return;
    }

    if (this.gameInstance.getCurrentPlayer() !== this.gameInstance.getPlayer()) {
      return;
    }

    try {
      const result = this.gameInstance.playerAttack(x, y);
      this.updateDisplay();
      
      // If game not over and it's computer's turn, make computer move
      if (!this.gameInstance.isGameOver() && this.gameInstance.getCurrentPlayer() === this.gameInstance.getComputer()) {
        setTimeout(() => {
          this.gameInstance.computerTurn();
          this.updateDisplay();
        }, 1000);
      }
      
    } catch (error) {
      console.log('Invalid move:', error.message);
    }
  }



    renderGameboard(gameboard, container, showShips = false) {
    const cells = container.querySelectorAll('.cell');
    
    cells.forEach(cell => {
      const x = parseInt(cell.dataset.x);
      const y = parseInt(cell.dataset.y);
      
      cell.className = 'cell';
      
      const ship = gameboard.getShipAt(x, y);
      const hasBeenAttacked = gameboard.hasBeenAttacked(x, y);
      
      if (hasBeenAttacked) {
        if (ship) {
          cell.classList.add('hit');
          if (ship.isSunk()) {
            cell.classList.add('sunk');
          }
        } else {
          cell.classList.add('miss');
        }
      } else if (showShips && ship) {
        cell.classList.add('ship');
      }
    });
  }

updateDisplay() {
    const playerBoard = document.getElementById('player-board');
    const enemyBoard = document.getElementById('enemy-board');
    
    if (playerBoard) {
      this.renderGameboard(this.gameInstance.getPlayer().getGameboard(), playerBoard, true);
    }
    
    if (enemyBoard) {
      this.renderGameboard(this.gameInstance.getComputer().getGameboard(), enemyBoard, true); //move to false after debuging
    }

    // Update game status
    this.updateGameStatus();
  }

  updateGameStatus() {
    const statusElement = document.getElementById('game-status');
    if (!statusElement) return;
    
    if (this.gameInstance.isGameOver()) {
      const winner = this.gameInstance.getWinner();
      statusElement.textContent = `Game Over! ${winner.getName()} wins!`;
      statusElement.className = 'game-status game-over';
    } else {
      const currentPlayer = this.gameInstance.getCurrentPlayer();
      if (currentPlayer === this.gameInstance.getPlayer()) {
        statusElement.textContent = 'Your turn - Click on enemy waters to attack!';
        statusElement.className = 'game-status player-turn';
      } else {
        statusElement.textContent = 'Computer is thinking...';
        statusElement.className = 'game-status computer-turn';
      }
    }
  }

  setupGame() {
    const gameContainer = document.getElementById('game-container');
    if (!gameContainer) {
      console.error('Game container not found');
      return;
    }

    // Clear existing content
    gameContainer.innerHTML = '';

    const statusDiv = document.createElement('div');
    statusDiv.id = 'game-status';
    statusDiv.className = 'game-status';
    gameContainer.appendChild(statusDiv);

    // Game controls
    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'game-controls';
    
    const newGameButton = document.createElement('button');
    newGameButton.textContent = 'New Game';
    newGameButton.id = 'new-game-btn';
    newGameButton.addEventListener('click', () => {
      this.gameInstance.resetGame();
      this.setupGame();
    });
    
    controlsDiv.appendChild(newGameButton);
    gameContainer.appendChild(controlsDiv);

    // Boards container
    const boardsContainer = document.createElement('div');
    boardsContainer.className = 'boards-container';

    // Player board
    const playerBoardContainer = this.createGameboard(this.gameInstance.getPlayer(), false);
    playerBoardContainer.id = 'player-board';
    boardsContainer.appendChild(playerBoardContainer);

    // Enemy board
    const enemyBoardContainer = this.createGameboard(this.gameInstance.getComputer(), true);
    enemyBoardContainer.id = 'enemy-board';
    boardsContainer.appendChild(enemyBoardContainer);

    gameContainer.appendChild(boardsContainer);

    // Initial display update
    this.updateDisplay();
  }
} 


