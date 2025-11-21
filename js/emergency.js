const emergencyCsvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQYZZZbzCKQ5X4If91dMyhDKwJAil4qtK23fsDBctNciNemV-qMRSiN0rUHTazIxuWmpNrbQ6ghD6gu/pub?gid=1500665154&single=true&output=csv';
const emergencyCategories = document.getElementById('emergencyCategories');
const loading = document.getElementById('loading');

// Category icons mapping - SVG icons
function getCategoryIcon(category) {
    const icons = {
        'Emergency': `<svg class="category-icon-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`,
        'General': `<svg class="category-icon-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`,
        'Medical': `<svg class="category-icon-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="12" y1="8" x2="12" y2="16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`,
        'Product': `<svg class="category-icon-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M16 10a4 4 0 0 1-8 0" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`,
        'Police': `<svg class="category-icon-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`,
        'Fire': `<svg class="category-icon-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`,
        'Tourist': `<svg class="category-icon-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`
    };
    
    return icons[category] || `<svg class="category-icon-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <line x1="9" y1="3" x2="9" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
}

// Parse CSV data - handles quoted fields with commas and newlines
function parseCSV(text) {
    const lines = [];
    let currentLine = '';
    let inQuotes = false;
    
    // First, properly split lines while respecting quoted fields
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const nextChar = text[i + 1];
        
        if (char === '"') {
            inQuotes = !inQuotes;
            currentLine += char;
        } else if (char === '\n' && !inQuotes) {
            lines.push(currentLine);
            currentLine = '';
        } else {
            currentLine += char;
        }
    }
    if (currentLine) lines.push(currentLine);
    
    if (lines.length < 2) return [];
    
    // Parse header
    const headers = parseCSVLine(lines[0]);
    
    // Parse data rows
    const contacts = [];
    for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        if (values.length >= headers.length) {
            const contact = {};
            headers.forEach((header, index) => {
                let value = (values[index] || '').trim();
                // Remove surrounding quotes if present
                if (value.startsWith('"') && value.endsWith('"')) {
                    value = value.slice(1, -1);
                }
                // Replace escaped quotes
                value = value.replace(/""/g, '"');
                contact[header] = value;
            });
            contacts.push(contact);
        }
    }
    
    return contacts;
}

// Parse a single CSV line respecting quoted fields
function parseCSVLine(line) {
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const nextChar = line[i + 1];
        
        if (char === '"') {
            if (inQuotes && nextChar === '"') {
                // Escaped quote
                current += '"';
                i++; // Skip next quote
            } else {
                // Toggle quote state
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            values.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    values.push(current);
    
    return values;
}

// Group contacts by category
function groupByCategory(contacts) {
    const grouped = {};
    contacts.forEach(contact => {
        const category = contact.Category || 'Other';
        if (!grouped[category]) {
            grouped[category] = [];
        }
        grouped[category].push(contact);
    });
    return grouped;
}

// Format phone number - add 0 prefix if needed
function formatPhoneNumber(phone) {
    if (!phone) return '';
    
    // Remove all spaces and special characters for processing
    let cleaned = phone.replace(/\s/g, '').replace(/[-\/]/g, '');
    
    // If it starts with +, keep as is
    if (cleaned.startsWith('+')) {
        return cleaned;
    }
    
    // If it doesn't start with 0, add 0 prefix
    if (!cleaned.startsWith('0')) {
        cleaned = '0' + cleaned;
    }
    
    return cleaned;
}

// Get tel: link for phone number
function getTelLink(phone) {
    if (!phone) return '';
    
    let cleaned = phone.replace(/\s/g, '').replace(/[-\/]/g, '');
    
    // If it starts with +, use as is
    if (cleaned.startsWith('+')) {
        return `tel:${cleaned}`;
    }
    
    // If it doesn't start with 0, add 0 prefix for tel link
    if (!cleaned.startsWith('0')) {
        cleaned = '0' + cleaned;
    }
    
    return `tel:${cleaned}`;
}

// Get Telegram link for username
function getTelegramLink(username) {
    if (!username) return '';
    
    // Remove @ if present
    let cleaned = username.replace(/^@/, '').trim();
    
    if (!cleaned) return '';
    
    // Return Telegram link (works on mobile and desktop)
    return `https://t.me/${cleaned}`;
}

// Phone icon SVG
function getPhoneIcon() {
    return `<svg class="contact-icon-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    </svg>`;
}

// Telegram icon SVG
function getTelegramIcon() {
    return `<svg class="contact-icon-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="currentColor"/>
    </svg>`;
}

// Display contacts
function displayContacts(contacts) {
    const grouped = groupByCategory(contacts);
    
    // Hide loading
    if (loading) {
        loading.style.display = 'none';
    }
    
    // Clear existing content
    if (emergencyCategories) {
        emergencyCategories.innerHTML = '';
    }
    
    // Sort categories (Emergency first, then alphabetically)
    const sortedCategories = Object.keys(grouped).sort((a, b) => {
        if (a === 'Emergency') return -1;
        if (b === 'Emergency') return 1;
        return a.localeCompare(b);
    });
    
    // Create category sections
    sortedCategories.forEach(category => {
        const categorySection = document.createElement('div');
        categorySection.classList.add('emergency-category');
        
        const categoryHeader = document.createElement('div');
        categoryHeader.classList.add('category-header');
        categoryHeader.innerHTML = `
            <span class="category-icon">${getCategoryIcon(category)}</span>
            <h2 class="category-title">${category}</h2>
        `;
        
        const categoryContacts = document.createElement('div');
        categoryContacts.classList.add('category-contacts');
        
        grouped[category].forEach(contact => {
            const contactItem = document.createElement('div');
            contactItem.classList.add('emergency-item-full');
            
            const name = contact.Name || 'Unknown';
            const phone = contact['Phone number'] || '';
            const telegram = contact.telegram || contact.Telegram || '';
            const description = contact.Description || '';
            
            // Format phone for display
            const displayPhone = formatPhoneNumber(phone);
            const telLink = getTelLink(phone);
            
            // Format Telegram
            const telegramLink = getTelegramLink(telegram);
            const displayTelegram = telegram ? (telegram.startsWith('@') ? telegram : '@' + telegram) : '';
            
            contactItem.innerHTML = `
                <div class="emergency-details">
                    <div class="emergency-name">${name}</div>
                    ${displayPhone ? `
                        <div class="emergency-contact-row">
                            ${getPhoneIcon()}
                            <a href="${telLink}" class="emergency-value-full emergency-phone">${displayPhone}</a>
                        </div>
                    ` : ''}
                    ${displayTelegram ? `
                        <div class="emergency-contact-row">
                            ${getTelegramIcon()}
                            <a href="${telegramLink}" target="_blank" class="emergency-value-full emergency-telegram">${displayTelegram}</a>
                        </div>
                    ` : ''}
                    ${description ? `<div class="emergency-description">${description}</div>` : ''}
                </div>
            `;
            
            categoryContacts.appendChild(contactItem);
        });
        
        categorySection.appendChild(categoryHeader);
        categorySection.appendChild(categoryContacts);
        
        if (emergencyCategories) {
            emergencyCategories.appendChild(categorySection);
        }
    });
}

// Fetch and display emergency contacts
fetch(emergencyCsvUrl)
    .then(res => res.text())
    .then(data => {
        const contacts = parseCSV(data);
        if (contacts.length > 0) {
            displayContacts(contacts);
        } else {
            if (loading) {
                loading.innerHTML = '<div>No contacts found</div>';
            }
        }
    })
    .catch(error => {
        console.error('Error fetching emergency contacts:', error);
        if (loading) {
            loading.innerHTML = '<div>Error loading contacts. Please try again later.</div>';
        }
    });

