# Start Digging In Your Butt Twin

🎮 **A fast-paced reflex browser game where you dig butts, avoid obstacles, and collect golden butts for extra lives.**

---

## 📝 Description

Start Digging In Your Butt Twin is an interactive click-and-tap game inspired by the viral meme trend. Players use quick reflexes to:

- **Click on falling butts** multiple times to clear them from the screen  
- **Avoid clicking obstacles**, which penalize health and shake the screen for feedback  
- **Collect golden butts**, which fall faster and grant an extra life when clicked

The game ends when all lives are lost, and users can view their personal high score on the leaderboard.

---

## 🚀 Play it here

👉 [Play Now]([https://YOUR_NETLIFY_LINK_HERE](https://sdiybt.netlify.app))

*(https://sdiybt.netlify.app)*

---

## 🔧 Key Features and Implementation Principles

### 🎯 **Dynamic Canvas Rendering**
Utilizes the HTML5 Canvas API with JavaScript to render game elements in real-time, including images, animations, and overlays. The canvas loop efficiently updates sprite positions, user interactions, and scores.

### ✨ **Object-Oriented Game Design**
Implemented using JavaScript classes for modular and scalable development. Example classes include:
- **Butt class:** Defines health, golden status, and dynamic glow or sparkle effects.
- **Obstacle class:** Tracks obstacle properties and interactions (expandable for future features).

### 💻 **Responsive User Interaction**
- Uses **event listeners** for mouse click detection within canvas bounds to trigger butt health reductions, game state updates, and obstacle penalties.
- Implements a **custom cursor system**, switching images based on user click state for immersive UX.

### 💡 **Visual Feedback and Animation**
- Adds a **screen shake effect** using CSS transform and JavaScript for impact feedback when obstacles are clicked or butts reach the ground.
- Introduces **golden butt glow and sparkles** purely with Canvas shadow properties and randomized sparkle generation without external assets.

### 🎮 **Gameplay Mechanics**
- Multi-click health system for butts with overlay counters indicating remaining hits required.
- **Dynamic spawning** of butts and golden butts at randomized intervals, increasing difficulty.
- Personal **leaderboard system** using localStorage to persist high scores across sessions.

---

## 🛠️ Built With

- **HTML5 Canvas API**
- **Vanilla JavaScript (ES6+)**
- **CSS3** for layout and styling

---

## 📝 How to run locally

1. Clone this repository:

