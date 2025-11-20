const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQYZZZbzCKQ5X4If91dMyhDKwJAil4qtK23fsDBctNciNemV-qMRSiN0rUHTazIxuWmpNrbQ6ghD6gu/pub?gid=685795691&single=true&output=csv';
const container = document.getElementById('carousel');
const destinationLabel = document.getElementById('destinationLabel');
let slides = [];
let slidesData = [];
let currentIndex = 0;
let isTransitioning = false;

// Format duration from HH:MM:SS to readable format
function formatDuration(durationStr) {
    if (!durationStr) return '';
    
    // Handle format like "4:00:00" or "04:00:00"
    const parts = durationStr.split(':');
    if (parts.length >= 2) {
        const hours = parseInt(parts[0]);
        const minutes = parseInt(parts[1]);
        
        if (hours > 0 && minutes > 0) {
            return `${hours} Hours ${minutes} Min`;
        } else if (hours > 0) {
            return `${hours} ${hours === 1 ? 'Hour' : 'Hours'}`;
        } else if (minutes > 0) {
            return `${minutes} Min`;
        }
    }
    
    return durationStr;
}

// Format time from "10:20:00 AM" to "10:20 AM"
function formatTime(timeStr) {
    if (!timeStr) return '';
    
    // Remove seconds if present (e.g., "10:20:00 AM" -> "10:20 AM")
    return timeStr.replace(/(\d{1,2}:\d{2}):\d{2}(\s*[AP]M)/i, '$1$2');
}

// Parse time string "HH:MM" or "HH:MM AM/PM" to minutes since midnight
function timeToMinutes(timeStr) {
    if (!timeStr) return 0;
    
    // Remove any extra whitespace
    timeStr = timeStr.trim();
    
    // Check if it has AM/PM
    const hasAMPM = /AM|PM/i.test(timeStr);
    
    if (hasAMPM) {
        // Parse 12-hour format (e.g., "10:20 AM")
        const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
        if (!match) return 0;
        
        let hours = parseInt(match[1]);
        const minutes = parseInt(match[2]);
        const period = match[3].toUpperCase();
        
        // Convert to 24-hour format
        if (period === 'PM' && hours !== 12) {
            hours += 12;
        } else if (period === 'AM' && hours === 12) {
            hours = 0;
        }
        
        return hours * 60 + minutes;
    } else {
        // Parse 24-hour format (e.g., "10:20" or "14:30")
        const parts = timeStr.split(':');
        const hours = parseInt(parts[0]);
        const minutes = parseInt(parts[1]) || 0;
        return hours * 60 + minutes;
    }
}

// Get current time in minutes
function getCurrentTimeInMinutes() {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
}

// Find the current destination based on time
function findCurrentDestinationIndex(data) {
    const currentTime = getCurrentTimeInMinutes();
    
    for (let i = 0; i < data.length; i++) {
        const startTime = timeToMinutes(data[i].start);
        const endTime = timeToMinutes(data[i].end);
        
        // Handle cases where end time is past midnight
        if (endTime < startTime) {
            // Activity spans midnight
            if (currentTime >= startTime || currentTime <= endTime) {
                return i;
            }
        } else {
            // Normal case
            if (currentTime >= startTime && currentTime <= endTime) {
                return i;
            }
        }
    }
    
    // If no match, find the next upcoming activity
    for (let i = 0; i < data.length; i++) {
        const startTime = timeToMinutes(data[i].start);
        if (currentTime < startTime) {
            return i;
        }
    }
    
    // Default to first activity if all activities are in the past
    return 0;
}

// Update destination label
function updateDestinationLabel() {
    const totalSlides = slides.length;
    if (totalSlides === 0) return;
    
    const nextIndex = (currentIndex + 1) % totalSlides;
    
    if (currentIndex === findCurrentDestinationIndex(slidesData)) {
        destinationLabel.textContent = 'Current Destination';
    } else if (currentIndex === nextIndex) {
        destinationLabel.textContent = 'Destination';
    } else {
        destinationLabel.textContent = 'Next Destination';
    }
}

fetch(csvUrl)
    .then(res => res.text())
    .then(data => {
        const rows = data.trim().split('\n').map(r => r.split(','));
        const headers = rows[0].map(h => h.trim());

        // Clear loading
        container.innerHTML = '';

        // Parse all data first
        rows.slice(1).forEach((row) => {
            const field = name => (row[headers.indexOf(name)] || "").trim();
            
            slidesData.push({
                duration: formatDuration(field("រយៈពេល")),
                location: field("ទីតាំង"),
                start: formatTime(field("ផ្តើម")),
                end: formatTime(field("ចប់")),
                activity: field("សកម្មភាព")
            });
        });

        // Find current destination index
        const currentDestinationIndex = findCurrentDestinationIndex(slidesData);
        currentIndex = currentDestinationIndex;

        // Create slides
        slidesData.forEach((slideData, index) => {
            const slide = document.createElement('div');
            slide.classList.add('carousel-slide');
            slide.style.backgroundImage = `url('https://i.postimg.cc/mZ9sfBH8/Cambodia-temple-9.jpg')`;
            
            slide.innerHTML = `
                <div class="slide-content">
                    <div class="duration-badge">${slideData.duration}</div>
                    <h1 class="slide-title">${slideData.location}</h1>
                    <div class="time-range">
                        <span>${slideData.start}</span>
                        <span class="time-separator">—</span>
                        <span>${slideData.end}</span>
                    </div>
                    <p class="slide-description">${slideData.activity}</p>
                    <button class="cta-button">
                        Explore Now
                        <span class="arrow">→</span>
                    </button>
                </div>
            `;
            
            container.appendChild(slide);
            slides.push(slide);
        });

        // Initialize to current destination
        if (slides.length > 0) {
            slides[currentIndex].classList.add('active');
            const offset = currentIndex * window.innerWidth;
            container.style.transform = `translate3d(-${offset}px, 0, 0)`;
            updateDestinationLabel();
        }

        setupTouchHandlers();
        setupKeyboardNav();
        setupMouseDrag();
    })
    .catch(err => {
        console.error('Error:', err);
        container.innerHTML = '<div class="loading"><div class="loading-spinner"></div><div>Error loading content</div></div>';
    });

function setupTouchHandlers() {
    let startX = 0, startY = 0, isDragging = false;

    container.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isDragging = true;
    }, { passive: true });

    container.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const diffY = Math.abs(e.touches[0].clientY - startY);
        const diffX = Math.abs(e.touches[0].clientX - startX);
        if (diffX > diffY && diffX > 10) {
            e.preventDefault();
        }
    }, { passive: false });

    container.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        const diff = e.changedTouches[0].clientX - startX;
        if (Math.abs(diff) > 50 && !isTransitioning) {
            diff > 0 ? prevSlide() : nextSlide();
        }
        isDragging = false;
    }, { passive: true });
}

function setupKeyboardNav() {
    document.addEventListener('keydown', (e) => {
        if (isTransitioning) return;
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
    });
}

function setupMouseDrag() {
    let startX = 0, isDragging = false;

    container.addEventListener('mousedown', (e) => {
        startX = e.clientX;
        isDragging = true;
    });

    container.addEventListener('mouseup', (e) => {
        if (!isDragging) return;
        const diff = e.clientX - startX;
        if (Math.abs(diff) > 50 && !isTransitioning) {
            diff > 0 ? prevSlide() : nextSlide();
        }
        isDragging = false;
    });
}

function updateSlides() {
    isTransitioning = true;
    const offset = currentIndex * window.innerWidth;
    container.style.transform = `translate3d(-${offset}px, 0, 0)`;
    
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === currentIndex);
    });

    updateDestinationLabel();

    setTimeout(() => isTransitioning = false, 500);
}

function nextSlide() {
    if (isTransitioning || slides.length === 0) return;
    currentIndex = (currentIndex + 1) % slides.length;
    updateSlides();
}

function prevSlide() {
    if (isTransitioning || slides.length === 0) return;
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateSlides();
}

window.addEventListener('resize', () => {
    if (!isTransitioning) {
        const offset = currentIndex * window.innerWidth;
        container.style.transform = `translate3d(-${offset}px, 0, 0)`;
    }
});

// Auto-update current destination every minute
setInterval(() => {
    const newCurrentIndex = findCurrentDestinationIndex(slidesData);
    if (newCurrentIndex !== currentIndex) {
        currentIndex = newCurrentIndex;
        updateSlides();
    }
}, 60000); // Check every minute