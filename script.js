class PomodoroTimer {
    constructor() {
        this.timeLeft = 25 * 60; // 25 minutes in seconds
        this.timerId = null;
        this.isRunning = false;
        this.mode = 'pomodoro';
        this.pomodoroTime = 25 * 60;
        this.shortBreakTime = 5 * 60;
        this.longBreakTime = 15 * 60;
        this.pomodoroCount = 0;

        this.initializeElements();
        this.initializeEventListeners();
        this.updateDisplay();
    }

    initializeElements() {
        this.minutesDisplay = document.getElementById('minutes');
        this.secondsDisplay = document.getElementById('seconds');
        this.startButton = document.getElementById('start');
        this.pauseButton = document.getElementById('pause');
        this.resetButton = document.getElementById('reset');
        this.pomodoroButton = document.getElementById('pomodoro');
        this.shortBreakButton = document.getElementById('shortBreak');
        this.longBreakButton = document.getElementById('longBreak');
    }

    initializeEventListeners() {
        this.startButton.addEventListener('click', () => this.start());
        this.pauseButton.addEventListener('click', () => this.pause());
        this.resetButton.addEventListener('click', () => this.reset());
        this.pomodoroButton.addEventListener('click', () => this.setMode('pomodoro'));
        this.shortBreakButton.addEventListener('click', () => this.setMode('shortBreak'));
        this.longBreakButton.addEventListener('click', () => this.setMode('longBreak'));
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.timerId = setInterval(() => this.tick(), 1000);
            this.startButton.disabled = true;
        }
    }

    pause() {
        if (this.isRunning) {
            this.isRunning = false;
            clearInterval(this.timerId);
            this.startButton.disabled = false;
        }
    }

    reset() {
        this.pause();
        this.timeLeft = this.getTimeForMode();
        this.updateDisplay();
    }

    tick() {
        this.timeLeft--;
        this.updateDisplay();

        if (this.timeLeft === 0) {
            this.handleTimerComplete();
        }
    }

    handleTimerComplete() {
        this.pause();
        this.playNotification();
        
        if (this.mode === 'pomodoro') {
            this.pomodoroCount++;
            if (this.pomodoroCount % 4 === 0) {
                this.setMode('longBreak');
            } else {
                this.setMode('shortBreak');
            }
        } else {
            this.setMode('pomodoro');
        }
        
        this.start();
    }

    playNotification() {
        const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
        audio.play();
    }

    setMode(mode) {
        this.mode = mode;
        this.pause();
        this.timeLeft = this.getTimeForMode();
        
        // Update active button
        [this.pomodoroButton, this.shortBreakButton, this.longBreakButton].forEach(button => {
            button.classList.remove('active');
        });
        document.getElementById(mode).classList.add('active');
        
        this.updateDisplay();
    }

    getTimeForMode() {
        switch (this.mode) {
            case 'pomodoro':
                return this.pomodoroTime;
            case 'shortBreak':
                return this.shortBreakTime;
            case 'longBreak':
                return this.longBreakTime;
            default:
                return this.pomodoroTime;
        }
    }

    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        this.minutesDisplay.textContent = minutes.toString().padStart(2, '0');
        this.secondsDisplay.textContent = seconds.toString().padStart(2, '0');
    }
}

// Initialize the timer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new PomodoroTimer();
}); 