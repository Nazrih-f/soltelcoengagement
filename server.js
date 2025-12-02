import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import mammoth from 'mammoth';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 5000;
const DATA_FILE = path.join(__dirname, 'quiz-data.json');
const QUESTIONS_FILE = path.join(__dirname, 'questions-data.json');
const UPLOADS_DIR = path.join(__dirname, 'uploads');

// Create uploads directory if it doesn't exist
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

app.use(cors());
app.use(express.json());

// Initialize data files if they don't exist
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({ attempts: [], winners: [] }, null, 2));
}

if (!fs.existsSync(QUESTIONS_FILE)) {
  fs.writeFileSync(QUESTIONS_FILE, JSON.stringify({ files: [], questions: [] }, null, 2));
}

// Parse DOCX file and extract questions
async function parseDocxQuestions(filePath) {
  try {
    const result = await mammoth.extractRawText({ path: filePath });
    const text = result.value;
    
    const lines = text.split('\n');
    console.log('Total lines:', lines.length);
    
    const questions = [];
    let questionId = Date.now();
    let currentQuestion = null;
    let currentOptions = [];
    let currentCorrectIndex = 0;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Skip empty lines
      if (!line) continue;
      
      // Check if line starts with a number followed by . or ) - it's a question
      const questionMatch = line.match(/^(\d+)[\.\)]\s*(.+)/);
      if (questionMatch) {
        // Save previous question if exists
        if (currentQuestion && currentOptions.length >= 2) {
          questions.push({
            id: questionId++,
            question: currentQuestion,
            options: currentOptions,
            correct: currentCorrectIndex
          });
          console.log(`✓ Q${questions.length}: "${currentQuestion.substring(0, 40)}..." (${currentOptions.length} options, correct=${currentCorrectIndex})`);
        }
        
        // Start new question
        currentQuestion = questionMatch[2].trim();
        currentOptions = [];
        currentCorrectIndex = 0;
        continue;
      }
      
      // Check if line starts with A), B), C), D) - it's an option
      const optionMatch = line.match(/^([A-D])\)\s*(.+)/);
      if (optionMatch && currentQuestion) {
        let optionText = optionMatch[2].trim();
        
        // Check if marked as correct with → (J)
        const isCorrect = optionText.includes('→') || optionText.includes('(J)') || optionText.includes('*');
        
        if (isCorrect) {
          // Clean the option text - remove all markers
          optionText = optionText
            .replace(/\s*→\s*\(J\)\s*/gi, '')
            .replace(/\s*\(J\)\s*/gi, '')
            .replace(/\s*→\s*/g, '')
            .replace(/\s*\*\s*/g, '')
            .trim();
          currentCorrectIndex = currentOptions.length;
        }
        
        currentOptions.push(optionText);
      } else if (line.match(/^[A-D]\)/) && currentQuestion) {
        // Handle case where options might be on same line: "A) text B) text C) text D) text"
        // Split this line into individual options
        const optionsOnLine = line.match(/[A-D]\)\s*[^A-D\)]+?(?=[A-D]\)|$)/gi);
        if (optionsOnLine) {
          optionsOnLine.forEach((opt) => {
            let optionText = opt.replace(/^[A-D]\)\s*/, '').trim();
            
            const isCorrect = optionText.includes('→') || optionText.includes('(J)') || optionText.includes('*');
            
            if (isCorrect) {
              optionText = optionText
                .replace(/\s*→\s*\(J\)\s*/gi, '')
                .replace(/\s*\(J\)\s*/gi, '')
                .replace(/\s*→\s*/g, '')
                .replace(/\s*\*\s*/g, '')
                .trim();
              currentCorrectIndex = currentOptions.length;
            }
            
            currentOptions.push(optionText);
          });
        }
      }
    }
    
    // Add the last question
    if (currentQuestion && currentOptions.length >= 2) {
      questions.push({
        id: questionId++,
        question: currentQuestion,
        options: currentOptions,
        correct: currentCorrectIndex
      });
      console.log(`✓ Q${questions.length}: "${currentQuestion.substring(0, 40)}..." (${currentOptions.length} options, correct=${currentCorrectIndex})`);
    }
    
    console.log('=== TOTAL QUESTIONS PARSED:', questions.length, '===');
    return questions;
  } catch (error) {
    console.error('Error parsing DOCX:', error);
    return [];
  }
}

// Get all quiz attempts
app.get('/api/attempts', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    res.json(data.attempts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read data' });
  }
});

// Get winners
app.get('/api/winners', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    res.json(data.winners || []);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read data' });
  }
});

// Save quiz attempt
app.post('/api/attempts', (req, res) => {
  try {
    const { playerName, score, totalQuestions, answers, isWinner } = req.body;
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    
    const attempt = {
      id: Date.now(),
      playerName,
      score,
      totalQuestions,
      percentage: Math.round((score / totalQuestions) * 100),
      answers,
      isWinner: isWinner || false,
      timestamp: new Date().toISOString()
    };
    
    data.attempts.push(attempt);
    
    // If winner, add to winners list
    if (isWinner) {
      if (!data.winners) data.winners = [];
      data.winners.push({
        id: Date.now(),
        playerName,
        score,
        totalQuestions,
        timestamp: new Date().toISOString()
      });
    }
    
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    res.json(attempt);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save data' });
  }
});

// Get quiz questions (random 10)
app.get('/api/questions', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(QUESTIONS_FILE, 'utf-8'));
    let questions = data.questions || [];
    
    // If no questions uploaded, show error
    if (questions.length === 0) {
      return res.status(400).json({ error: 'No questions available. Please ask admin to upload questions.' });
    }
    
    // Shuffle and return 10 questions (or all if less than 10)
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(10, shuffled.length));
    
    console.log('Returning', selected.length, 'questions');
    res.json(selected);
  } catch (error) {
    console.error('Error getting questions:', error);
    res.status(500).json({ error: 'Failed to read questions' });
  }
});

// Upload DOCX file
app.post('/api/admin/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const filePath = req.file.path;
    const questions = await parseDocxQuestions(filePath);
    
    const data = JSON.parse(fs.readFileSync(QUESTIONS_FILE, 'utf-8'));
    
    const fileInfo = {
      id: Date.now(),
      filename: req.file.originalname,
      storedName: req.file.filename,
      uploadDate: new Date().toISOString(),
      questionCount: questions.length
    };
    
    data.files.push(fileInfo);
    data.questions = [...data.questions, ...questions];
    
    fs.writeFileSync(QUESTIONS_FILE, JSON.stringify(data, null, 2));
    
    res.json({ 
      success: true, 
      file: fileInfo, 
      questionsAdded: questions.length,
      totalQuestions: data.questions.length
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// Get uploaded files
app.get('/api/admin/files', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(QUESTIONS_FILE, 'utf-8'));
    res.json({
      files: data.files || [],
      totalQuestions: (data.questions || []).length
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to read files' });
  }
});

// Delete a file and its questions
app.delete('/api/admin/files/:id', (req, res) => {
  try {
    const fileId = parseInt(req.params.id);
    const data = JSON.parse(fs.readFileSync(QUESTIONS_FILE, 'utf-8'));
    
    const fileIndex = data.files.findIndex(f => f.id === fileId);
    if (fileIndex === -1) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    const file = data.files[fileIndex];
    
    // Delete the actual file
    const filePath = path.join(UPLOADS_DIR, file.storedName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    // Remove file from list
    data.files.splice(fileIndex, 1);
    
    fs.writeFileSync(QUESTIONS_FILE, JSON.stringify(data, null, 2));
    
    res.json({ success: true, message: 'File deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

// Add questions from text (paste)
app.post('/api/admin/paste', (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'No text provided' });
    }
    
    const questions = parseTextQuestions(text);
    
    if (questions.length === 0) {
      return res.status(400).json({ error: 'No questions found in text' });
    }
    
    const data = JSON.parse(fs.readFileSync(QUESTIONS_FILE, 'utf-8'));
    
    const fileInfo = {
      id: Date.now(),
      filename: 'Pasted Questions',
      storedName: 'pasted-' + Date.now(),
      uploadDate: new Date().toISOString(),
      questionCount: questions.length
    };
    
    data.files.push(fileInfo);
    data.questions = [...data.questions, ...questions];
    
    fs.writeFileSync(QUESTIONS_FILE, JSON.stringify(data, null, 2));
    
    res.json({ 
      success: true, 
      questionsAdded: questions.length,
      totalQuestions: data.questions.length
    });
  } catch (error) {
    console.error('Paste error:', error);
    res.status(500).json({ error: 'Failed to parse questions' });
  }
});

// Parse questions from plain text
function parseTextQuestions(text) {
  const lines = text.split('\n');
  const questions = [];
  let questionId = Date.now();
  let currentQuestion = null;
  let currentOptions = [];
  let currentCorrectIndex = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (!line) continue;
    
    // Check if line starts with a number - it's a question
    const questionMatch = line.match(/^(\d+)[\.\)]\s*(.+)/);
    if (questionMatch) {
      // Save previous question
      if (currentQuestion && currentOptions.length >= 2) {
        questions.push({
          id: questionId++,
          question: currentQuestion,
          options: currentOptions,
          correct: currentCorrectIndex
        });
      }
      
      currentQuestion = questionMatch[2].trim();
      currentOptions = [];
      currentCorrectIndex = 0;
      continue;
    }
    
    // Check if line starts with A), B), C), D)
    const optionMatch = line.match(/^([A-Da-d])\)\s*(.+)/);
    if (optionMatch && currentQuestion) {
      let optionText = optionMatch[2].trim();
      
      // Check if marked as correct with → (J) or (J)
      const isCorrect = optionText.includes('(J)') || optionText.includes('(j)') || optionText.includes('→');
      
      if (isCorrect) {
        optionText = optionText
          .replace(/\s*→\s*\(J\)\s*/gi, '')
          .replace(/\s*\(J\)\s*/gi, '')
          .replace(/\s*→\s*/g, '')
          .trim();
        currentCorrectIndex = currentOptions.length;
      }
      
      currentOptions.push(optionText);
    }
  }
  
  // Add last question
  if (currentQuestion && currentOptions.length >= 2) {
    questions.push({
      id: questionId++,
      question: currentQuestion,
      options: currentOptions,
      correct: currentCorrectIndex
    });
  }
  
  console.log('Parsed', questions.length, 'questions from text');
  return questions;
}

// Clear all questions
app.delete('/api/admin/questions', (req, res) => {
  try {
    const data = { files: [], questions: [] };
    fs.writeFileSync(QUESTIONS_FILE, JSON.stringify(data, null, 2));
    
    // Delete all uploaded files
    const files = fs.readdirSync(UPLOADS_DIR);
    files.forEach(file => {
      fs.unlinkSync(path.join(UPLOADS_DIR, file));
    });
    
    res.json({ success: true, message: 'All questions cleared' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear questions' });
  }
});

// Debug - view raw text from a file
app.get('/api/admin/debug/:filename', async (req, res) => {
  try {
    const filePath = path.join(UPLOADS_DIR, req.params.filename);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }
    const result = await mammoth.extractRawText({ path: filePath });
    res.json({ 
      rawText: result.value,
      lines: result.value.split('\n').filter(l => l.trim())
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reparse all files
app.post('/api/admin/reparse', async (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(QUESTIONS_FILE, 'utf-8'));
    let allQuestions = [];
    
    for (const file of data.files) {
      const filePath = path.join(UPLOADS_DIR, file.storedName);
      if (fs.existsSync(filePath)) {
        const questions = await parseDocxQuestions(filePath);
        allQuestions = [...allQuestions, ...questions];
        file.questionCount = questions.length;
      }
    }
    
    data.questions = allQuestions;
    fs.writeFileSync(QUESTIONS_FILE, JSON.stringify(data, null, 2));
    
    res.json({ success: true, totalQuestions: allQuestions.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin stats
app.get('/api/admin/stats', (req, res) => {
  try {
    const quizData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    const questionsData = JSON.parse(fs.readFileSync(QUESTIONS_FILE, 'utf-8'));
    
    res.json({
      totalAttempts: (quizData.attempts || []).length,
      totalWinners: (quizData.winners || []).length,
      totalQuestions: (questionsData.questions || []).length,
      totalFiles: (questionsData.files || []).length
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
