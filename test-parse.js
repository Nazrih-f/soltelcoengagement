import mammoth from 'mammoth';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function parseDocxQuestions(filePath) {
  try {
    const result = await mammoth.extractRawText({ path: filePath });
    const text = result.value;
    
    const lines = text.split('\n');
    console.log('Total lines:', lines.length);
    
    const questions = [];
    let questionId = 1;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Skip empty lines
      if (!line || line.length < 5) continue;
      
      // Check if line starts with a number followed by . or ) - it's a question
      const questionMatch = line.match(/^(\d+)[\.\)]\s*(.+)/);
      if (questionMatch) {
        // The entire line contains question + options
        const fullLine = line;
        const questionText = questionMatch[2].trim();
        
        // Find where options start (look for "A)" pattern)
        const optionsStartIdx = fullLine.indexOf('A)');
        let optionsLine = '';
        
        if (optionsStartIdx > -1) {
          optionsLine = fullLine.substring(optionsStartIdx).trim();
        } else if (i + 1 < lines.length) {
          // If no A) on same line, check next line
          optionsLine = lines[i + 1].trim();
        }
        
        console.log(`Q: "${questionText.substring(0, 40)}..."`);
        console.log(`Options: "${optionsLine.substring(0, 80)}..."`);
        
        // Parse options from the line: "A) Option1B) Option2C) Option3D) Option4"
        const options = [];
        let correctIndex = 0;
        
        // Split by letter patterns: A) B) C) D)
        const optionMatches = optionsLine.match(/[A-D]\)\s*[^A-D\)]+?(?=[A-D]\)|$)/gi);
        
        console.log(`Matches found: ${optionMatches ? optionMatches.length : 0}`);
        
        if (optionMatches && optionMatches.length >= 2) {
          optionMatches.forEach((match, idx) => {
            let optionText = match.replace(/^[A-D]\)\s*/, '').trim();
            
            // Check if marked as correct
            const isCorrect = optionText.includes('→') || optionText.includes('(J)') || optionText.includes('*');
            
            if (isCorrect) {
              optionText = optionText
                .replace(/\s*→\s*\(J\)\s*/gi, '')
                .replace(/\s*\(J\)\s*/gi, '')
                .replace(/\s*→\s*/g, '')
                .replace(/\s*\*\s*/g, '')
                .trim();
              correctIndex = idx;
            }
            
            options.push(optionText);
          });
          
          // Only add if we have at least 2 options
          if (options.length >= 2) {
            questions.push({
              id: questionId++,
              question: questionText,
              options: options,
              correct: correctIndex
            });
            console.log(`✓ Q${questions.length}: (${options.length} options, correct=${correctIndex})\n`);
          }
        }
      }
    }
    
    console.log(`\n=== TOTAL QUESTIONS PARSED: ${questions.length} ===`);
    return questions;
  } catch (error) {
    console.error('Error parsing DOCX:', error);
    return [];
  }
}

async function testParse() {
  try {
    const filePath = path.join(__dirname, 'client/src/sualo iyo jawaabo.docx');
    console.log('Testing file:', filePath);
    console.log('\n=== PARSING ===');
    
    const questions = await parseDocxQuestions(filePath);
    
    console.log('\n=== FIRST 3 QUESTIONS ===');
    console.log(JSON.stringify(questions.slice(0, 3), null, 2));
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testParse();
