// Enhanced Campus Map Admin Panel JavaScript
// Mock data for demonstration - in production this would come from APIs

const adminData = {
    dashboard: {
        totalUsers: 1248,
        totalLocations: 12,
        totalSearches: 5847,
        totalBuildings: 9
    },
    locations: [
        { id: 1, name: 'Xerox Center', coordinates: '[22.6016, 72.8205]', type: 'Service', status: 'active' },
        { id: 2, name: 'Bank', coordinates: '[22.6012, 72.8205]', type: 'Service', status: 'active' },
        { id: 3, name: 'Canteen', coordinates: '[22.6015, 72.8205]', type: 'Food', status: 'active' },
        { id: 4, name: 'Admin Office', coordinates: '[22.5994, 72.8205]', type: 'Office', status: 'active' },
        { id: 5, name: 'Hospital', coordinates: '[22.6027, 72.8213]', type: 'Medical', status: 'active' }
    ],
    buildings: [
        { 
            name: 'A2 Building RPCP', 
            description: 'Research and Project Center', 
            coordinates: '[22.5994, 72.8198]',
            facilities: ['Research Labs', 'Project Rooms', 'Conference Hall']
        },
        { 
            name: 'A3 Building IIIM', 
            description: 'Institute of Infrastructure, Technology, Research and Management', 
            coordinates: '[22.6000, 72.8208]',
            facilities: ['Lecture Halls', 'Computer Labs', 'Library']
        },
        { 
            name: 'A5 DEPSTAR BUILDING', 
            description: 'Department of Science and Technology', 
            coordinates: '[22.6008, 72.8203]',
            facilities: ['Science Labs', 'Engineering Workshops', 'Cafeteria']
        }
    ],
    popularSearches: [
        { term: 'Canteen', count: 1247 },
        { term: 'Library', count: 892 },
        { term: 'Hospital', count: 634 },
        { term: 'Bank', count: 567 },
        { term: 'Xerox', count: 445 }
    ],
    favoriteLocations: [
        { location: 'Canteen', users: 456 },
        { location: 'Library', users: 334 },
        { location: 'Bank', users: 267 },
        { location: 'Hospital', users: 189 },
        { location: 'Admin Office', users: 123 }
    ],
    recentActivity: [
        { action: 'User searched for "Canteen"', time: '2 minutes ago', type: 'user' },
        { action: 'Location "Hospital" was updated', time: '15 minutes ago', type: 'system' },
        { action: 'New user registered', time: '1 hour ago', type: 'user' },
        { action: 'System backup completed', time: '2 hours ago', type: 'system' },
        { action: 'Error: Failed to load map tiles', time: '3 hours ago', type: 'error' }
    ],
    logs: [
        { id: 1, message: 'User searched for "Library"', type: 'user', timestamp: '2024-08-02 14:30:00' },
        { id: 2, message: 'Database backup completed successfully', type: 'system', timestamp: '2024-08-02 12:00:00' },
        { id: 3, message: 'Failed to connect to geocoding service', type: 'error', timestamp: '2024-08-02 11:45:00' },
        { id: 4, message: 'New location added: Study Room', type: 'system', timestamp: '2024-08-02 10:15:00' }
    ]
};

// Global state management
const adminState = {
    currentSection: 'dashboard',
    isLoading: false,
    settings: {
        defaultTheme: 'streets',
        enableAnimations: true,
        maxSearchResults: 10,
        autoSave: true,
        sessionTimeout: 30
    }
};

// Utility Functions
const utils = {
    // Show toast notification
    showToast(message, type = 'success') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        container.appendChild(toast);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 5000);
    },

    // Show loading overlay
    showLoading() {
        document.getElementById('loading-overlay').style.display = 'flex';
        adminState.isLoading = true;
    },

    // Hide loading overlay
    hideLoading() {
        document.getElementById('loading-overlay').style.display = 'none';
        adminState.isLoading = false;
    },

    // Format date
    formatDate(dateString) {
        return new Date(dateString).toLocaleString();
    },

    // Format numbers with commas
    formatNumber(num) {
        return num.toLocaleString();
    },

    // Create modal
    createModal(title, content, actions = []) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close" onclick="closeModal()">&times;</button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
                <div class="modal-footer">
                    ${actions.map(action => `<button class="btn ${action.class}" onclick="${action.onclick}">${action.text}</button>`).join('')}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        return modal;
    }
};

// Initialize Admin Panel
function initializeAdmin() {
    console.log('🚀 Campus Map Admin Panel Initialized');
    
    // Load dashboard by default
    showSection('dashboard');
    
    // Setup navigation
    setupNavigation();
    
    // Load initial data
    loadDashboardData();
    
    // Setup event listeners
    setupEventListeners();
    
    utils.showToast('Admin panel loaded successfully!', 'success');
}

// Navigation Setup
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Add active class to clicked item
            item.classList.add('active');
            
            // Show corresponding section
            const section = item.getAttribute('data-section');
            showSection(section);
        });
    });
}

// Show Section
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.classList.add('active');
        adminState.currentSection = sectionName;
        
        // Load section-specific data
        loadSectionData(sectionName);
    }
}

// Load Section Data
function loadSectionData(sectionName) {
    switch (sectionName) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'locations':
            loadLocationsData();
            break;
        case 'buildings':
            loadBuildingsData();
            break;
        case 'users':
            loadUserAnalytics();
            break;
        case 'logs':
            loadActivityLogs();
            break;
        default:
            console.log(`Loading data for ${sectionName}`);
    }
}

// Dashboard Functions
function loadDashboardData() {
    const { totalUsers, totalLocations, totalSearches, totalBuildings } = adminData.dashboard;
    
    // Update stat cards
    document.getElementById('total-users').textContent = utils.formatNumber(totalUsers);
    document.getElementById('total-locations').textContent = utils.formatNumber(totalLocations);
    document.getElementById('total-searches').textContent = utils.formatNumber(totalSearches);
    document.getElementById('total-buildings').textContent = utils.formatNumber(totalBuildings);
    
    // Load recent activity
    loadRecentActivity();
}

function loadRecentActivity() {
    const container = document.getElementById('recent-activity');
    container.innerHTML = '';
    
    adminData.recentActivity.forEach(activity => {
        const item = document.createElement('div');
        item.className = 'activity-item';
        item.innerHTML = `
            <div class="activity-content">
                <div class="activity-message">${activity.action}</div>
                <div class="activity-time">${activity.time}</div>
            </div>
            <span class="log-type ${activity.type}">${activity.type}</span>
        `;
        container.appendChild(item);
    });
}

function refreshDashboard() {
    utils.showLoading();
    
    // Simulate API call
    setTimeout(() => {
        loadDashboardData();
        utils.hideLoading();
        utils.showToast('Dashboard refreshed successfully!', 'success');
    }, 1000);
}

// Locations Management
function loadLocationsData() {
    const tbody = document.getElementById('locations-table-body');
    tbody.innerHTML = '';
    
    adminData.locations.forEach(location => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${location.id}</td>
            <td>${location.name}</td>
            <td>${location.coordinates}</td>
            <td>${location.type}</td>
            <td><span class="status-badge status-${location.status}">${location.status}</span></td>
            <td>
                <button class="btn btn-primary" onclick="editLocation(${location.id})">Edit</button>
                <button class="btn btn-danger" onclick="deleteLocation(${location.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function showAddLocationModal() {
    const content = `
        <div class="form-group">
            <label>Location Name:</label>
            <input type="text" id="location-name" placeholder="Enter location name">
        </div>
        <div class="form-group">
            <label>Coordinates:</label>
            <input type="text" id="location-coords" placeholder="[latitude, longitude]">
        </div>
        <div class="form-group">
            <label>Type:</label>
            <select id="location-type">
                <option value="Service">Service</option>
                <option value="Food">Food</option>
                <option value="Office">Office</option>
                <option value="Medical">Medical</option>
                <option value="Academic">Academic</option>
            </select>
        </div>
    `;
    
    const actions = [
        { text: 'Cancel', class: 'btn-secondary', onclick: 'closeModal()' },
        { text: 'Add Location', class: 'btn-primary', onclick: 'addLocation()' }
    ];
    
    utils.createModal('Add New Location', content, actions);
}

function addLocation() {
    const name = document.getElementById('location-name').value;
    const coords = document.getElementById('location-coords').value;
    const type = document.getElementById('location-type').value;
    
    if (!name || !coords || !type) {
        utils.showToast('Please fill all fields', 'error');
        return;
    }
    
    // Add to data (in production, this would be an API call)
    const newLocation = {
        id: adminData.locations.length + 1,
        name,
        coordinates: coords,
        type,
        status: 'active'
    };
    
    adminData.locations.push(newLocation);
    loadLocationsData();
    closeModal();
    utils.showToast('Location added successfully!', 'success');
}

function editLocation(id) {
    const location = adminData.locations.find(loc => loc.id === id);
    if (!location) return;
    
    const content = `
        <div class="form-group">
            <label>Location Name:</label>
            <input type="text" id="edit-location-name" value="${location.name}">
        </div>
        <div class="form-group">
            <label>Coordinates:</label>
            <input type="text" id="edit-location-coords" value="${location.coordinates}">
        </div>
        <div class="form-group">
            <label>Type:</label>
            <select id="edit-location-type">
                <option value="Service" ${location.type === 'Service' ? 'selected' : ''}>Service</option>
                <option value="Food" ${location.type === 'Food' ? 'selected' : ''}>Food</option>
                <option value="Office" ${location.type === 'Office' ? 'selected' : ''}>Office</option>
                <option value="Medical" ${location.type === 'Medical' ? 'selected' : ''}>Medical</option>
                <option value="Academic" ${location.type === 'Academic' ? 'selected' : ''}>Academic</option>
            </select>
        </div>
    `;
    
    const actions = [
        { text: 'Cancel', class: 'btn-secondary', onclick: 'closeModal()' },
        { text: 'Update Location', class: 'btn-primary', onclick: `updateLocation(${id})` }
    ];
    
    utils.createModal('Edit Location', content, actions);
}

function updateLocation(id) {
    const name = document.getElementById('edit-location-name').value;
    const coords = document.getElementById('edit-location-coords').value;
    const type = document.getElementById('edit-location-type').value;
    
    if (!name || !coords || !type) {
        utils.showToast('Please fill all fields', 'error');
        return;
    }
    
    // Update data
    const location = adminData.locations.find(loc => loc.id === id);
    if (location) {
        location.name = name;
        location.coordinates = coords;
        location.type = type;
        
        loadLocationsData();
        closeModal();
        utils.showToast('Location updated successfully!', 'success');
    }
}

function deleteLocation(id) {
    if (confirm('Are you sure you want to delete this location?')) {
        adminData.locations = adminData.locations.filter(loc => loc.id !== id);
        loadLocationsData();
        utils.showToast('Location deleted successfully!', 'success');
    }
}

// Buildings Management
function loadBuildingsData() {
    const tbody = document.getElementById('buildings-table-body');
    tbody.innerHTML = '';
    
    adminData.buildings.forEach(building => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${building.name}</td>
            <td>${building.description}</td>
            <td>${building.coordinates}</td>
            <td>${building.facilities.join(', ')}</td>
            <td>
                <button class="btn btn-primary" onclick="editBuilding('${building.name}')">Edit</button>
                <button class="btn btn-danger" onclick="deleteBuilding('${building.name}')">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function showAddBuildingModal() {
    const content = `
        <div class="form-group">
            <label>Building Name:</label>
            <input type="text" id="building-name" placeholder="Enter building name">
        </div>
        <div class="form-group">
            <label>Description:</label>
            <textarea id="building-description" placeholder="Enter description"></textarea>
        </div>
        <div class="form-group">
            <label>Coordinates:</label>
            <input type="text" id="building-coords" placeholder="[latitude, longitude]">
        </div>
        <div class="form-group">
            <label>Facilities (comma-separated):</label>
            <input type="text" id="building-facilities" placeholder="Lab, Library, Cafeteria">
        </div>
    `;
    
    const actions = [
        { text: 'Cancel', class: 'btn-secondary', onclick: 'closeModal()' },
        { text: 'Add Building', class: 'btn-primary', onclick: 'addBuilding()' }
    ];
    
    utils.createModal('Add New Building', content, actions);
}

function addBuilding() {
    const name = document.getElementById('building-name').value;
    const description = document.getElementById('building-description').value;
    const coords = document.getElementById('building-coords').value;
    const facilities = document.getElementById('building-facilities').value.split(',').map(f => f.trim());
    
    if (!name || !description || !coords) {
        utils.showToast('Please fill all required fields', 'error');
        return;
    }
    
    const newBuilding = {
        name,
        description,
        coordinates: coords,
        facilities
    };
    
    adminData.buildings.push(newBuilding);
    loadBuildingsData();
    closeModal();
    utils.showToast('Building added successfully!', 'success');
}

// User Analytics
function loadUserAnalytics() {
    // Load popular searches
    const searchContainer = document.getElementById('popular-searches');
    searchContainer.innerHTML = '';
    
    adminData.popularSearches.forEach(search => {
        const item = document.createElement('div');
        item.className = 'search-item';
        item.innerHTML = `
            <span class="search-term">${search.term}</span>
            <span class="search-count">${utils.formatNumber(search.count)} searches</span>
        `;
        searchContainer.appendChild(item);
    });
    
    // Load favorite locations
    const favContainer = document.getElementById('favorite-locations');
    favContainer.innerHTML = '';
    
    adminData.favoriteLocations.forEach(fav => {
        const item = document.createElement('div');
        item.className = 'favorite-item';
        item.innerHTML = `
            <span class="favorite-location">${fav.location}</span>
            <span class="favorite-users">${utils.formatNumber(fav.users)} users</span>
        `;
        favContainer.appendChild(item);
    });
}

// Activity Logs
function loadActivityLogs() {
    const container = document.getElementById('activity-logs');
    container.innerHTML = '';
    
    adminData.logs.forEach(log => {
        const item = document.createElement('div');
        item.className = 'log-entry';
        item.innerHTML = `
            <div class="log-content">
                <div class="log-message">${log.message}</div>
                <div class="log-time">${utils.formatDate(log.timestamp)}</div>
            </div>
            <span class="log-type ${log.type}">${log.type}</span>
        `;
        container.appendChild(item);
    });
}

// System Functions
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        utils.showToast('Logging out...', 'info');
        setTimeout(() => {
            window.close();
        }, 1000);
    }
}

function changePassword() {
    const content = `
        <div class="form-group">
            <label>Current Password:</label>
            <input type="password" id="current-password">
        </div>
        <div class="form-group">
            <label>New Password:</label>
            <input type="password" id="new-password">
        </div>
        <div class="form-group">
            <label>Confirm New Password:</label>
            <input type="password" id="confirm-password">
        </div>
    `;
    
    const actions = [
        { text: 'Cancel', class: 'btn-secondary', onclick: 'closeModal()' },
        { text: 'Change Password', class: 'btn-primary', onclick: 'updatePassword()' }
    ];
    
    utils.createModal('Change Admin Password', content, actions);
}

function updatePassword() {
    const current = document.getElementById('current-password').value;
    const newPass = document.getElementById('new-password').value;
    const confirm = document.getElementById('confirm-password').value;
    
    if (!current || !newPass || !confirm) {
        utils.showToast('Please fill all fields', 'error');
        return;
    }
    
    if (newPass !== confirm) {
        utils.showToast('New passwords do not match', 'error');
        return;
    }
    
    // In production, this would validate current password and update
    closeModal();
    utils.showToast('Password changed successfully!', 'success');
}

function saveSettings() {
    // Get all settings values
    adminState.settings.defaultTheme = document.getElementById('default-theme').value;
    adminState.settings.enableAnimations = document.getElementById('enable-animations').checked;
    adminState.settings.maxSearchResults = parseInt(document.getElementById('max-search-results').value);
    adminState.settings.autoSave = document.getElementById('auto-save').checked;
    adminState.settings.sessionTimeout = parseInt(document.getElementById('session-timeout').value);
    
    // Save to localStorage (in production, this would be an API call)
    localStorage.setItem('adminSettings', JSON.stringify(adminState.settings));
    
    utils.showToast('Settings saved successfully!', 'success');
}

function resetSettings() {
    if (confirm('Are you sure you want to reset all settings to default?')) {
        // Reset to defaults
        adminState.settings = {
            defaultTheme: 'streets',
            enableAnimations: true,
            maxSearchResults: 10,
            autoSave: true,
            sessionTimeout: 30
        };
        
        // Update form fields
        document.getElementById('default-theme').value = adminState.settings.defaultTheme;
        document.getElementById('enable-animations').checked = adminState.settings.enableAnimations;
        document.getElementById('max-search-results').value = adminState.settings.maxSearchResults;
        document.getElementById('auto-save').checked = adminState.settings.autoSave;
        document.getElementById('session-timeout').value = adminState.settings.sessionTimeout;
        
        utils.showToast('Settings reset to default values', 'success');
    }
}

// Data Management Functions
function exportLocations() {
    const data = JSON.stringify(adminData.locations, null, 2);
    downloadJSON(data, 'locations.json');
    utils.showToast('Locations exported successfully!', 'success');
}

function exportBuildings() {
    const data = JSON.stringify(adminData.buildings, null, 2);
    downloadJSON(data, 'buildings.json');
    utils.showToast('Buildings exported successfully!', 'success');
}

function exportAllData() {
    const data = JSON.stringify(adminData, null, 2);
    downloadJSON(data, 'campus-map-data.json');
    utils.showToast('All data exported successfully!', 'success');
}

function exportUserData() {
    const userData = {
        popularSearches: adminData.popularSearches,
        favoriteLocations: adminData.favoriteLocations,
        recentActivity: adminData.recentActivity
    };
    const data = JSON.stringify(userData, null, 2);
    downloadJSON(data, 'user-analytics.json');
    utils.showToast('User data exported successfully!', 'success');
}

function downloadJSON(data, filename) {
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function clearUserData() {
    if (confirm('Are you sure you want to clear all user data? This action cannot be undone.')) {
        // Clear user data arrays
        adminData.popularSearches = [];
        adminData.favoriteLocations = [];
        adminData.recentActivity = [];
        
        // Reload current section if it's users
        if (adminState.currentSection === 'users') {
            loadUserAnalytics();
        }
        
        utils.showToast('User data cleared successfully!', 'warning');
    }
}

function clearLogs() {
    if (confirm('Are you sure you want to clear all activity logs?')) {
        adminData.logs = [];
        loadActivityLogs();
        utils.showToast('Activity logs cleared successfully!', 'warning');
    }
}

// Modal Functions
function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.remove();
    }
}

// Event Listeners Setup
function setupEventListeners() {
    // File import handler
    document.getElementById('import-file').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const data = JSON.parse(e.target.result);
                    // Handle imported data (would need validation in production)
                    utils.showToast('Data imported successfully!', 'success');
                } catch (error) {
                    utils.showToast('Invalid JSON file', 'error');
                }
            };
            reader.readAsText(file);
        }
    });
    
    // Search filters
    const locationSearch = document.getElementById('location-search');
    if (locationSearch) {
        locationSearch.addEventListener('input', function() {
            // Filter locations table (implementation would go here)
            console.log('Filtering locations:', this.value);
        });
    }
    
    const buildingSearch = document.getElementById('building-search');
    if (buildingSearch) {
        buildingSearch.addEventListener('input', function() {
            // Filter buildings table (implementation would go here)
            console.log('Filtering buildings:', this.value);
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeAdmin);

// Make functions globally accessible
window.refreshDashboard = refreshDashboard;
window.showAddLocationModal = showAddLocationModal;
window.addLocation = addLocation;
window.editLocation = editLocation;
window.updateLocation = updateLocation;
window.deleteLocation = deleteLocation;
window.showAddBuildingModal = showAddBuildingModal;
window.addBuilding = addBuilding;
window.editBuilding = editBuilding;
window.deleteBuilding = deleteBuilding;
window.exportLocations = exportLocations;
window.exportBuildings = exportBuildings;
window.exportAllData = exportAllData;
window.exportUserData = exportUserData;
window.clearUserData = clearUserData;
window.clearLogs = clearLogs;
window.logout = logout;
window.changePassword = changePassword;
window.updatePassword = updatePassword;
window.saveSettings = saveSettings;
window.resetSettings = resetSettings;
window.closeModal = closeModal;

console.log('🎯 Admin panel JavaScript loaded successfully!');
function renderShopRequests(filter = 'all') {
    const tableBody = document.querySelector('#shop-requests tbody');
    tableBody.innerHTML = '';

    const filteredRequests = filter === 'all' 
        ? mockData.shopRequests 
        : mockData.shopRequests.filter(req => req.status === filter);

    filteredRequests.forEach(request => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${request.id}</td>
            <td>${request.shopName}</td>
            <td>${request.status}</td>
            <td>
                ${request.status === 'pending' ? `
                    <button onclick="approveRequest(${request.id})">Approve</button>
                    <button onclick="rejectRequest(${request.id})">Reject</button>
                ` : ''}
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Approve shop request
function approveRequest(requestId) {
    const request = mockData.shopRequests.find(req => req.id === requestId);
    if (request) {
        request.status = 'approved';
        renderShopRequests(document.getElementById('status-filter').value);
        showNotification('Request approved successfully');
    }
}

// Reject shop request
function rejectRequest(requestId) {
    const request = mockData.shopRequests.find(req => req.id === requestId);
    if (request) {
        request.status = 'rejected';
        renderShopRequests(document.getElementById('status-filter').value);
        showNotification('Request rejected successfully');
    }
}

// Render users
function renderUsers() {
    const tableBody = document.querySelector('#user-management tbody');
    tableBody.innerHTML = '';

    mockData.users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>
                <button onclick="editUser(${user.id})">Edit</button>
                <button onclick="deleteUser(${user.id})" class="delete">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Edit user
function editUser(userId) {
    showNotification('Edit functionality not implemented in mock version');
}

// Delete user
function deleteUser(userId) {
    const index = mockData.users.findIndex(user => user.id === userId);
    if (index !== -1) {
        mockData.users.splice(index, 1);
        renderUsers();
        showNotification('User deleted successfully');
    }
}

// Render locations
function renderLocations() {
    const tableBody = document.querySelector('#location-management tbody');
    tableBody.innerHTML = '';

    mockData.locations.forEach(location => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${location.id}</td>
            <td>${location.name}</td>
            <td>${location.address}</td>
            <td>${location.status}</td>
            <td>
                <button onclick="editLocation(${location.id})">Edit</button>
                <button onclick="deleteLocation(${location.id})" class="delete">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Edit location
function editLocation(locationId) {
    showNotification('Edit functionality not implemented in mock version');
}

// Delete location
function deleteLocation(locationId) {
    const index = mockData.locations.findIndex(location => location.id === locationId);
    if (index !== -1) {
        mockData.locations.splice(index, 1);
        renderLocations();
        showNotification('Location deleted successfully');
    }
}

// Section switching
function switchSection(event) {
    event.preventDefault();
    const targetSection = event.target.getAttribute('data-section');

    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });

    // Show the targeted section
    document.getElementById(targetSection).classList.add('active');

    // Perform specific actions based on section
    switch(targetSection) {
        case 'dashboard':
            updateDashboardStats();
            break;
        case 'shop-requests':
            renderShopRequests();
            break;
        case 'user-management':
            renderUsers();
            break;
        case 'location-management':
            renderLocations();
            break;
    }
}

// Initialize settings toggles
// Initialize settings toggles
function initializeSettings() {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const notificationsToggle = document.getElementById('notifications-toggle');

    darkModeToggle.addEventListener('change', (event) => {
        document.body.classList.toggle('dark-mode', event.target.checked);
        showNotification('Dark mode ' + (event.target.checked ? 'enabled' : 'disabled'));
    });

    notificationsToggle.addEventListener('change', (event) => {
        const notificationsEnabled = event.target.checked;
        showNotification('Notifications ' + (notificationsEnabled ? 'enabled' : 'disabled'));
        // You can add additional logic here to manage notifications
    });
}

// Event listeners for navigation
document.querySelectorAll('.admin-navbar a').forEach(link => {
    link.addEventListener('click', switchSection);
});

// Event listener for shop request filter
document.getElementById('status-filter').addEventListener('change', (event) => {
    renderShopRequests(event.target.value);
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    updateDashboardStats();
    renderShopRequests();
    renderUsers();
    renderLocations();
    initializeSettings();
});