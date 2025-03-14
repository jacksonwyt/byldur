# Byldur - Interactive Website

A modern, interactive, and professional website with enhanced navigation and user experience.

## Features

- **Interactive 3D Cube**: A colorful, animated 3D cube at the top that serves as both a decorative element and a home button
- **Enhanced Navigation**: Smooth, animated navigation with multiple ways to interact (scroll, click, swipe)
- **Visual Feedback**: Improved visual cues with animations, transitions, and micro-interactions
- **Content Pages**: Dedicated content sections for each service category
- **Responsive Design**: Works well on both desktop and mobile devices
- **Accessibility**: Improved keyboard navigation and focus states
- **Sound Effects**: Optional sound feedback for user interactions

## Installation

1. Clone the repository
2. Install dependencies:

```bash
cd app
npm install
```

3. Start the development server:

```bash
npm start
```

4. The website will be available at [http://localhost:3000](http://localhost:3000)

## Usage

### Navigation

- **Mouse wheel**: Scroll up/down to navigate between services
- **Arrow keys**: Use up/down arrow keys to navigate
- **Click**: Click directly on a service name to select it
- **Dot indicators**: Click on the dots on the right to jump to a specific service
- **Mini navigation**: Use the dots at the bottom for quick access
- **Swipe**: On touch devices, swipe up/down to navigate

### Interaction

- **3D Cube**: Click the colorful cube at the top to return to the home state
- **Service click**: Click on a service name to open its detailed content page
- **Sound toggle**: Toggle sound effects on/off using the sound button in the top right
- **Search**: Access search functionality via the search button in the top right

## Customization

- Edit the services array in `Home.js` to change the available services and their colors
- Modify the service content in `ContentPages.js` to update the information displayed for each service
- Adjust styling in the styled components to change the appearance

## Technical Details

This website uses:

- React for UI components
- Three.js and React Three Fiber for 3D elements
- Framer Motion for animations
- Styled Components for styling
- Use Sound for audio feedback

## License

MIT 