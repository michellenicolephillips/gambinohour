// Initial time: 60 minutes converted to seconds
const INITIAL_TIME_SECONDS = 60 * 60; 
let timeLeftInSeconds = INITIAL_TIME_SECONDS;
let timerInterval = null;
let isPaused = true;
// FIX 1: Declare the target sound flag and initialize it to false
let isTargetSoundPlayed = false; 

// NEW CONSTANT: Set the specific time (in seconds remaining)
const min_10 = 10 * 60; 
const min_15 = 15 * 60; // 900 seconds
const min_20 = 20 * 60; // 1200 seconds
const min_23 = 23 * 60; // 1380 seconds
const min_60 = 60 * 60; // 3600 seconds (This is the start time, used only for the start sound)

const min_30 = 30 * 60; // 1800 seconds
const min_45 = 45 * 60; // 2700 seconds


// NEW ARRAYS: List of audio files to choose from 
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
    // FIX 2: Reset the flag immediately after the time check, 
    // but before decrementing, so a *new* time check can trigger the audio.
    // If the audio played on the previous second, we are now ready for the next target.
    if (isTargetSoundPlayed) {
        isTargetSoundPlayed = false;
    }

    if (timeLeftInSeconds > 0) {
        timeLeftInSeconds--;
        updateDisplay();
        
        // This array should only contain the times you want to trigger a sound at.
        // min_60 is only used on start, so it's not needed here unless you want a repeat sound.
        let audioLengthTimes = [min_10, min_15, min_20, min_23, min_30, min_45, 0];
        
        if (audioLengthTimes.includes(timeLeftInSeconds) && !isTargetSoundPlayed) {
            // 1. Select a random sound file
            const selectedSound = getRandomAudioFile(timeLeftInSeconds);
            
            if (selectedSound) {
                // 2. Set the audio element's source and load it
                timerAlarm.src = selectedSound;
                // FIX 3: Add event listener to reset the flag *after* the sound finishes playing
                timerAlarm.onended = () => {
                    isTargetSoundPlayed = false;
                    timerAlarm.onended = null; // Clear the handler after use
                };
                timerAlarm.load(); 
                
                // 3. Play the audio
                timerAlarm.play().catch(e => console.error("Error playing audio:", e));
                isTargetSoundPlayed = true; // Set flag to prevent immediate repeat playing
                console.log(`Playing random sound: ${selectedSound} at ${formatTime(timeLeftInSeconds)}`);
            }
        }

    } else {
        // Timer finished (00:00)
        clearInterval(timerInterval);
        timerInterval = null;
        isPaused = true;
        
        // Ensure the 0-second audio plays when the timer hits zero
        const selectedEndSound = getRandomAudioFile(0);
        if (selectedEndSound) {
            timerAlarm.src = selectedEndSound;
            timerAlarm.load();
            timerAlarm.play().catch(e => console.error("Error playing end audio:", e));
        }
        
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
        
        // Play the initial start sound only if the timer is at its maximum duration
        if (timeLeftInSeconds === INITIAL_TIME_SECONDS) {
            const selectedStartSound = getRandomAudioFile(min_60);
            if (selectedStartSound) {
                timerAlarm.src = selectedStartSound;
                timerAlarm.load();
                timerAlarm.play().catch(e => console.error("Error playing start audio:", e));
                isTargetSoundPlayed = true; // Set flag so the timer doesn't play another sound at second 3599/3598, etc.
                console.log(`Playing start sound: ${selectedStartSound}`);
            }
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
    isTargetSoundPlayed = false; // Reset the flag on full reset

    // Update display and button
    updateDisplay();
    startPauseBtn.textContent = 'Start';
    startPauseBtn.classList.remove('paused'); // Ensure it looks like a fresh start button
}

function getRandomAudioFile(timeLeftInSeconds) {
    let audioList = null;

    switch (timeLeftInSeconds) {
        case min_10:
            audioList = MIN_10_AUDIO_FILES;
            break;
        case min_15:
            audioList = MIN_15_AUDIO_FILES;
            break;
        case min_20:
            audioList = MIN_20_AUDIO_FILES;
            break;
        case min_23:
            audioList = MIN_23_AUDIO_FILES;
            break;
        case min_60: // Used for the start sound in toggleTimer
            audioList = MIN_60_AUDIO_FILES;
            break;
        case min_30:
        case min_45:
            audioList = RUNNING_OUT_OF_TIME_AUDIO_FILES;
            break;
        case 0:
            audioList = NO_TIME_AUDIO_FILES;
            break;
        default:
            return null; 
    }
    
    // Select random audio from the determined list
    if (audioList && audioList.length > 0) {
        const randomIndex = Math.floor(Math.random() * audioList.length);
        return audioList[randomIndex];
    }
    return null;
}

// Attach event listeners to the buttons
startPauseBtn.addEventListener('click', toggleTimer);
resetBtn.addEventListener('click', resetTimer);

// Initial display update when the page loads
updateDisplay();