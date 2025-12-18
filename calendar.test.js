
const { AdventCalendar } = require('./calendar');

describe('AdventCalendar', () => {
    let calendar;

    // Mock localStorage
    const localStorageMock = (() => {
        let store = {};
        return {
            getItem: (key) => store[key] || null,
            setItem: (key, value) => store[key] = value.toString(),
            clear: () => store = {}
        };
    })();

    Object.defineProperty(window, 'localStorage', {
        value: localStorageMock
    });

    beforeEach(() => {
        // Clear localStorage
        window.localStorage.clear();

        // Setup DOM elements
        document.body.innerHTML = `
            <div id="dateDisplay"></div>
            <div id="calendarGrid"></div>
            <div id="daysUnlocked"></div>
            <div id="daysOpened"></div>
            <div id="progressPercentage"></div>
            <div id="doorModal" class="modal">
                <span class="modal-close">&times;</span>
                <img id="modalImage" />
                <video id="modalVideo"></video>
                <p id="modalQuote"></p>
            </div>
        `;

        // Mock window.confirm
        window.confirm = jest.fn(() => true);

        // Initialize calendar
        calendar = new AdventCalendar();
    });

    beforeAll(() => {
        // Mock HTMLMediaElement methods which are not implemented in JSDOM
        Object.defineProperty(global.window.HTMLMediaElement.prototype, 'play', {
            configurable: true,
            get() {
                return () => Promise.resolve(); // Function that returns a promise
            },
        });
        Object.defineProperty(global.window.HTMLMediaElement.prototype, 'pause', {
            configurable: true,
            get() {
                return () => { }; // No-op function
            },
        });

        // Silence console logs during tests
        jest.spyOn(console, 'log').mockImplementation(() => { });
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    test('should initialize with correct date', () => {
        // By default it sets to Dec 19 (for testing purposes in the original code)
        // We might want to fix that in the real code, but for now we test the behavior as is or mocked
        // The original code has hardcoded: this.setTestDate(19, 12);
        expect(calendar.currentDay).toBe(19);
        expect(calendar.currentMonth).toBe(12);
    });

    test('should have 24 calendar data entries', () => {
        expect(calendar.calendarData.length).toBe(24);
    });

    test('should lock future doors', () => {
        // Current date is set to 19th
        // Door 20 should be locked
        expect(calendar.isDoorLocked(20)).toBe(true);
        // Door 19 should be unlocked (if logic is < dayNumber, wait: 19 < 19 is false, so unlocked)
        // Logic: currentMonth !== 12 || currentDay < dayNumber
        // 12 === 12, 19 < 19 is false -> Unlocked
        expect(calendar.isDoorLocked(19)).toBe(false);
        // Door 18 should be unlocked
        expect(calendar.isDoorLocked(18)).toBe(false);
    });

    test('should open a door when clicked if unlocked', () => {
        const door1 = calendar.doorElements[1];

        // Initial state
        expect(calendar.isDoorOpened(1)).toBe(false);

        // Click door 1
        calendar.toggleDoor(1);

        // Should be opened
        expect(calendar.isDoorOpened(1)).toBe(true);
        expect(door1.classList.contains('open')).toBe(true);

        // Modal should show
        const modal = document.getElementById('doorModal');
        expect(modal.classList.contains('show')).toBe(true);
    });

    test('should NOT open a door when clicked if locked', () => {
        const door24 = calendar.doorElements[24]; // Day 24 is locked on Day 19

        calendar.toggleDoor(24);

        expect(calendar.isDoorOpened(24)).toBe(false);
        expect(door24.classList.contains('open')).toBe(false);
        expect(door24.classList.contains('shake')).toBe(true);
    });

    test('should persist opened doors to localStorage', () => {
        calendar.toggleDoor(1);

        const stored = JSON.parse(window.localStorage.getItem('adventCalendarOpened'));
        expect(stored).toContain(1);

        // Create new instance to test loading
        const newCalendar = new AdventCalendar();
        expect(newCalendar.isDoorOpened(1)).toBe(true);
    });
});
