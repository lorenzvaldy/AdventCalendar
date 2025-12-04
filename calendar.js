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
            { day: 11, image: 'https://placehold.co/150x100/7F11E8/white?text=Day+11', quote: 'Eleven friends you must be.' },
            { day: 12, image: 'https://placehold.co/150x100/11AEE8/white?text=Day+12', quote: 'Twelve o-clock high.' },
            { day: 13, image: 'https://placehold.co/150x100/11E87F/white?text=Day+13', quote: 'Friday the 13th - a lucky day!' },
            { day: 14, image: 'https://placehold.co/150x100/E87F11/white?text=Day+14', quote: 'Two weeks have passed.' },
            { day: 15, image: 'https://placehold.co/150x100/E8112A/white?text=Day+15', quote: 'Fifteen minutes of fame.' },
            { day: 16, image: 'https://placehold.co/150x100/E8DA11/white?text=Day+16', quote: 'Sweet 16.' },
            { day: 17, image: 'https://placehold.co/150x100/5211E8/white?text=Day+17', quote: 'Seventeen and four.' },
            { day: 18, image: 'https://placehold.co/150x100/11E8B6/white?text=Day+18', quote: 'Finally 18!' },
            { day: 19, image: 'https://placehold.co/150x100/E8117F/white?text=Day+19', quote: 'Nineteen-hundred...' },
            { day: 20, image: 'https://placehold.co/150x100/7F11E8/white?text=Day+20', quote: 'Twenty percent off.' },
            { day: 21, image: 'https://placehold.co/150x100/11AEE8/white?text=Day+21', quote: 'Twenty-one.' },
            { day: 22, image: 'https://placehold.co/150x100/11E87F/white?text=Day+22', quote: 'Twenty-two... two ducks.' },
            { day: 23, image: 'https://placehold.co/150x100/E87F11/white?text=Day+23', quote: 'December 23rd, almost there.' },
            { day: 24, image: 'https://placehold.co/150x100/E8112A/white?text=Day+24', quote: 'Merry Christmas!' }
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
        //this.setTestDate(15, 12); // Simulate December 15th
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

        modalImage.src = dayData.image;
        modalImage.alt = `Surprise Day ${dayData.day}`;
        modalQuote.textContent = dayData.quote;

        this.modal.classList.add('show');
    }

    /**
     * Close the modal
     */
    closeModal() {
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
