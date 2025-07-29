# Hidden Gem Game - React/Vite Edition

A modern React-based implementation of the Hidden Gem Game for MIST 7571E Final Exam.

## 🎮 Game Description

A fun guessing game where players must find a hidden gem in a 3x3 grid. The gem is randomly placed when the game loads, and players enter numbers 1-9 to make guesses.

## ✨ Features

- **Modern React Architecture**: Built with React 18 and Vite for fast development
- **Responsive Design**: Beautiful gradient background with animated interactions
- **Input Validation**: Checks for valid numbers (1-9) and prevents duplicate guesses
- **Visual Feedback**: 
  - "O" marks for incorrect guesses with bounce animation
  - "X" marks for correct guess with celebration animation
  - Color-coded cells (blue → red for wrong, green for correct)
- **Game Reset**: Clear button to start a new game

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```
This starts the Vite development server at `http://localhost:5173/`

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 📁 Project Structure

```
src/
├── App.jsx          # Main game component with React hooks
├── App.css          # Modern styling with gradients and animations
├── main.jsx         # React app entry point
└── index.css        # Global styles
```

## 🎯 Exam Requirements Met

✅ **3x3 Grid**: Displays numbered cells 1-9  
✅ **Random Gem Placement**: Uses `Math.floor(Math.random() * (max - min + 1)) + min`  
✅ **Number Input**: Player enters 1-9 to guess  
✅ **Incorrect Guess**: Shows "O" and "Try again!!" message  
✅ **Correct Guess**: Shows "X" and congratulations message  
✅ **Input Validation**: Handles invalid numbers and duplicate guesses  
✅ **Clear Function**: Resets board for new game  
✅ **Modular Code**: React components with hooks for state management  

## 🛠 Technologies Used

- **React 18**: Modern functional components with hooks
- **Vite**: Fast build tool and development server
- **CSS3**: Modern styling with gradients, animations, and transitions
- **ESLint**: Code linting for React best practices

## 🎨 Visual Enhancements

- **Gradient backgrounds** for immersive experience
- **Hover effects** on interactive elements
- **Smooth animations** for game feedback
- **Responsive design** that works on all screen sizes
- **Modern UI/UX** with rounded corners and shadows

## 📝 Game Logic

The game uses React state management with `useState` and `useCallback` hooks:

1. **Game State**: Tracks cell values, gem position, game status, and messages
2. **Input Handling**: Validates user input and updates game state
3. **Win Condition**: Detects when gem is found and ends game
4. **Reset Function**: Clears state and generates new gem position

This modern React implementation showcases professional web development practices while meeting all the original exam requirements.