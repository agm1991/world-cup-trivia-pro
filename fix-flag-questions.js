const fs = require('fs');
const path = require('path');

// Flag emoji to country name mapping
const flagToCountry = {
  '🇦🇷': 'Argentina',
  '🇦🇺': 'Australia',
  '🇧🇪': 'Belgium',
  '🇧🇷': 'Brazil',
  '🇨🇦': 'Canada',
  '🇨🇱': 'Chile',
  '🇨🇴': 'Colombia',
  '🇭🇷': 'Croatia',
  '🇩🇰': 'Denmark',
  '🇪🇨': 'Ecuador',
  '🇪🇬': 'Egypt',
  '🏴󠁧󠁢󠁥󠁮󠁧󠁿': 'England',
  '🇫🇷': 'France',
  '🇩🇪': 'Germany',
  '🇬🇭': 'Ghana',
  '🇬🇷': 'Greece',
  '🇮🇹': 'Italy',
  '🇯🇵': 'Japan',
  '🇲🇽': 'Mexico',
  '🇲🇦': 'Morocco',
  '🇳🇱': 'Netherlands',
  '🇳🇬': 'Nigeria',
  '🇳🇴': 'Norway',
  '🇵🇱': 'Poland',
  '🇵🇹': 'Portugal',
  '🇸🇦': 'Saudi Arabia',
  '🇸🇳': 'Senegal',
  '🇷🇸': 'Serbia',
  '🇰🇷': 'South Korea',
  '🇪🇸': 'Spain',
  '🇸🇪': 'Sweden',
  '🇨🇭': 'Switzerland',
  '🇹🇳': 'Tunisia',
  '🇺🇸': 'United States',
  '🇺🇾': 'Uruguay',
  '🏴󠁧󠁢󠁷󠁬󠁳󠁿': 'Wales',
  '🇨🇷': 'Costa Rica',
  '🇨🇲': 'Cameroon',
  '🇮🇷': 'Iran',
  '🇮🇸': 'Iceland',
  '🇿🇦': 'South Africa',
  '🇵🇾': 'Paraguay',
  '🇷🇺': 'Russia',
  '🇧🇦': 'Bosnia and Herzegovina',
  '🇧🇬': 'Bulgaria',
  '🇨🇳': 'China',
  '🇨🇺': 'Cuba',
  '🇨🇿': 'Czech Republic',
  '🇸🇻': 'El Salvador',
  '🇧🇴': 'Bolivia',
  '🇦🇹': 'Austria',
};

// Read the file
const filePath = path.join(__dirname, 'src/data/scorelineQuestions.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Function to extract context from question (year, round, etc.)
function extractContext(question) {
  // Extract year
  const yearMatch = question.match(/(\d{4})\s+World Cup/);
  const year = yearMatch ? yearMatch[1] : '';
  
  // Extract round/stage - be more specific
  let round = '';
  if (question.match(/final/i) && !question.match(/semi-final|quarter-final/i)) {
    round = 'final';
  } else if (question.match(/semi-final/i)) {
    round = 'semi-final';
  } else if (question.match(/quarter-final/i)) {
    round = 'quarter-final';
  } else if (question.match(/round of 16/i)) {
    round = 'round of 16';
  } else if (question.match(/group stage/i)) {
    round = 'group stage';
  }
  
  // Extract additional context
  let additional = '';
  if (question.includes('after extra time')) additional = 'after extra time';
  else if (question.includes('after 120 minutes')) additional = 'after 120 minutes';
  else if (question.includes('after 90 minutes')) additional = 'after 90 minutes';
  
  return { year, round, additional };
}

// Function to format question properly
function formatQuestion(question) {
  // Find all flag emojis in the question
  const flags = Object.keys(flagToCountry);
  const foundFlags = flags.filter(flag => question.includes(flag));
  
  if (foundFlags.length === 0) return question;
  
  // Extract countries in order they appear
  const flagPositions = foundFlags.map(flag => ({
    flag,
    country: flagToCountry[flag],
    position: question.indexOf(flag)
  })).sort((a, b) => a.position - b.position);
  
  const countries = flagPositions.map(f => f.country);
  const orderedFlags = flagPositions.map(f => f.flag);
  
  // Extract context
  const { year, round, additional } = extractContext(question);
  
  // Build context string
  let contextParts = [];
  if (year) contextParts.push(`the ${year} World Cup`);
  if (round) contextParts.push(round);
  if (additional) contextParts.push(additional);
  
  const context = contextParts.length > 0 ? ` in ${contextParts.join(' ')}` : '';
  
  // Format: "Country1 🇦🇷 vs Country2 🇫🇷 - What was the score[context]?"
  if (orderedFlags.length === 2) {
    return `${countries[0]} ${orderedFlags[0]} vs ${countries[1]} ${orderedFlags[1]} - What was the score${context}?`;
  } else if (orderedFlags.length === 1) {
    return `${countries[0]} ${orderedFlags[0]} - What was the score${context}?`;
  }
  
  return question;
}

// Process all question lines
const lines = content.split('\n');
const processedLines = lines.map(line => {
  // Check if this is a question line
  if (line.includes("question: '") || line.includes('question: "')) {
    // Extract the question text
    const questionMatch = line.match(/question:\s*['"](.*)['"]/);
    if (questionMatch) {
      const originalQuestion = questionMatch[1];
      
      // Only process if it contains flags
      const flags = Object.keys(flagToCountry);
      const hasFlags = flags.some(flag => originalQuestion.includes(flag));
      
      if (hasFlags) {
        const formattedQuestion = formatQuestion(originalQuestion);
        // Replace in the line, preserving quotes
        const quote = line.includes("question: '") ? "'" : '"';
        return line.replace(new RegExp(`question:\\s*${quote}.*?${quote}`), `question: ${quote}${formattedQuestion}${quote}`);
      }
    }
  }
  return line;
});

// Write back
const newContent = processedLines.join('\n');
fs.writeFileSync(filePath, newContent, 'utf8');

console.log('Fixed all flag questions!');

