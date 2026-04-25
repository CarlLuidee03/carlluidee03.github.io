let pHP = 100;
let pMP = 100;
let eHP = 100;
let eMP = 100;
let incomingDamage = 0;

const states = {
    PLAYER: "playerTurn",
    ENEMY: "enemyTurn",
    GAME_OVER: "gameOver"
};
let gameState = states.PLAYER;

const enemyAction = {
    NORMAL: "normalAttack",
    POWER: "powerAttack",
    SHIELD: "magicShield"
};
let enemyCurrAct = enemyAction.NORMAL;

let playerTurn = true;
let playerBlock = false;

const showUI = ["info", "actions"];
const hideUI = ["title", "start"];

const pTable = document.getElementById("playerStats");
const pHealth = pTable.rows[1].cells[1];
const pMagick = pTable.rows[2].cells[1];

const eTable = document.getElementById("enemyStats");
const eHealth = eTable.rows[1].cells[1];
const eMagick = eTable.rows[2].cells[1];

const historyDiv = document.getElementById("history")

function showGameUI() {
    document.querySelector(".container").style.display = "grid";

    document.getElementById("info").style.display = "grid";
    document.getElementById("actions").style.display = "flex";

    for (let UI of hideUI)
        document.getElementById(UI).style.display = "none";
}

function startGame() {
    // Show interface
    showGameUI();
    
    // Player stats
    pHealth.textContent = pHP;
    pMagick.textContent = pMP;

    // Enemy stats
    eHealth.textContent = eHP;
    eMagick.textContent = eMP;
    
    historyDiv.textContent = "Game Start";
}

function updateStats() {
    // Set stats
    pHealth.textContent = pHP;
    eHealth.textContent = eHP;
    pMagick.textContent = pMP;
    eMagick.textContent = eMP;
    // Player dead
    if (pHP <= 0) {
        if (pHP < 0)
            pHP = 0;
        gameState = states.GAME_OVER;
        historyDiv.textContent = "Game Over";
    }
    // Enemy dead
    if (eHP <= 0) {
        if (eHP < 0)
            eHP = 0;
        gameState = states.GAME_OVER;
        historyDiv.textContent = "Enemy defeated";
    }
}

function attack() {
    if (gameState !== states.PLAYER)
        return;
    // Do random damage to enemy
    let damage = Math.floor(Math.random() * 10) + 5;
    if (enemyCurrAct === enemyAction.SHIELD) {
        damage /= 2;
    }
    eHP -= damage;
    // Update history
    historyDiv.innerHTML = `You did <strong>${damage}</strong> damage.`;
    // Update stats
    updateStats();
    // Enemy's turn
    gameState = states.ENEMY;
    enemyTurn();
}

function defend() {
    if (gameState !== states.PLAYER)
        return;
    playerBlock = true;
    historyDiv.textContent = "You brace for the next attack.";
    gameState = states.ENEMY;
    enemyTurn()
}

function spell() {
    if (gameState !== states.PLAYER)
        return;
    // Do random damage to enemy
    if (pMP > 0) {
        let damage = Math.floor(Math.random() * 20) + 5;
        eHP -= damage;
        pMP -= 20;
        // Update history
        historyDiv.innerHTML = `You cast a fire spell, doing <strong>${damage}</strong> damage.`;
        // Update stats
        updateStats();
        // Enemy's turn
        gameState = states.ENEMY;
        enemyTurn();
    }
    else {
        historyDiv.textContent = `Not enough magick!`;
    }
}

function enemyTurn() {
    if (gameState !== states.ENEMY)
        return;
    setTimeout(() => {
        // Do random damage to player
        let damage = Math.floor(Math.random() * 10) + 3;
        // Attack is power attack
        if (enemyCurrAct === enemyAction.POWER) {
            damage *= 2;
        }
        // If player is blocking
        if (playerBlock) {
            // Half damage
            damage = Math.floor(damage / 2);
            playerBlock = false;
            historyDiv.innerHTML = `You block the enemy's attack. Enemy did <strong>${damage}</strong> damage.`;
        }
        else {
            historyDiv.innerHTML = `Enemy did <strong>${damage}</strong> damage.`;
        }
        // Damage player
        pHP -= damage;
        nextAction();
        // Update stats
        updateStats();
        // Player's turn
        gameState = states.PLAYER;
    }, 1000);
}

function nextAction() {
    let randVal = Math.random();
    // Normal attack
    if (randVal < 0.50) {
        enemyCurrAct = enemyAction.NORMAL;
    }
    // Shield
    else if (randVal < 0.75) {
        enemyCurrAct = enemyAction.SHIELD;
        historyDiv.textContent += " Enemy's is blocking your next physical attack!"
    }
    // Power Attack
    else {
        enemyCurrAct = enemyAction.POWER;
        historyDiv.textContent += " Enemy's next attack is a power attack!"
    }
}