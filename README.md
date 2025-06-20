<div align="center">

# Augmented Control Center (ACC)

</div>

A modular desktop application built with Electron.js and TailwindCSS for controlling and debugging AR glasses. This application provides a comprehensive interface for managing all aspects of AR glasses operation, from camera feeds to AI training tools.

## Features

### 🎯 Dashboard
- Real-time system status monitoring
- Battery level, CPU usage, and temperature tracking
- Active session management
- Quick access to critical functions

### 📷 Live Camera Feeds & Calibration
- Dual camera feed display (left and right eye)
- Real-time calibration tools
- Auto and manual calibration options
- Camera status monitoring

### ✋ Gesture & Behavior Tracking
- Hand tracking visualization
- Eye gaze tracking
- Gesture recognition display
- Confidence level indicators

### 🎨 Overlay & Notification Manager
- Active overlay management
- Notification queue system
- Overlay positioning and sizing controls
- Real-time status updates

### 🤖 AI Training Tools
- Model training progress tracking
- Data collection statistics
- Training session management
- Model deployment controls

### ⚙️ Admin Settings
- System configuration management
- Security settings
- Power management options
- Update channel selection

### 📊 System Monitor
- Real-time performance metrics
- Temperature monitoring
- System logs viewer
- Resource usage tracking

## Tech Stack

- **Electron.js** - Desktop application framework
- **TailwindCSS** - Utility-first CSS framework
- **HTML5 + JavaScript** - Frontend implementation
- **Node.js** - Backend runtime

## Project Structure

```
ar-glasses-control-center/
├── main.js                 # Electron main process
├── package.json            # Project configuration
├── tailwind.config.js      # TailwindCSS configuration
├── src/
│   ├── index.html          # Main application interface
│   ├── styles/
│   │   ├── main.css        # TailwindCSS source
│   │   └── output.css      # Compiled CSS
│   ├── js/
│   │   └── app.js          # Main application logic
│   └── modules/            # Future modular components
│       ├── camera/         # Camera-related modules
│       ├── tracking/       # Tracking modules
│       ├── overlay/        # Overlay management
│       ├── ai/             # AI training tools
│       ├── admin/          # Admin settings
│       ├── monitor/        # System monitoring
│       └── dashboard/      # Dashboard components
└── assets/                 # Application assets
```

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ar-glasses-control-center
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build CSS**
   ```bash
   npm run build:css
   ```

4. **Start the application**
   ```bash
   npm start
   ```

## Development

### Development Mode with Live Reload
```bash
npm run dev
```

### Watch Mode (CSS + Electron)
```bash
npm run watch
```

### Build for Production
```bash
npm run dist
```

## Scripts

- `npm start` - Start the Electron application
- `npm run dev` - Start in development mode with live reload
- `npm run build` - Watch and build CSS
- `npm run build:css` - Build CSS once
- `npm run watch` - Run CSS watcher and Electron in parallel
- `npm run package` - Package the application
- `npm run dist` - Build CSS and package for distribution

## Configuration

### TailwindCSS
The application uses a custom TailwindCSS configuration with:
- Custom color palette for AR theme
- Extended animations and keyframes
- Custom spacing and sizing utilities
- Form and typography plugins

### Electron
- Window size: 1400x900
- Node integration enabled
- Development tools in dev mode
- Live reload support

## Usage

### Navigation
The application features a sidebar navigation with seven main sections:
1. **Dashboard** - Overview and system status
2. **Live Camera Feeds** - Camera management and calibration
3. **Gesture Tracking** - Hand and eye tracking visualization
4. **Overlay Manager** - Overlay and notification controls
5. **AI Training Tools** - AI model management
6. **Admin Settings** - System configuration
7. **System Monitor** - Performance monitoring

### Interactive Features
- Click on camera feeds to view full-screen
- Toggle overlay states with enable/disable buttons
- Monitor real-time system metrics
- Adjust settings in admin panel
- View live system logs

## Development Guidelines

### Adding New Modules
1. Create a new folder in `src/modules/`
2. Add module-specific HTML, CSS, and JavaScript
3. Update the main navigation in `index.html`
4. Add module initialization in `app.js`

### Styling
- Use TailwindCSS utility classes
- Follow the established color scheme
- Maintain consistent spacing and typography
- Use the custom component classes defined in `main.css`

### JavaScript
- Follow the existing class-based architecture
- Use ES6+ features
- Maintain modular structure
- Add proper error handling

## Future Enhancements

- [ ] Real camera feed integration
- [ ] WebSocket connections for live data
- [ ] Database integration for settings
- [ ] Plugin system for custom modules
- [ ] Multi-language support
- [ ] Dark/light theme toggle
- [ ] Export/import configuration
- [ ] Advanced analytics dashboard

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support and questions, please open an issue in the repository or contact the development team.

---

**Built with ❤️ for AR Development** 