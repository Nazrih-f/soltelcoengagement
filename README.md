# Quiz Master - Interactive Quiz Web Application

A modern, interactive quiz application built with React and Node.js. Features name input, multiple-choice questions, instant feedback, and persistent data storage.

## Features

✅ **Name Input Screen** - Players enter their name before starting the quiz
✅ **Interactive Questions** - Multiple choice questions with instant feedback
✅ **Feedback System** - Shows "Close!" message for incorrect answers and highlights the correct answer
✅ **Progress Tracking** - Visual progress bar showing quiz completion
✅ **Results Screen** - Detailed score breakdown with grade and performance message
✅ **Answer Review** - See all answers with correct/incorrect indicators
✅ **Quiz History** - View all previous quiz attempts with statistics
✅ **Data Persistence** - All quiz results stored in JSON file on server
✅ **Modern UI** - Beautiful gradient design with Tailwind CSS

## Tech Stack

- **Frontend:** React 18 + Vite
- **Backend:** Node.js + Express
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Storage:** JSON file (quiz-data.json)

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Setup

1. **Install root dependencies:**
```bash
npm install
```

2. **Install client dependencies:**
```bash
cd client
npm install
cd ..
```

## Running the Application

### Development Mode (Both Server & Client)
```bash
npm run dev
```

This will start:
- **Backend Server:** http://localhost:5000
- **Frontend Client:** http://localhost:5173

### Production Build
```bash
npm run build
```

## Project Structure

```
Engagement/
├── server.js                 # Express backend server
├── quiz-data.json           # Quiz results storage
├── package.json             # Root dependencies
├── client/
│   ├── src/
│   │   ├── App.jsx          # Main app component
│   │   ├── index.css        # Tailwind styles
│   │   ├── main.jsx         # React entry point
│   │   └── components/
│   │       ├── NameInput.jsx    # Name input screen
│   │       ├── Quiz.jsx         # Quiz screen
│   │       ├── Results.jsx      # Results screen
│   │       └── History.jsx      # Quiz history screen
│   ├── index.html           # HTML template
│   ├── vite.config.js       # Vite configuration
│   ├── tailwind.config.js   # Tailwind configuration
│   └── package.json         # Client dependencies
```

## API Endpoints

### GET /api/questions
Returns all quiz questions with options and correct answers.

### GET /api/attempts
Returns all quiz attempts stored in the database.

### POST /api/attempts
Saves a new quiz attempt.

**Request Body:**
```json
{
  "playerName": "John Doe",
  "score": 4,
  "totalQuestions": 5,
  "answers": [...],
  "language": "en"
}
```

## How to Use

1. **Start the app** - Run `npm run dev`
2. **Enter your name** - Input your name on the home screen
3. **Take the quiz** - Answer 5 multiple-choice questions
4. **Get feedback** - See if each answer is correct or incorrect
5. **View results** - Check your score, grade, and answer review
6. **Check history** - View all your previous quiz attempts

## Quiz Questions

The app includes 5 sample questions:
- What is the capital of France?
- Which planet is known as the Red Planet?
- What is 2 + 2?
- Who wrote Romeo and Juliet?
- What is the largest ocean on Earth?

You can add more questions by editing the `/api/questions` endpoint in `server.js`.

## Data Storage

All quiz attempts are automatically saved to `quiz-data.json` in the root directory. Each attempt includes:
- Player name
- Score and percentage
- Timestamp
- All answers with correct/incorrect indicators
- Language preference

## Customization

### Add More Questions
Edit the `app.get('/api/questions')` endpoint in `server.js` to add more questions.

### Change Colors/Styling
Modify Tailwind classes in component files (`.jsx` files in `client/src/components/`)

### Add Languages
Extend the questions array with language-specific versions and update the language selection logic.

## Troubleshooting

**Port already in use?**
- Change the PORT in `server.js` (default: 5000)
- Change the port in `client/vite.config.js` (default: 5173)

**CORS errors?**
- Make sure both server and client are running
- Check that the proxy in `vite.config.js` points to the correct server URL

**Styles not loading?**
- Run `npm install` in the client directory
- Clear browser cache and restart dev server

## Future Enhancements

- [ ] User authentication
- [ ] Multiple quiz categories
- [ ] Difficulty levels
- [ ] Leaderboard
- [ ] Time-based quizzes
- [ ] Admin panel to manage questions
- [ ] Export results as PDF
- [ ] Multi-language support

## License

MIT
