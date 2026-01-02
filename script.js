/**
 * Game Configuration - Mirrors the Python dictionary
 */
const GAME_CONFIG = {
    1: { name: "Łatwy", range: 50, attempts: 10 },
    2: { name: "Średni", range: 100, attempts: 7 },
    3: { name: "Trudny", range: 1000, attempts: 5 }
};

/**
 * Game State Management
 */
const game = {
    currentLevel: null,
    targetNumber: null,
    attemptsLeft: 0,
    isGameOver: true,

    // UI Cache
    elements: {
        viewMenu: document.getElementById('view-menu'),
        viewGame: document.getElementById('view-game'),
        viewResult: document.getElementById('view-result'),

        displayLevelName: document.getElementById('display-level-name'),
        displayRange: document.getElementById('display-range'),
        displayAttempts: document.getElementById('display-attempts'),

        inputGuess: document.getElementById('user-guess'),
        btnSubmit: document.getElementById('btn-submit'),
        feedback: document.getElementById('feedback-message'),

        resultTitle: document.getElementById('result-title'),
        resultMessage: document.getElementById('result-message')
    },

    /**
     * Start the game with the selected difficulty
     * @param {number} difficultyLevel 
     */
    start: function (difficultyLevel) {
        const config = GAME_CONFIG[difficultyLevel];
        if (!config) return console.error("Invalid difficulty level");

        this.currentLevel = config;
        this.targetNumber = Math.floor(Math.random() * config.range) + 1;
        this.attemptsLeft = config.attempts;
        this.isGameOver = false;

        // Reset UI
        this.elements.inputGuess.value = '';
        this.elements.inputGuess.min = 1;
        this.elements.inputGuess.max = config.range;
        this.elements.feedback.textContent = '';
        this.elements.feedback.className = 'message-area';

        // Update Info Display
        this.elements.displayLevelName.textContent = config.name;
        this.elements.displayRange.textContent = `1-${config.range}`;
        this.elements.displayAttempts.textContent = this.attemptsLeft;

        // Switch View
        this.switchView('viewGame');

        // Focus input after transition
        setTimeout(() => this.elements.inputGuess.focus(), 100);

        console.log(`Game started. Target: ${this.targetNumber}`); // For debugging
    },

    /**
     * Process the user's guess
     */
    checkGuess: function () {
        if (this.isGameOver) return;

        const guessInput = this.elements.inputGuess;
        const guess = parseInt(guessInput.value);

        // Validation
        if (isNaN(guess)) {
            this.showFeedback("Podaj poprawną liczbę!", "msg-error");
            return;
        }

        if (guess < 1 || guess > this.currentLevel.range) {
            this.showFeedback(`Liczba musi być z zakresu 1-${this.currentLevel.range}!`, "msg-error");
            return;
        }

        // Logic
        this.attemptsLeft--;
        this.elements.displayAttempts.textContent = this.attemptsLeft;

        if (guess === this.targetNumber) {
            this.endGame(true);
        } else if (this.attemptsLeft === 0) {
            this.endGame(false);
        } else {
            if (guess < this.targetNumber) {
                this.showFeedback("ZA MAŁO! Spróbuj wyższej liczby.", "msg-info");
            } else {
                this.showFeedback("ZA DUŻO! Spróbuj niższej liczby.", "msg-info");
            }

            // Clear input for next guess
            guessInput.value = '';
            guessInput.focus();
        }
    },

    /**
     * Show feedback message with animation
     */
    showFeedback: function (msg, className) {
        const el = this.elements.feedback;
        el.textContent = msg;
        el.className = `message-area ${className}`;

        // Small shake animation for errors
        if (className === 'msg-error') {
            this.elements.inputGuess.classList.add('shake');
            setTimeout(() => this.elements.inputGuess.classList.remove('shake'), 500);
        }
    },

    /**
     * Handle Win/Loss
     */
    endGame: function (isWin) {
        this.isGameOver = true;

        if (isWin) {
            this.elements.resultTitle.textContent = "GRATULACJE!";
            this.elements.resultTitle.className = "win";
            this.elements.resultMessage.innerHTML = `Zgadłeś liczbę <span class="neon-text">${this.targetNumber}</span>!`;
        } else {
            this.elements.resultTitle.textContent = "KONIEC GRY";
            this.elements.resultTitle.className = "lose";
            this.elements.resultMessage.innerHTML = `Niestety zabrakło prób.<br>Szukana liczba to: <span class="neon-text">${this.targetNumber}</span>.`;
        }

        this.switchView('viewResult');
    },

    /**
     * Return to Menu
     */
    reset: function () {
        this.switchView('viewMenu');
    },

    /**
     * Helper to switch visible sections
     */
    switchView: function (viewName) {
        // Hide all views
        ['viewMenu', 'viewGame', 'viewResult'].forEach(v => {
            this.elements[v].classList.add('hidden-view');
            this.elements[v].classList.remove('active-view');
        });

        // Show target view
        this.elements[viewName].classList.remove('hidden-view');
        this.elements[viewName].classList.add('active-view');
    }
};

/**
 * Event Listeners
 */
document.addEventListener('DOMContentLoaded', () => {
    // Submit button
    game.elements.btnSubmit.addEventListener('click', () => game.checkGuess());

    // Enter key support
    game.elements.inputGuess.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            game.checkGuess();
        }
    });
});
