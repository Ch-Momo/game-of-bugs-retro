// Create stars
const starsContainer = document.getElementById('stars');
for (let i = 0; i < 100; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    star.style.animationDelay = Math.random() * 3 + 's';
    starsContainer.appendChild(star);
}

// Slide navigation
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;
const currentSlideSpan = document.getElementById('current-slide');
const totalSlidesSpan = document.getElementById('total-slides');

totalSlidesSpan.textContent = totalSlides;

// Stop all timers when changing slides
function showSlide(n) {
    // Stop all running timers
    Object.keys(timerIntervals).forEach(slideNum => {
        stopTimer(parseInt(slideNum));
    });
    
    slides[currentSlide].classList.remove('active');
    currentSlide = (n + totalSlides) % totalSlides;
    slides[currentSlide].classList.add('active');
    currentSlideSpan.textContent = currentSlide + 1;
}

document.getElementById('prev').addEventListener('click', () => {
    showSlide(currentSlide - 1);
});

document.getElementById('next').addEventListener('click', () => {
    showSlide(currentSlide + 1);
});

// Sound effects (optional - commented out)
// You can add sound effects using Web Audio API or audio files
function playSound() {
    // const audio = new Audio('path-to-sound.mp3');
    // audio.play();
}

// Add click sound to buttons
document.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', playSound);
});

// Timer functionality
let timerIntervals = {};
let timerStates = {
    2: { duration: 600, remaining: 600 },  // 10 minutes
    3: { duration: 300, remaining: 300 },  // 5 minutes
    4: { duration: 900, remaining: 900 },  // 15 minutes
    5: { duration: 300, remaining: 300 }   // 5 minutes
};

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `⏱ ${mins}:${secs.toString().padStart(2, '0')}`;
}

function updateTimerDisplay(slideNum) {
    const display = document.getElementById(`timer-display-${slideNum}`);
    if (display) {
        display.textContent = formatTime(timerStates[slideNum].remaining);
        
        if (timerStates[slideNum].remaining === 0) {
            display.classList.add('finished');
            display.classList.remove('running');
            stopTimer(slideNum);
        }
    }
}

function startTimer(slideNum) {
    if (timerIntervals[slideNum]) return; // Already running
    
    const display = document.getElementById(`timer-display-${slideNum}`);
    if (display) {
        display.classList.add('running');
        display.classList.remove('finished');
    }
    
    timerIntervals[slideNum] = setInterval(() => {
        if (timerStates[slideNum].remaining > 0) {
            timerStates[slideNum].remaining--;
            updateTimerDisplay(slideNum);
        } else {
            stopTimer(slideNum);
        }
    }, 1000);
}

function stopTimer(slideNum) {
    if (timerIntervals[slideNum]) {
        clearInterval(timerIntervals[slideNum]);
        delete timerIntervals[slideNum];
        
        const display = document.getElementById(`timer-display-${slideNum}`);
        if (display) {
            display.classList.remove('running');
        }
    }
}

function resetTimer(slideNum) {
    stopTimer(slideNum);
    timerStates[slideNum].remaining = timerStates[slideNum].duration;
    updateTimerDisplay(slideNum);
    
    const display = document.getElementById(`timer-display-${slideNum}`);
    if (display) {
        display.classList.remove('finished');
    }
}

// Keyboard controls for timer
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        showSlide(currentSlide - 1);
    } else if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        showSlide(currentSlide + 1);
    } else if (e.key === 't' || e.key === 'T') {
        // Start/Stop timer for current slide
        const slideNum = currentSlide + 1;
        if (timerStates[slideNum]) {
            if (timerIntervals[slideNum]) {
                stopTimer(slideNum);
            } else {
                startTimer(slideNum);
            }
        }
    } else if (e.key === 'r' || e.key === 'R') {
        // Reset timer for current slide
        const slideNum = currentSlide + 1;
        if (timerStates[slideNum]) {
            resetTimer(slideNum);
        }
    }
});
