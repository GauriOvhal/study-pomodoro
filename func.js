let timerInterval;
let timeLeft = 25 * 60;
let phaseDuration = 25 * 60; 
let isBreak = false;
let isRunning = false;
let totalSessions = 0;
let sessionsRemaining = 0;
let currentTheme = 'light';

const timerDisplay = document.getElementById('timer');
const statusDisplay = document.getElementById('status');
const progressBar = document.getElementById('progressBar');
const soundSelect = document.getElementById('soundSelect');

function playAlert() 
{
    if (!document.getElementById('muteToggle').checked) 
    {
        const audio = new Audio(soundSelect.value);
        audio.play().catch(() => {});
    }
}

document.getElementById('initBtn').addEventListener('click', () => {
    const hours = parseFloat(document.getElementById('hoursInput').value);
    totalSessions = Math.ceil((hours * 60) / 30);
    sessionsRemaining = totalSessions;
    document.getElementById('goalDisplay').textContent = hours;
    
    updateUI();
    document.getElementById('setupScreen').classList.add('hidden');
    document.getElementById('timerScreen').classList.remove('hidden');
});

function updateUI() 
{
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    timerDisplay.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    document.getElementById('sessionCount').textContent = `SESSIONS REMAINING: ${sessionsRemaining}`;
    
    // Smooth incremental progress
    const elapsed = phaseDuration - timeLeft;
    const percent = (elapsed / phaseDuration) * 100;
    progressBar.style.width = `${percent}%`;
}

document.getElementById('startBtn').addEventListener('click', function() 
{
    if (!isRunning) 
    {
        isRunning = true;
        this.textContent = "Pause";
        timerInterval = setInterval(() => {
            timeLeft--;
            updateUI();
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                handleSwitch();
            }
        }, 1000);
    } 
    else 
    {
        isRunning = false;
        clearInterval(timerInterval);
        this.textContent = "Resume";
    }
});

function handleSwitch() 
{
    playAlert();
    if (!isBreak) 
    {
        sessionsRemaining--;
        if (sessionsRemaining <= 0) 
        {
            alert("Study Goal Reached!");
            location.reload();
            return;
        }
        alert("Time for a break!");
        isBreak = true;
        timeLeft = 5 * 60;
        phaseDuration = 5 * 60; 
        statusDisplay.textContent = "Break Time !";
    } 
    else 
    {
        alert("Back to work!");
        isBreak = false;
        timeLeft = 25 * 60;
        phaseDuration = 25 * 60; 
        statusDisplay.textContent = "Study Time !";
    }
    isRunning = false;
    document.getElementById('startBtn').textContent = "Start";
    updateUI();
}

document.getElementById('resetBtn').addEventListener('click', () => location.reload());

document.getElementById('themeBtn').addEventListener('click', () => {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    document.getElementById('themeBtn').textContent = currentTheme === 'light' ? "🌙 Dark Mode" : "☀️ Light Mode";
});