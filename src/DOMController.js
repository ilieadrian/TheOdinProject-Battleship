export class DOMController {
  constructor(gameInstance) {
    this.gameInstance = gameInstance;
    this.draggedShip = null;
    this.currentShipOrientation = "horizontal"; // 'horizontal' or 'vertical'
    this.placedShips = new Set(); // Track which ships have been placed
    this.soundIsOn = true;
    this.shipImages = {
      Carrier: "assets/images/carrier.svg",
      Battleship: "assets/images/battleship.svg",
      Cruiser: "assets/images/cruiser.svg",
      Submarine: "assets/images/submarine.svg",
      Destroyer: "assets/images/destroyer.svg",
    };

    this.sounds = {
      shot: new Audio("assets/sounds/cannon-shot.mp3"),
      hit: new Audio("assets/sounds/hit.mp3"),
      miss: new Audio("assets/sounds/water-splash-miss.mp3"),
      sink: new Audio("assets/sounds/ship-sinked.mp3"),
    };
  }

  initializeSounds() {
    // Configure audio properties for better performance
    Object.values(this.sounds).forEach(sound => {
      sound.preload = 'auto';
      sound.volume = 0.7; // Adjust volume as needed
    });
  }

  soundControl() {
    const soundControlContainer = document.getElementById("svg-container");
    const soundOnSVG =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M533.6 96.5C523.3 88.1 508.2 89.7 499.8 100C491.4 110.3 493 125.4 503.3 133.8C557.5 177.8 592 244.8 592 320C592 395.2 557.5 462.2 503.3 506.3C493 514.7 491.5 529.8 499.8 540.1C508.1 550.4 523.3 551.9 533.6 543.6C598.5 490.7 640 410.2 640 320C640 229.8 598.5 149.2 533.6 96.5zM473.1 171C462.8 162.6 447.7 164.2 439.3 174.5C430.9 184.8 432.5 199.9 442.8 208.3C475.3 234.7 496 274.9 496 320C496 365.1 475.3 405.3 442.8 431.8C432.5 440.2 431 455.3 439.3 465.6C447.6 475.9 462.8 477.4 473.1 469.1C516.3 433.9 544 380.2 544 320.1C544 260 516.3 206.3 473.1 171.1zM412.6 245.5C402.3 237.1 387.2 238.7 378.8 249C370.4 259.3 372 274.4 382.3 282.8C393.1 291.6 400 305 400 320C400 335 393.1 348.4 382.3 357.3C372 365.7 370.5 380.8 378.8 391.1C387.1 401.4 402.3 402.9 412.6 394.6C434.1 376.9 448 350.1 448 320C448 289.9 434.1 263.1 412.6 245.5zM80 416L128 416L262.1 535.2C268.5 540.9 276.7 544 285.2 544C304.4 544 320 528.4 320 509.2L320 130.8C320 111.6 304.4 96 285.2 96C276.7 96 268.5 99.1 262.1 104.8L128 224L80 224C53.5 224 32 245.5 32 272L32 368C32 394.5 53.5 416 80 416z"/></svg>';
    const soundOffSVG =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M80 416L128 416L262.1 535.2C268.5 540.9 276.7 544 285.2 544C304.4 544 320 528.4 320 509.2L320 130.8C320 111.6 304.4 96 285.2 96C276.7 96 268.5 99.1 262.1 104.8L128 224L80 224C53.5 224 32 245.5 32 272L32 368C32 394.5 53.5 416 80 416zM399 239C389.6 248.4 389.6 263.6 399 272.9L446 319.9L399 366.9C389.6 376.3 389.6 391.5 399 400.8C408.4 410.1 423.6 410.2 432.9 400.8L479.9 353.8L526.9 400.8C536.3 410.2 551.5 410.2 560.8 400.8C570.1 391.4 570.2 376.2 560.8 366.9L513.8 319.9L560.8 272.9C570.2 263.5 570.2 248.3 560.8 239C551.4 229.7 536.2 229.6 526.9 239L479.9 286L432.9 239C423.5 229.6 408.3 229.6 399 239z"/></svg>';

    soundControlContainer.innerHTML = soundOnSVG;

    soundControlContainer.addEventListener("click", () => {
      this.soundIsOn = !this.soundIsOn;

      soundControlContainer.innerHTML = this.soundIsOn
        ? soundOnSVG
        : soundOffSVG;

      console.log("Sound is now:", this.soundIsOn);
    });
  }

  createEmptyGameBoard(isShipBoard = false) {
    const container = document.createElement("div");
    container.className = "gameboard";

    const title = document.createElement("h3");
    title.textContent = isShipBoard ? "Drag ships to your board" : "Your Fleet";
    container.appendChild(title);

    if (isShipBoard) {
      // Add orientation toggle button for ship container
      const buttonContainer = document.createElement("div");
      buttonContainer.id = "button-container";
      container.appendChild(buttonContainer);

      const orientationButton = document.createElement("button");
      orientationButton.textContent = "Rotate Ships";
      orientationButton.className = "orientation-btn";
      orientationButton.id = "orientation-btn";
      orientationButton.addEventListener("click", () =>
        this.toggleShipOrientation(),
      );
      buttonContainer.appendChild(orientationButton);

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
    shipContainer.id = "ship-container";

    const ships = [
      [5, "Carrier", "ship1"],
      [4, "Battleship", "ship2"],
      [2, "Destroyer", "ship3"],
      [3, "Cruiser", "ship4"],
      [3, "Submarine", "ship5"],
    ];

    ships.forEach((shipInfo, index) => {
      const [length, name, className] = shipInfo;
      const shipElement = this.createDraggableShip(
        length,
        name,
        className,
        index,
      );
      shipContainer.appendChild(shipElement);
    });

    return shipContainer;
  }

  createDraggableShip(length, name, className, shipId) {
    const shipWrapper = document.createElement("div");
    shipWrapper.className = "ship-wrapper";

    const shipLabel = document.createElement("div");
    shipLabel.className = "ship-label";
    shipLabel.textContent = `${name} (${length})`;
    // shipWrapper.appendChild(shipLabel);

    const shipElement = document.createElement("div");
    shipElement.className = `draggable-ship ${this.currentShipOrientation} ${className}`;
    shipElement.draggable = true;
    // shipElement.id = name;
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
      orientation: this.currentShipOrientation,
    };

    e.target.style.opacity = "0.3";
    console.log(`Started dragging ${this.draggedShip.name}`);
  }

  handleDragEnd(e) {
    e.target.style.opacity = "1";
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
    if (
      this.isValidPlacement(
        x,
        y,
        this.draggedShip.length,
        this.draggedShip.orientation,
      )
    ) {
      this.highlightCells(
        x,
        y,
        this.draggedShip.length,
        this.draggedShip.orientation,
        "valid",
      );
    } else {
      this.highlightCells(
        x,
        y,
        this.draggedShip.length,
        this.draggedShip.orientation,
        "invalid",
      );
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

    if (
      this.isValidPlacement(
        x,
        y,
        this.draggedShip.length,
        this.draggedShip.orientation,
      )
    ) {
      // Place the ship in the game logic
      try {
        const isHorizontal = this.draggedShip.orientation === "horizontal";
        console.log("isHorizontal", isHorizontal);
        this.gameInstance
          .getPlayer()
          .getGameboard()
          .placeShip(x, y, this.draggedShip.length, isHorizontal);

        // Mark ship as placed and hide it from ship container
        this.placedShips.add(this.draggedShip.shipId);
        this.draggedShip.element.style.display = "none";

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
    if (orientation === "horizontal") {
      if (x + length > 10 || y >= 10 || x < 0 || y < 0) return false;
    } else {
      if (y + length > 10 || x >= 10 || x < 0 || y < 0) return false;
    }

    return true;
  }

  highlightCells(x, y, length, orientation, type) {
    const board = document.querySelector("#empty-player-board .board-grid");
    if (!board) return;

    for (let i = 0; i < length; i++) {
      const cellX = orientation === "horizontal" ? x + i : x;
      const cellY = orientation === "horizontal" ? y : y + i;

      if (cellX >= 0 && cellX < 10 && cellY >= 0 && cellY < 10) {
        const cell = board.querySelector(
          `[data-x="${cellX}"][data-y="${cellY}"]`,
        );
        if (cell) {
          cell.classList.add(`highlight-${type}`);
        }
      }
    }
  }

  clearHighlights() {
    const board = document.querySelector("#empty-player-board .board-grid");
    if (!board) return;

    const highlightedCells = board.querySelectorAll(
      ".highlight-valid, .highlight-invalid",
    );
    highlightedCells.forEach((cell) => {
      cell.classList.remove("highlight-valid", "highlight-invalid");
    });
  }

  toggleShipOrientation() {
    this.currentShipOrientation =
      this.currentShipOrientation === "horizontal" ? "vertical" : "horizontal";

    // Update visual orientation of all remaining ships
    const ships = document.querySelectorAll(".draggable-ship");
    ships.forEach((ship) => {
      if (ship.style.display !== "none") {
        ship.className = `draggable-ship ${this.currentShipOrientation}`;
      }
    });

    console.log(`Ship orientation changed to: ${this.currentShipOrientation}`);
  }

  onAllShipsPlaced() {
    console.log("All ships placed! Ready to start game.");

    const orientationBtn = document.getElementById("orientation-btn");
    const shipContainer = document.getElementById("ship-container");
    const startButton = document.createElement("button");
    startButton.textContent = "Start Battle!";
    startButton.className = "start-game-btn";
    startButton.addEventListener("click", () => {
      // Place computer ships randomly
      this.gameInstance.getComputer().placeShipsRandomly();

      // Switch to game view
      this.playGame();
    });

    orientationBtn.disabled = true;
    shipContainer.appendChild(startButton);
    this.showMessage(
      "All ships placed! Click 'Start Battle!' to begin.",
      "success",
    );
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
        messageDiv.style.opacity = "0";
        setTimeout(() => messageDiv.remove(), 300);
      }
    }, 3000);
  }

  updatePlayerBoard() {
    const playerBoard = document.querySelector("#empty-player-board");
    if (playerBoard) {
      this.gameInstance.getPlayer().getGameboard().printBoard();
      this.renderGameboard(
        this.gameInstance.getPlayer().getGameboard(),
        playerBoard,
        true, // Show ships on player board
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

  async handleEnemyCellClick(x, y) {
    console.log("handleEnemyCellClick fired")
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
      this.showAttackIndicator(x,y, "playerTurn")
      await this.playCannonSound();

      const result = this.gameInstance.playerAttack(x, y);
      await this.playOutcomeSound(result);
      this.clearAttackIndicator(x,y, "playerTurn")

      this.updateDisplay();

      // If game not over and it's computer's turn, make computer move
      if (
        !this.gameInstance.isGameOver() &&
        this.gameInstance.getCurrentPlayer() === this.gameInstance.getComputer()
      ) {
        await this.delay(800);
        await this.handleComputerTurn();
      }
    } catch (error) {
      console.log("Invalid move:", error.message);
    }   
  }

   async handleComputerTurn() {
 
    // Computer thinks for a moment
    await this.delay(500);

    const computerResult = this.gameInstance.computerTurn();
    
    if (computerResult) {
      // Find the computer's target cell on player board
      const lastAttackedCoords = this.getLastAttackedCoordinates(this.gameInstance.getPlayer().getGameboard());
      
      if (lastAttackedCoords) {
        const [x, y] = lastAttackedCoords;
        
        // Show computer attack sequence
        this.showAttackIndicator(x,y, "computerTurn")
        await this.playCannonSound();
        
        
        await this.playOutcomeSound(computerResult);
        this.clearAttackIndicator(x,y, "computerTurn")
      }
    }

    // Final display update
    this.updateDisplay();
  }

  getLastAttackedCoordinates(gameboard) {
    const attackedCoords = Array.from(gameboard.attackedCoordinates);
    if (attackedCoords.length === 0) return null;
    
    const lastCoord = attackedCoords[attackedCoords.length - 1];
    const [x, y] = lastCoord.split(',').map(Number);
    return [x, y];
  }

  showAttackIndicator(x, y, turn) {
    const enemyBoard = document.getElementById("enemy-board");
    const playerBoard = document.getElementById("player-board");
    // if (!enemyBoard) return;


    if(turn === "playerTurn") {
      console.log("playerTurn fired")
      const targetCell = enemyBoard.querySelector(`[data-x="${x}"][data-y="${y}"]`);

      if (targetCell) {
        // targetCell.classList.add('attacking');
        targetCell.innerHTML = '<div class="attack-indicator">🎯</div>';
      }
    } else if (turn === "computerTurn") {
      console.log("computerTurn fired")

      const targetCell = playerBoard.querySelector(`[data-x="${x}"][data-y="${y}"]`);


      if (targetCell) {
        // targetCell.classList.add('attacking');
        targetCell.innerHTML = '<div class="attack-indicator">🎯</div>';
      }
    } else {
      return
    }

   
    
  }

  clearAttackIndicator(x, y, turn) {
    const enemyBoard = document.getElementById("enemy-board");
    const playerBoard = document.getElementById("player-board");
   
    if(turn === "playerTurn") {
      console.log("playerTurn for attack removing fired")
      const targetCell = enemyBoard.querySelector(`[data-x="${x}"][data-y="${y}"]`);

      if (targetCell) {
        targetCell.classList.remove('attacking');
        targetCell.innerHTML = '';
      }
          

    } else if(turn === "computerTurn") {
      console.log("computerTurn for attack removing fired")
      const targetCell = playerBoard.querySelector(`[data-x="${x}"][data-y="${y}"]`);

      if (targetCell) {
        targetCell.classList.remove('attacking');
        targetCell.innerHTML = '';
      }
    
    } else {
      return;
    }
    
    
  }

  async playCannonSound() {
    if (!this.soundIsOn) {
      return this.delay(1000); 
    }

    return new Promise((resolve) => {
      this.sounds.shot.currentTime = 0;
      this.sounds.shot.play();
      
      setTimeout(resolve, 1000);
    });
  }

  async playOutcomeSound(result) {
    if (!this.soundIsOn) {
      return this.delay(500); // Still wait for visual timing
    }

    return new Promise((resolve) => {
      let soundToPlay;
      let duration = 500; // Default duration

      if (result.hit) {
        if (result.sunk) {
          soundToPlay = this.sounds.sink;
          duration = 1500; // Sinking sound is longer
        } else {
          soundToPlay = this.sounds.hit;
          duration = 800;
        }
      } else {
        soundToPlay = this.sounds.miss;
        duration = 600;
      }

      soundToPlay.currentTime = 0;
      soundToPlay.play();
      
      setTimeout(resolve, duration);
    });
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  renderGameboard(gameboard, container, showShips = false) {
    const cells = container.querySelectorAll(".cell");

    cells.forEach((cell) => {
      const x = parseInt(cell.dataset.x);
      const y = parseInt(cell.dataset.y);

      cell.className = "cell";

      const ship = gameboard.getShipAt(x, y);
      const hasBeenAttacked = gameboard.hasBeenAttacked(x, y);

      console.log(gameboard.printBoard());

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

    const infoGameContainer = document.getElementById("info-game-container");
    if (infoGameContainer) {
      // Remove any existing instructions
      const existingInstructions =
        infoGameContainer.querySelectorAll(".instructions");
      existingInstructions.forEach((instruction) => instruction.remove());

      const infoGameContainerDiv = document.createElement("div");
      infoGameContainerDiv.className = "instructions";
      infoGameContainerDiv.innerHTML = `
        <p><strong>How to Play:</strong> Click on the enemy waters (right board) to attack! Your ships are shown on the left board.</p>
        <p>💥 Red = Hit, 💧 Blue = Miss, 💀 Dark Red = Sunk Ship</p>
    `;
      //<p>🎯 <strong>How to Play:</strong> Click on the enemy waters (right board) to attack! Your ships are shown on the left board.</p>
       // <p>💥 Red = Hit, 💧 Blue = Miss, 💀 Dark Red = Sunk Ship</p>
      //        <p>🚢 Ships: Carrier (5), Battleship (4), Cruiser (3), Submarine (3), Destroyer (2)</p>

      infoGameContainer.insertBefore(
        infoGameContainerDiv,
        document.getElementById("game-container"),
      );
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
    console.log("Setup game");
    this.soundControl();

    const gameContainer = document.getElementById("game-container");
    if (!gameContainer) {
      console.error("Game container not found");
      return;
    }

    // Reset placement state
    this.placedShips.clear();
    this.draggedShip = null;
    this.currentShipOrientation = "horizontal";
    //

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
}