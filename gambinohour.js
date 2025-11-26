// Initial time: 60 minutes converted to seconds
const INITIAL_TIME_SECONDS = 60 * 60; 
let timeLeftInSeconds = INITIAL_TIME_SECONDS;
let timerInterval = null;
let isPaused = true;

// NEW CONSTANT: Set the specific time (20 minutes = 1200 seconds)
const min_10 = 10 * 60; 
const min_15 = 15 * 60; 
const min_20 = 20 * 60; 
const min_23 = 23 * 60; 
const min_60 = 60 * 60; 

const min_30 = 30 * 60; 
const min_45 = 45 * 60; 



// NEW ARRAY: List of audio files to choose from (Ensure these files are in the same folder)
const MIN_10_AUDIO_FILES = [
    'audio/10min/10_minutes.mp3',
    'audio/10min/no_time_10_minutes.mp3'
];

const MIN_15_AUDIO_FILES = [
    'audio/15min/15_min_i_think_2.mp3',
    'audio/15min/15_min_i_think.mp3',
];
const MIN_20_AUDIO_FILES = [
    'audio/20min/20_min_move.mp3',
    'audio/20min/20_min.mp3'
];
const MIN_23_AUDIO_FILES = [
    'audio/23min/23_min_move.mp3',
    'audio/23min/23_min.mp3',
];

const MIN_60_AUDIO_FILES = [
    'audio/60min/no_time_60_minutes.mp3',
    'audio/60min/only_60_gotta_move.mp3',
    'audio/60min/only_60_min.mp3',
];

const RUNNING_OUT_OF_TIME_AUDIO_FILES = [
    'audio/runningoutoftime/dont_have_a_lot_of_time.mp3',
    'audio/runningoutoftime/running_out_of_time_gotta_run.mp3',
    'audio/runningoutoftime/running_out_of_time.mp3',

];

const NO_TIME_AUDIO_FILES = [
    'audio/notime/we_dont_have_the_time.mp3'
];


const timerDisplay = document.getElementById('timer-display');
const startPauseBtn = document.getElementById('start-pause-btn');
const resetBtn = document.getElementById('reset-btn');
const timerAlarm = document.getElementById('timer-alarm');

/**
 * Converts total seconds into a MM:SS string format.
 */
function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    // Pad with zero if needed (e.g., 5 becomes 05)
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

/**
 * Updates the timer display with the current time left.
 */
function updateDisplay() {
    timerDisplay.textContent = formatTime(timeLeftInSeconds);
}

/**
 * Core function to decrease the time and handle the countdown end.
 */
function countdown() {
    if (timeLeftInSeconds > 0) {
        timeLeftInSeconds--;
        updateDisplay();
        
        // CHECK FOR TARGET TIME (20:00)
        let audioLengthTimes = [min_10, min_15, min_20, min_23, min_30, min_45, min_60, 0]
        if (audioLengthTimes.contains(timeLeftInSeconds) && !isTargetSoundPlayed) {
            // 1. Select a random sound file
            const selectedSound = getRandomAudioFile(timeLeftInSeconds);
            
            // 2. Set the audio element's source and load it
            timerAlarm.src = selectedSound;
            timerAlarm.load(); 
            
            // 3. Play the audio
            timerAlarm.play();
            isTargetSoundPlayed = true; // Set flag to prevent repeated playing
            console.log(`Playing random sound: ${selectedSound} at 20:00`);
        }

    } else {
        // Timer finished (00:00)
        clearInterval(timerInterval);
        timerInterval = null;
        isPaused = true;
        
        // Optional: Play a final sound when the timer ends
        // (You might want a different, dedicated sound for 00:00 here)
        
        startPauseBtn.textContent = 'Start';
        startPauseBtn.classList.add('paused');
        alert('Time is up!');
    }
}

/**
 * Starts or Pauses the timer.
 */
function toggleTimer() {
    if (isPaused) {
        // Start the timer
        isPaused = false;
        startPauseBtn.textContent = 'Pause';
        startPauseBtn.classList.remove('paused');

        // Set interval to call countdown every 1000 milliseconds (1 second)
        timerInterval = setInterval(countdown, 1000);
        if (timeLeftInSeconds === min_60) {
            const selectedStartSound = getRandomAudioFile(min_60);
            timerAlarm.src = selectedStartSound;
            timerAlarm.load();
            timerAlarm.play();
            console.log(`Playing start sound: ${selectedStartSound}`);
        }
    } else {
        // Pause the timer
        isPaused = true;
        startPauseBtn.textContent = 'Resume';
        startPauseBtn.classList.add('paused');
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

/**
 * Resets the timer back to 60:00.
 */
function resetTimer() {
    // Stop the interval if it's running
    clearInterval(timerInterval);
    timerInterval = null;

    // Reset variables
    timeLeftInSeconds = INITIAL_TIME_SECONDS;
    isPaused = true;

    // Update display and button
    updateDisplay();
    startPauseBtn.textContent = 'Start';
    startPauseBtn.classList.remove('paused'); // Ensure it looks like a fresh start button
}

function getRandomAudioFile(timeLeftInSeconds) {
    let randomIndex = 0;

    switch (timeLeftInSeconds) {
        case min_10:
            randomIndex = Math.floor(Math.random() * MIN_10_AUDIO_FILES.length);
            return MIN_10_AUDIO_FILES[randomIndex];
        case min_15:
            randomIndex = Math.floor(Math.random() * MIN_15_AUDIO_FILES.length); // Assuming you meant MIN_20_AUDIO_FILES here
            return MIN_15_AUDIO_FILES[randomIndex];
        case min_20:
                randomIndex = Math.floor(Math.random() * MIN_20_AUDIO_FILES.length); // Assuming you meant MIN_20_AUDIO_FILES here
            return MIN_20_AUDIO_FILES[randomIndex];        
        case min_23:
            randomIndex = Math.floor(Math.random() * MIN_23_AUDIO_FILES.length); // Assuming you meant MIN_20_AUDIO_FILES here
            return MIN_23_AUDIO_FILES[randomIndex];        
        case min_60:
            randomIndex = Math.floor(Math.random() * MIN_60_AUDIO_FILES.length); // Assuming you meant MIN_20_AUDIO_FILES here
            return MIN_60_AUDIO_FILES[randomIndex];
        case min_30:
        case min_45:
            randomIndex = Math.floor(Math.random() * RUNNING_OUT_OF_TIME_AUDIO_FILES.length); // Assuming you meant MIN_20_AUDIO_FILES here
            return RUNNING_OUT_OF_TIME_AUDIO_FILES[randomIndex];
        case 0:
            randomIndex = Math.floor(Math.random() * NO_TIME_AUDIO_FILES.length); // Assuming you meant MIN_20_AUDIO_FILES here
            return NO_TIME_AUDIO_FILES[randomIndex];
        default:
            return null; 
    }


}

// Attach event listeners to the buttons
startPauseBtn.addEventListener('click', toggleTimer);
resetBtn.addEventListener('click', resetTimer);

// Initial display update when the page loads
updateDisplay();