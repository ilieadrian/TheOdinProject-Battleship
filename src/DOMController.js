export class DOMController {
  constructor(gameInstance) {
    this.gameInstance = gameInstance;
    this.draggedShip = null;
    this.currentShipOrientation = 'horizontal'; // 'horizontal' or 'vertical'
    this.placedShips = new Set(); // Track which ships have been placed
  }

  // createEmptyGameBoard(isShipBoard = false){
  //   const container = document.createElement("div");
  //   container.className = "gameboard";

  //   const title = document.createElement("h3");
  //   title.textContent = isShipBoard ? "Drag ship to board" : "Your board";
  //   container.appendChild(title);

  //   const board = document.createElement("div");
  //   board.className = "board-grid";

  //   for (let y = 0; y < 10; y++) {
  //     for (let x = 0; x < 10; x++) {
  //       const cell = document.createElement("div");
  //       cell.className = "cell";
  //       cell.dataset.x = x;
  //       cell.dataset.y = y;

  //       board.appendChild(cell);
  //     }
  //   }

  //   container.appendChild(board);
  //   return container;
  // }

   createEmptyGameBoard(isShipBoard = false) {
    const container = document.createElement("div");
    container.className = "gameboard";
    
    const title = document.createElement("h3");
    title.textContent = isShipBoard ? "Drag ships to your board" : "Your Fleet";
    container.appendChild(title);

    if (isShipBoard) {
      // Add orientation toggle button for ship container
      const orientationButton = document.createElement("button");
      orientationButton.textContent = "Rotate Ships";
      orientationButton.className = "orientation-btn";
      orientationButton.addEventListener("click", () => this.toggleShipOrientation());
      container.appendChild(orientationButton);

      // Create ship container instead of board grid
      const shipContainer = this.createShipContainer();
      container.appendChild(shipContainer);
    } else {
      // Create the board grid for player board
      const board = document.createElement("div");
      board.className = "board-grid";
      
      // Make board a drop zone
      board.addEventListener("dragover", (e) => this.handleDragOver(e));
      board.addEventListener("drop", (e) => this.handleDrop(e));

      for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10; x++) {
          const cell = document.createElement("div");
          cell.className = "cell";
          cell.dataset.x = x;
          cell.dataset.y = y;
          board.appendChild(cell);
        }
      }
      container.appendChild(board);
    }

    return container;
  }

  createShipContainer() {
    const shipContainer = document.createElement("div");
    shipContainer.className = "ship-container";

    // Standard Battleship ships: [length, name]
    const ships = [
      [5, "Carrier"],
      [4, "Battleship"], 
      [3, "Cruiser"],
      [3, "Submarine"],
      [2, "Destroyer"]
    ];

    ships.forEach((shipInfo, index) => {
      const [length, name] = shipInfo;
      const shipElement = this.createDraggableShip(length, name, index);
      shipContainer.appendChild(shipElement);
    });

    return shipContainer;
  }

  createDraggableShip(length, name, shipId) {
    const shipWrapper = document.createElement("div");
    shipWrapper.className = "ship-wrapper";

    const shipLabel = document.createElement("div");
    shipLabel.className = "ship-label";
    shipLabel.textContent = `${name} (${length})`;
    shipWrapper.appendChild(shipLabel);

    const shipElement = document.createElement("div");
    shipElement.className = `draggable-ship ${this.currentShipOrientation}`;
    shipElement.draggable = true;
    shipElement.dataset.length = length;
    shipElement.dataset.name = name;
    shipElement.dataset.shipId = shipId;

    // Create ship cells
    for (let i = 0; i < length; i++) {
      const shipCell = document.createElement("div");
      shipCell.className = "ship-cell";
      shipElement.appendChild(shipCell);
    }

    // Add drag event listeners
    shipElement.addEventListener("dragstart", (e) => this.handleDragStart(e));
    shipElement.addEventListener("dragend", (e) => this.handleDragEnd(e));

    shipWrapper.appendChild(shipElement);
    return shipWrapper;
  }

  handleDragStart(e) {
    this.draggedShip = {
      element: e.target,
      length: parseInt(e.target.dataset.length),
      name: e.target.dataset.name,
      shipId: parseInt(e.target.dataset.shipId),
      orientation: this.currentShipOrientation
    };
    
    e.target.style.opacity = '0.3';
    console.log(`Started dragging ${this.draggedShip.name}`);
  }

  handleDragEnd(e) {
    e.target.style.opacity = '1';
  }

  handleDragOver(e) {
    e.preventDefault(); // Allow drop
    
    if (!this.draggedShip) return;

    // Highlight valid drop zones
    const rect = e.currentTarget.getBoundingClientRect();
    const cellSize = 35; 
    const x = Math.floor((e.clientX - rect.left) / cellSize);
    const y = Math.floor((e.clientY - rect.top) / cellSize);

    // Clear previous highlights
    this.clearHighlights();

    // Highlight cells if valid placement
    if (this.isValidPlacement(x, y, this.draggedShip.length, this.draggedShip.orientation)) {
      this.highlightCells(x, y, this.draggedShip.length, this.draggedShip.orientation, 'valid');
    } else {
      this.highlightCells(x, y, this.draggedShip.length, this.draggedShip.orientation, 'invalid');
    }
  }

  handleDrop(e) {
    e.preventDefault();
    
    if (!this.draggedShip) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const cellSize = 35;
    const x = Math.floor((e.clientX - rect.left) / cellSize);
    const y = Math.floor((e.clientY - rect.top) / cellSize);

    console.log(`Attempting to place ${this.draggedShip.name} at (${x}, ${y})`);

    if (this.isValidPlacement(x, y, this.draggedShip.length, this.draggedShip.orientation)) {
      // Place the ship in the game logic
      try {
        const isHorizontal = this.draggedShip.orientation === 'horizontal';
        console.log("isHorizontal", isHorizontal)
        this.gameInstance.getPlayer().getGameboard().placeShip(x, y, this.draggedShip.length, isHorizontal);
        
        // Mark ship as placed and hide it from ship container
        this.placedShips.add(this.draggedShip.shipId);
        this.draggedShip.element.style.display = 'none';
        
        // Update the board display
        this.updatePlayerBoard();
        
        console.log(`Successfully placed ${this.draggedShip.name}`);
        
        // Check if all ships are placed
        if (this.placedShips.size === 5) {
          this.onAllShipsPlaced();
        }
        
      } catch (error) {
        console.error("Failed to place ship:", error.message);
        this.showMessage("Cannot place ship here!", "error");
      }
    } else {
      console.log("Invalid placement position");
      this.showMessage("Invalid placement position!", "error");
    }

    // Clean up
    this.clearHighlights();
    this.draggedShip = null;
  }


  isValidPlacement(x, y, length, orientation) {
    // Check bounds
    if (orientation === 'horizontal') {
      if (x + length > 10 || y >= 10 || x < 0 || y < 0) return false;
    } else {
      if (y + length > 10 || x >= 10 || x < 0 || y < 0) return false;
    }

    // Check for collisions with existing ships
    const gameboard = this.gameInstance.getPlayer().getGameboard();
    
    for (let i = 0; i < length; i++) {
      const checkX = orientation === 'horizontal' ? x + i : x;
      const checkY = orientation === 'horizontal' ? y : y + i;
      
      if (gameboard.getShipAt(checkX, checkY) !== null) {
        return false;
      }
    }

    return true;
  }

  highlightCells(x, y, length, orientation, type) {
    const board = document.querySelector('#empty-player-board .board-grid');
    if (!board) return;

    for (let i = 0; i < length; i++) {
      const cellX = orientation === 'horizontal' ? x + i : x;
      const cellY = orientation === 'horizontal' ? y : y + i;
      
      if (cellX >= 0 && cellX < 10 && cellY >= 0 && cellY < 10) {
        const cell = board.querySelector(`[data-x="${cellX}"][data-y="${cellY}"]`);
        if (cell) {
          cell.classList.add(`highlight-${type}`);
        }
      }
    }
  }

  clearHighlights() {
    const board = document.querySelector('#empty-player-board .board-grid');
    if (!board) return;
    
    const highlightedCells = board.querySelectorAll('.highlight-valid, .highlight-invalid');
    highlightedCells.forEach(cell => {
      cell.classList.remove('highlight-valid', 'highlight-invalid');
    });
  }

  toggleShipOrientation() {
    this.currentShipOrientation = this.currentShipOrientation === 'horizontal' ? 'vertical' : 'horizontal';
    
    // Update visual orientation of all remaining ships
    const ships = document.querySelectorAll('.draggable-ship');
    ships.forEach(ship => {
      if (ship.style.display !== 'none') { 
        ship.className = `draggable-ship ${this.currentShipOrientation}`;
      }
    });

    console.log(`Ship orientation changed to: ${this.currentShipOrientation}`);
  }

  onAllShipsPlaced() {
    console.log("All ships placed! Ready to start game.");
    
    // Show start game button
    const gameContainer = document.getElementById("game-container");
    const startButton = document.createElement("button");
    startButton.textContent = "Start Battle!";
    startButton.className = "start-game-btn";
    startButton.addEventListener("click", () => {
      // Place computer ships randomly
      this.gameInstance.getComputer().placeShipsRandomly();
      
      // Switch to game view
      this.playGame();
    });
    
    gameContainer.appendChild(startButton);
    this.showMessage("All ships placed! Click 'Start Battle!' to begin.", "success");
  }

   showMessage(text, type = "info") {
    // Create or update message display
    let messageDiv = document.getElementById("game-message");
    if (!messageDiv) {
      messageDiv = document.createElement("div");
      messageDiv.id = "game-message";
      messageDiv.className = "game-message";
      
      const gameContainer = document.getElementById("game-container");
      gameContainer.insertBefore(messageDiv, gameContainer.firstChild);
    }
    
    messageDiv.textContent = text;
    messageDiv.className = `game-message ${type}`;
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
      if (messageDiv) {
        messageDiv.style.opacity = '0';
        setTimeout(() => messageDiv.remove(), 300);
      }
    }, 3000);
  }


  updatePlayerBoard() {
    const playerBoard = document.querySelector('#empty-player-board');
    if (playerBoard) {
      this.gameInstance.getPlayer().getGameboard().printBoard();
      this.renderGameboard(
        this.gameInstance.getPlayer().getGameboard(),
        playerBoard,
        true // Show ships on player board
      );
    }
  }

  createGameboard(player, isEnemy = false) {
    const container = document.createElement("div");
    container.className = `gameboard ${isEnemy ? "enemy-board" : "player-board"}`;

    const title = document.createElement("h3");
    title.textContent = isEnemy ? "Enemy Waters" : "Your Fleet";
    container.appendChild(title);

    const board = document.createElement("div");
    board.className = "board-grid";

    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.dataset.x = x;
        cell.dataset.y = y;

        if (isEnemy) {
          cell.addEventListener("click", () => this.handleEnemyCellClick(x, y));
          cell.style.cursor = "crosshair";
        }

        board.appendChild(cell);
      }
    }

    container.appendChild(board);
    return container;
  }

  handleEnemyCellClick(x, y) {
    if (this.gameInstance.isGameOver()) {
      this.updateDisplay();
      return;
    }

    if (
      this.gameInstance.getCurrentPlayer() !== this.gameInstance.getPlayer()
    ) {
      this.updateDisplay();
      return;
    }

    try {
      const result = this.gameInstance.playerAttack(x, y);
      this.updateDisplay();

      // If game not over and it's computer's turn, make computer move
      if (
        !this.gameInstance.isGameOver() &&
        this.gameInstance.getCurrentPlayer() === this.gameInstance.getComputer()
      ) {
        setTimeout(() => {
          this.gameInstance.computerTurn();
          this.updateDisplay();
        }, 1000);
      }
    } catch (error) {
      console.log("Invalid move:", error.message);
    }
  }

  renderGameboard(gameboard, container, showShips = false) {
    const cells = container.querySelectorAll(".cell");

    cells.forEach((cell) => {
      const x = parseInt(cell.dataset.x);
      const y = parseInt(cell.dataset.y);

      cell.className = "cell";

      const ship = gameboard.getShipAt(x, y);
      const hasBeenAttacked = gameboard.hasBeenAttacked(x, y);

      console.log(gameboard.printBoard())

      if (hasBeenAttacked) {
        if (ship) {
          cell.classList.add("hit");
          if (ship.isSunk()) {
            cell.classList.add("sunk");
          }
        } else {
          cell.classList.add("miss");
        }
      } else if (showShips && ship) {
        cell.classList.add("ship");
      }
    });
  }

  updateDisplay() {
    const playerBoard = document.getElementById("player-board");
    const enemyBoard = document.getElementById("enemy-board");

    if (playerBoard) {
      this.renderGameboard(
        this.gameInstance.getPlayer().getGameboard(),
        playerBoard,
        true,
      );
    }

    if (enemyBoard) {
      this.renderGameboard(
        this.gameInstance.getComputer().getGameboard(),
        enemyBoard,
        true,
      ); //move to false after debuging
    }

    // Update game status
    this.updateGameStatus();
  }

  updateGameStatus() {
    const statusElement = document.getElementById("game-status");
    if (!statusElement) return;

    if (this.gameInstance.isGameOver()) {
      const winner = this.gameInstance.getWinner();
      statusElement.textContent = `Game Over! ${winner.getName()} wins!`;
      statusElement.className = "game-status game-over";

      const newGameButton = document.createElement("button");
      console.log(newGameButton)
      newGameButton.textContent += "";
      newGameButton.textContent += "Restart Game";
    } else {
      const currentPlayer = this.gameInstance.getCurrentPlayer();
      if (currentPlayer === this.gameInstance.getPlayer()) {
        statusElement.textContent =
          "Your turn - Click on enemy waters to attack!";
        statusElement.className = "game-status player-turn";
      } else {
        statusElement.textContent = "Computer is thinking...";
        statusElement.className = "game-status computer-turn";
      }
    }
  }

  playGame() {
    const gameContainer = document.getElementById("game-container");
    if (!gameContainer) {
      console.error("Game container not found");
      return;
    }

    // Clear existing content
    gameContainer.innerHTML = "";

    const statusDiv = document.createElement("div");
    statusDiv.id = "game-status";
    statusDiv.className = "game-status";
    gameContainer.appendChild(statusDiv);

    // Game controls
    const controlsDiv = document.createElement("div");
    controlsDiv.className = "game-controls";

    const newGameButton = document.createElement("button");
    newGameButton.textContent = "Reset game";
    newGameButton.id = "new-game-btn";
    newGameButton.addEventListener("click", () => {
      this.gameInstance.resetGame();
      this.playGame();
    });

    controlsDiv.appendChild(newGameButton);
    gameContainer.appendChild(controlsDiv);

    // Boards container
    const boardsContainer = document.createElement("div");
    boardsContainer.className = "boards-container";

    // Player board
    const playerBoardContainer = this.createGameboard(
      this.gameInstance.getPlayer(),
      false,
    );
    playerBoardContainer.id = "player-board";
    boardsContainer.appendChild(playerBoardContainer);

    // Enemy board
    const enemyBoardContainer = this.createGameboard(
      this.gameInstance.getComputer(),
      true,
    );
    enemyBoardContainer.id = "enemy-board";
    boardsContainer.appendChild(enemyBoardContainer);

    gameContainer.appendChild(boardsContainer);

    // Initial display update
    this.updateDisplay();
  }

  setupGame() {
    const gameContainer = document.getElementById("game-container");
    if (!gameContainer) {
      console.error("Game container not found");
      return;
    }

    // Reset placement state
    // this.placedShips.clear();
    // this.draggedShip = null;
    // this.currentShipOrientation = 'horizontal';

    gameContainer.innerHTML = "";

    // Add instructions
    const instructionsDiv = document.createElement("div");
    instructionsDiv.className = "setup-instructions";
    instructionsDiv.innerHTML = `
      <h2>Place Your Ships</h2>
      <p>Drag each ship from the right panel to your board on the left. Use the "Rotate Ships" button to change orientation.</p>
    `;
    gameContainer.appendChild(instructionsDiv);

    const boardsContainer = document.createElement("div");
    boardsContainer.className = "boards-container";

    const playerBoardContainer = this.createEmptyGameBoard(false);
    playerBoardContainer.id = "empty-player-board";

    const shipBoardContainer = this.createEmptyGameBoard(true);
    shipBoardContainer.id = "ship-container-board";

    boardsContainer.appendChild(playerBoardContainer);
    boardsContainer.appendChild(shipBoardContainer);
    gameContainer.appendChild(boardsContainer);
  }

  // setupGame(){
  //   // this.playGame()

  //   const gameContainer = document.getElementById("game-container");
  //   if (!gameContainer) {
  //     console.error("Game container not found");
  //     return;
  //   }

  //   // Clear existing content
  //   gameContainer.innerHTML = "";

  //   const boardsContainer = document.createElement("div");
  //   boardsContainer.className = "boards-container";

  //   // Player board
  //   const playerBoardContainer = this.createEmptyGameBoard(false)
  //   playerBoardContainer.id = "empty-player-board";

    

  //   // Place ship container
  //   const shipBoardContainer = this.createEmptyGameBoard(true)
  //   shipBoardContainer.id = "ship-container-board";

    
  //   boardsContainer.appendChild(playerBoardContainer);
  //   boardsContainer.appendChild(shipBoardContainer);
  //   gameContainer.appendChild(boardsContainer);
  //   this.updateDisplay();
  // }
}
