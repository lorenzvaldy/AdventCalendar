/**
 * ================================================
 * ADVENT CALENDAR - MAIN JAVASCRIPT FILE
 * ================================================
 * Advanced calendar with state management,
 * local storage, and complex animations.
 */

class AdventCalendar {
    constructor() {
        this.calendarData = this.getCalendarData();
        this.openedDoors = this.loadOpenedDoors();
        this.currentDay = null;
        this.currentMonth = null;
        this.doorElements = {};
        this.modal = null;
        this.init();
    }

    /**
     * Initialize calendar data - EDIT THIS SECTION
     */
    getCalendarData() {
        return [
            { day: 1, image: 'img/orangeade.png', quote: 'When Life Gives You Oranges, Make it "Orange"ade.' },
            { day: 2, image: 'img/warm_noodle.png', quote: 'One kind word can warm three winter months' },
            { day: 3, image: 'img/nuts.png', quote: 'Have nuts and be nuts!' },
            { day: 4, image: 'img/hug.png', quote: 'Sometimes, all you need is just a warm hug' },
            { day: 5, image: 'img/cracker.png', quote: 'The journey of a thousand miles begins with a single cracker.' },
            { day: 6, image: 'img/bubble.png', quote: 'One bubble a day keep the stress away.' },
            { day: 7, image: 'img/corn.png', quote: 'Be like corn, versatile and delicious.' },
            { day: 8, image: 'img/notes.png', quote: 'Memory fails; the note persists.' },
            { day: 9, image: 'img/coffee.png', quote: 'Behind every successful person is a substantial amount of coffee.' },
            { day: 10, image: 'img/door.png', quote: 'An opened door doesn\'t mean you must get in, you can take a look and just close it' },
            { day: 11, image: 'img/pocky.png', quote: 'Remember this game?' },
            { day: 12, image: 'img/pen.png', quote: 'When the mind is overloaded, a pen and paper become a spillway; the physical motion of writing pulls the voltage from the thought.' },
            { day: 13, image: 'img/positivitea.png', quote: 'Have a cup of positivitea' },
            { day: 14, image: 'img/candle.png', quote: 'Don\'t curse the darkness, bring your own light.' },
            { day: 15, image: 'img/manner.png', quote: 'Manner maketh lady' },
            { day: 16, image: 'img/einkauftasche.png', quote: 'Hide in a cave, crumpled-up like a ball, but open me up, I will devour anything and I outlive you' },
            { day: 17, image: 'img/run.png', quote: 'Ini yaa buat larinya makin cepet' },
            { day: 18, image: 'img/antis.png', quote: 'The thing so effective it kills 99.9% of the population, leaving a witness to warn the next generation.' },
            { day: 19, image: 'img/nyariapa.mp4', quote: 'nyari apaa kamuu cayanggg' },
            { day: 20, image: 'img/perahu.png', quote: 'Berakit-rakit ke hulu, Berenang-renang ke tepian. Kamu di kereta berjuang dulu, biar bisa sama aku nanti seharian.' },
            { day: 21, image: 'img/movie.png', quote: 'Genuine romance in a movie night is the disciplined synchronization of two individuals surrendering their skepticism to the same curated illusion.' },
            { day: 22, image: 'img/album.png', quote: 'Proof of every reason to stay, record of every occasion to reminisce' },
            { day: 23, image: 'img/protect.png', quote: 'Protect what you cherish' },
            { day: 24, image: 'img/akhirnya.png', quote: 'Akhirnya bisa bareng kamu lagi christmasnyaa' }
        ];
    }

    /**
     * FOR TESTING - Uncomment to simulate a specific date
     */
    setTestDate(day, month) {
        this.currentDay = day;
        this.currentMonth = month;
    }

    /**
     * Load opened doors from localStorage
     */
    loadOpenedDoors() {
        const stored = localStorage.getItem('adventCalendarOpened');
        return stored ? JSON.parse(stored) : [];
    }

    /**
     * Save opened doors to localStorage
     */
    saveOpenedDoors() {
        localStorage.setItem('adventCalendarOpened', JSON.stringify(this.openedDoors));
    }

    /**
     * Initialize the calendar
     */
    init() {
        const today = new Date();
        this.currentDay = today.getDate();
        this.currentMonth = today.getMonth() + 1;

        // --- FOR TESTING ---
        // Uncomment to test with a specific date
        // this.setTestDate(19, 12); // Simulate December 19th
        // ---------------------

        this.updateDateDisplay();
        this.initModal();
        this.renderCalendar();
        this.updateStats();
    }

    /**
     * Initialize the modal
     */
    initModal() {
        this.modal = document.getElementById('doorModal');
        const closeBtn = this.modal.querySelector('.modal-close');

        // Close modal when clicking the X
        closeBtn.addEventListener('click', () => this.closeModal());

        // Close modal when clicking outside
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('show')) {
                this.closeModal();
            }
        });
    }

    /**
     * Show modal with door content
     */
    showModal(dayData) {
        const modalImage = document.getElementById('modalImage');
        const modalQuote = document.getElementById('modalQuote');

        const modalVideo = document.getElementById('modalVideo');

        if (dayData.image.endsWith('.mp4')) {
            modalImage.style.display = 'none';
            modalVideo.style.display = 'block';
            modalVideo.src = dayData.image;
            // Ensure it plays
            modalVideo.play().catch(e => console.log("Autoplay prevented:", e));
        } else {
            modalVideo.style.display = 'none';
            modalImage.style.display = 'block';
            modalVideo.pause();
            modalImage.src = dayData.image;
            modalImage.alt = `Surprise Day ${dayData.day}`;
        }

        modalQuote.textContent = dayData.quote;

        this.modal.classList.add('show');
    }

    /**
     * Close the modal
     */
    closeModal() {
        const modalVideo = document.getElementById('modalVideo');
        if (modalVideo) {
            modalVideo.pause();
            modalVideo.currentTime = 0;
        }
        this.modal.classList.remove('show');
    }

    /**
     * Update the date display at the top
     */
    updateDateDisplay() {
        const dateDisplay = document.getElementById('dateDisplay');
        const months = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];
        const dateStr = `${months[this.currentMonth - 1]} ${this.currentDay}, 2025`;
        dateDisplay.textContent = `Today is: ${dateStr}`;
    }

    /**
     * Check if a door should be locked
     */
    isDoorLocked(dayNumber) {
        return this.currentMonth !== 12 || this.currentDay < dayNumber;
    }

    /**
     * Check if a door has been opened
     */
    isDoorOpened(dayNumber) {
        return this.openedDoors.includes(dayNumber);
    }

    /**
     * Toggle door open/close state
     */
    toggleDoor(dayNumber) {
        const door = this.doorElements[dayNumber];
        console.log('Door clicked:', dayNumber, 'Locked:', this.isDoorLocked(dayNumber));

        if (this.isDoorLocked(dayNumber)) {
            this.playShakeAnimation(door);
            return;
        }

        // Open door and show modal
        const dayData = this.calendarData.find(d => d.day === dayNumber);
        if (dayData) {
            door.classList.add('bounce');
            if (!this.openedDoors.includes(dayNumber)) {
                this.openedDoors.push(dayNumber);
                door.classList.add('open');
            }
            // Remove bounce animation after it completes
            setTimeout(() => door.classList.remove('bounce'), 600);

            // Show modal with content
            this.showModal(dayData);
        }

        this.saveOpenedDoors();
        this.updateStats();
    }

    /**
     * Play shake animation
     */
    playShakeAnimation(door) {
        door.classList.add('shake');
        setTimeout(() => door.classList.remove('shake'), 500);
    }

    /**
     * Create a single door element
     */
    createDoor(dayData) {
        console.log(`Creating door for day ${dayData.day}:`, dayData);
        const door = document.createElement('div');
        door.classList.add('calendar-door', 'door-entrance');
        door.dataset.day = dayData.day;

        // Determine initial state
        const isLocked = this.isDoorLocked(dayData.day);
        const isOpened = this.isDoorOpened(dayData.day);

        if (isLocked) {
            door.classList.add('locked');
        } else {
            door.classList.add('unlocked');
        }

        if (isOpened && !isLocked) {
            door.classList.add('open');
        }

        // Create door inner
        const doorInner = document.createElement('div');
        doorInner.classList.add('door-inner');

        // Create door front
        const doorFront = document.createElement('div');
        doorFront.classList.add('door-front');
        doorFront.innerHTML = `
            <span>${dayData.day}</span>
            <div class="lock-icon">${isLocked ? '🔒' : '🎁'}</div>
        `;

        // Create door back (empty now, content shown in modal)
        const doorBack = document.createElement('div');
        doorBack.classList.add('door-back');
        doorBack.innerHTML = '<span>🎁</span>';

        // Assemble door
        doorInner.appendChild(doorFront);
        doorInner.appendChild(doorBack);
        door.appendChild(doorInner);

        // Add click listener
        door.addEventListener('click', () => this.toggleDoor(dayData.day));

        // Store reference
        this.doorElements[dayData.day] = door;

        return door;
    }

    /**
     * Render all calendar doors
     */
    renderCalendar() {
        const grid = document.getElementById('calendarGrid');
        grid.innerHTML = ''; // Clear existing

        this.calendarData.forEach((dayData, index) => {
            const door = this.createDoor(dayData);
            // Stagger animation
            door.style.animationDelay = `${index * 0.05}s`;
            grid.appendChild(door);
        });
    }

    /**
     * Update statistics
     */
    updateStats() {
        const unlockedDays = this.calendarData.filter(d => !this.isDoorLocked(d.day));
        const openedCount = this.openedDoors.length;
        const progressPercentage = Math.round((openedCount / 24) * 100);

        document.getElementById('daysUnlocked').textContent = unlockedDays.length;
        document.getElementById('daysOpened').textContent = openedCount;
        document.getElementById('progressPercentage').textContent = `${progressPercentage}%`;
    }

    /**
     * Reset all doors
     */
    resetCalendar() {
        if (confirm('Are you sure you want to reset all opened doors?')) {
            this.openedDoors = [];
            this.saveOpenedDoors();
            this.renderCalendar();
            this.updateStats();
        }
    }

    /**
     * Get calendar status
     */
    getStatus() {
        return {
            today: `December ${this.currentDay}`,
            unlockedDoors: this.calendarData.filter(d => !this.isDoorLocked(d.day)).length,
            openedDoors: this.openedDoors.length,
            progress: Math.round((this.openedDoors.length / 24) * 100)
        };
    }
}

// Initialize calendar when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.calendar = new AdventCalendar();

    // Expose reset function to console for testing
    window.resetCalendar = () => window.calendar.resetCalendar();

    console.log('🎄 Advent Calendar loaded! Type "resetCalendar()" to reset.');
    console.log('Status:', window.calendar.getStatus());
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AdventCalendar };
}
