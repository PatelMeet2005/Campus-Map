# 🗺️ Campus Map - Interactive Navigation System

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com/PatelMeet2005/Campus-Map)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Status](https://img.shields.io/badge/status-Active-brightgreen.svg)](https://github.com/PatelMeet2005/Campus-Map)

An interactive campus navigation system designed for **CHARUSAT University** that helps students, faculty, and visitors easily navigate the campus using modern web technologies.

## 🌟 Features

### 🎯 Core Functionality
- **📍 Interactive Campus Map** - Responsive map interface with multiple view options
- **🧭 GPS Navigation & Routing** - Real-time navigation with turn-by-turn directions
- **🔍 Smart Search** - Autocomplete search with suggestions and filters
- **⭐ Favorite Locations** - Save and quickly access frequently visited places
- **🕐 Search History** - Track and revisit previous searches
- **📱 Mobile Responsive** - Optimized for all device sizes

### 🎨 User Experience
- **🌙 Multiple Map Themes** - Streets, Satellite, and Dark mode views
- **🚀 Quick Access Panel** - Fast navigation to popular destinations
- **📢 Toast Notifications** - Real-time feedback and status updates
- **⚡ Loading States** - Smooth transitions and loading indicators
- **♿ Accessibility Features** - Screen reader compatible and keyboard navigation

### 🏢 Location & Building System
- **📍 Campus Locations** - Xerox Center, Bank, Canteen, Admin Office, Hospital
- **🏗️ Academic Buildings** - A2 RPCP, A3 IIIM, A5 DEPSTAR, A6 EC, A7 CE, A8 PDPIAS, A9 CMPICA
- **ℹ️ Detailed Information** - Building descriptions, facilities, and coordinates
- **🎯 Custom Markers** - Visual distinction for different location types

### 🔐 Admin Panel
- **📊 Dashboard Analytics** - Usage statistics and user behavior insights
- **🛠️ Location Management** - Add, edit, delete locations with full CRUD operations
- **🏢 Building Management** - Comprehensive building information system
- **👥 User Analytics** - Popular searches, favorites, and usage patterns
- **⚙️ System Settings** - Theme preferences, session management, and configurations
- **💾 Data Management** - Import/export functionality with JSON support
- **📄 Activity Logs** - Comprehensive logging and monitoring system

## 🛠️ Technology Stack

### Frontend
- **HTML5** - Semantic markup and modern web standards
- **CSS3** - Custom properties, Grid, Flexbox, and animations
- **JavaScript (ES6+)** - Modern JavaScript with modules and async/await
- **Google Fonts** - Inter font family for consistent typography

### Mapping & Navigation
- **[Leaflet.js](https://leafletjs.com/)** v1.9.4+ - Interactive maps
- **[Leaflet Routing Machine](https://www.liedman.net/leaflet-routing-machine/)** - Turn-by-turn navigation
- **[Leaflet Control Geocoder](https://github.com/perliedman/leaflet-control-geocoder)** - Address search and geocoding

### Map Providers
- **OpenStreetMap** - Default street view
- **Esri World Imagery** - Satellite view
- **CartoDB Dark** - Dark theme mode

## 📁 Project Structure

```
SGP1-main/
├── 📄 project.html          # Main application interface
├── 🎨 styles.css           # Main application styles
├── ⚡ script.js            # Core application logic
├── 🔐 admin.html           # Admin panel interface
├── 🎨 admin.css            # Admin panel styles
├── ⚡ admin.js             # Admin panel functionality
├── 🧪 test.html            # Testing and debugging page
├── 📦 package.json         # Project metadata and dependencies
└── 📖 README.md            # Project documentation
```

## 🚀 Quick Start

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (Live Server, XAMPP, or Python HTTP server)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/PatelMeet2005/Campus-Map.git
   cd Campus-Map
   ```

2. **Start a local server**
   
   **Option A: Using VS Code Live Server**
   - Install Live Server extension
   - Right-click on `project.html`
   - Select "Open with Live Server"

   **Option B: Using Python**
   ```bash
   python -m http.server 8000
   ```

   **Option C: Using Node.js**
   ```bash
   npx serve .
   ```

3. **Access the application**
   - Open your browser and navigate to `http://localhost:8000`
   - Click on `project.html` to start using the campus map

### 🔐 Admin Access
1. Click the settings icon (⚙️) in the top navigation
2. Select "Admin Panel" from the dropdown
3. Enter password: `admin`
4. Access the comprehensive admin dashboard

## 📖 Usage Guide

### 🗺️ Basic Navigation
1. **Search for Locations**: Use the search bar with autocomplete suggestions
2. **Quick Access**: Click on quick access buttons for popular destinations
3. **Get Directions**: Click any location to get turn-by-turn navigation
4. **Change View**: Use the map layers control to switch between themes

### ⭐ Advanced Features
- **Save Favorites**: Click the star button on any location popup
- **View History**: Access your search history from the settings menu
- **Mobile Usage**: Fully responsive design works on all devices
- **Keyboard Shortcuts**: Use Ctrl+K to quickly focus the search bar

### 🔧 Admin Features
- **Dashboard**: Monitor usage statistics and system health
- **Location Management**: Add, edit, or remove campus locations
- **Building Management**: Manage building information and facilities
- **User Analytics**: View popular searches and user behavior
- **Data Export**: Backup system data in JSON format
- **System Settings**: Configure themes, timeouts, and preferences

## 🎯 Key Locations

### 🏢 Academic Buildings
- **A2 Building RPCP** - Research and Project Center
- **A3 Building IIIM** - Institute of Infrastructure, Technology, Research and Management
- **A5 DEPSTAR BUILDING** - Department of Science and Technology
- **A6 CSPIT EC Building** - Electronics and Communication Department
- **A7 CSPIT CE Building** - Civil Engineering Department
- **A8 PDPIAS BUILDING** - P. D. Patel Institute of Applied Sciences
- **A9 CMPICA BUILDING** - Charotar Institute of Computer Applications

### 🏪 Campus Services
- **🍽️ Canteen** - Dining and refreshment area
- **🏦 Bank** - Banking services
- **🏥 Hospital** - Medical facilities
- **📄 Xerox Center** - Printing and copying services
- **🏢 Admin Office** - Administrative services

## 🔧 Configuration

### Map Settings
```javascript
// Default map configuration
const mapConfig = {
    center: [22.589220, 72.795967], // CHARUSAT University coordinates
    zoom: 15,
    maxZoom: 19,
    themes: ['streets', 'satellite', 'dark']
};
```

### Adding New Locations
```javascript
// In script.js - locations object
var locations = {
    "Location Name": [latitude, longitude]
};
```

### Adding New Buildings
```javascript
// In script.js - buildings object
var buildings = {
    'Building Name': {
        coords: [latitude, longitude],
        description: 'Building description',
        facilities: ['Facility 1', 'Facility 2']
    }
};
```

## 📱 Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome  | 80+     | ✅ Full Support |
| Firefox | 75+     | ✅ Full Support |
| Safari  | 13+     | ✅ Full Support |
| Edge    | 80+     | ✅ Full Support |
| Mobile  | iOS 13+, Android 8+ | ✅ Full Support |

## 🚀 Performance Features

- **🏃‍♂️ Fast Loading** - Optimized assets and lazy loading
- **📱 Mobile First** - Responsive design with touch optimization
- **💾 Local Storage** - Persistent user preferences and history
- **⚡ Smooth Animations** - CSS-based transitions and animations
- **🔄 Error Handling** - Graceful fallbacks and user feedback

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### 📝 Contribution Guidelines
- Follow existing code style and formatting
- Add comments for complex functionality
- Test on multiple browsers and devices
- Update documentation for new features
- Ensure mobile responsiveness

## 🐛 Known Issues & Troubleshooting

### Common Issues
1. **Map not loading**: Check internet connection and console for errors
2. **GPS not working**: Ensure location permissions are granted
3. **Search not working**: Verify geocoding service availability
4. **Admin panel access**: Confirm password is "admin" (case-sensitive)

### 🔧 Debugging
- Open browser developer tools (F12)
- Check console for JavaScript errors
- Verify network requests in Network tab
- Use `test.html` for debugging functionality

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **CHARUSAT University** - For providing campus coordinates and layout
- **Leaflet.js Community** - For excellent mapping libraries
- **OpenStreetMap Contributors** - For map data
- **SGP1 Team** - For development and design

## 📞 Contact & Support

- **Developer**: Meet Patel
- **GitHub**: [@PatelMeet2005](https://github.com/PatelMeet2005)
- **Repository**: [Campus-Map](https://github.com/PatelMeet2005/Campus-Map)

For bug reports and feature requests, please [create an issue](https://github.com/PatelMeet2005/Campus-Map/issues).

---

<div align="center">

**⭐ If you find this project helpful, please give it a star! ⭐**

Made with ❤️ for CHARUSAT University

*Last updated: August 2025*

</div>