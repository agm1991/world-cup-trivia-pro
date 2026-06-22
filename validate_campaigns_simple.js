// Simple validation script for campaign questions
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/data/campaignQuestions.ts');
const content = fs.readFileSync(filePath, 'utf-8');

const issues = {
  wrongQuestionCount: [],
  hintsRevealAnswers: [],
  yearMismatch: []
};

// Find all country blocks
const countryBlocks = content.match(/(['"]?[a-z\s]+['"]?):\s*\{/g) || [];

console.log('=== CAMPAIGN VALIDATION REPORT ===\n');
console.log(`Found ${countryBlocks.length} countries\n`);

// Check each country
countryBlocks.forEach(countryBlock => {
  const countryMatch = countryBlock.match(/(['"]?)([a-z\s]+)\1:/);
  if (!countryMatch) return;
  
  const country = countryMatch[2].trim();
  
  // Find all year blocks for this country
  const countryStart = content.indexOf(countryBlock);
  let countryEnd = content.indexOf('\n  },\n', countryStart);
  if (countryEnd === -1) countryEnd = content.length;
  
  const countryContent = content.substring(countryStart, countryEnd);
  
  // Find years
  const yearMatches = countryContent.matchAll(/(\d{4}):\s*\[/g);
  
  for (const yearMatch of yearMatches) {
    const year = parseInt(yearMatch[1]);
    const yearStart = yearMatch.index + yearMatch[0].length;
    
    // Find the closing bracket for this year
    let bracketCount = 1;
    let yearEnd = yearStart;
    while (bracketCount > 0 && yearEnd < countryContent.length) {
      if (countryContent[yearEnd] === '[') bracketCount++;
      if (countryContent[yearEnd] === ']') bracketCount--;
      yearEnd++;
    }
    
    const yearContent = countryContent.substring(yearStart, yearEnd - 1);
    
    // Count questions (each question is an object with id)
    const questionMatches = yearContent.match(/\{\s*id:\s*\d+/g) || [];
    const questionCount = questionMatches.length;
    
    if (questionCount !== 10) {
      issues.wrongQuestionCount.push({ country, year, count: questionCount });
    }
    
    // Check each question for issues
    const questionObjects = yearContent.match(/\{[\s\S]*?\}/g) || [];
    
    questionObjects.forEach((qObj, idx) => {
      const idMatch = qObj.match(/id:\s*(\d+)/);
      const questionMatch = qObj.match(/question:\s*"([^"]+)"/);
      const correctMatch = qObj.match(/correctAnswer:\s*['"]([A-D])['"]/);
      const hint1Match = qObj.match(/hint1:\s*"([^"]+)"/);
      const hint2Match = qObj.match(/hint2:\s*"([^"]+)"/);
      const hint3Match = qObj.match(/hint3:\s*"([^"]+)"/);
      const optionAMatch = qObj.match(/optionA:\s*"([^"]+)"/);
      const optionBMatch = qObj.match(/optionB:\s*"([^"]+)"/);
      const optionCMatch = qObj.match(/optionC:\s*"([^"]+)"/);
      const optionDMatch = qObj.match(/optionD:\s*"([^"]+)"/);
      
      if (!idMatch || !questionMatch || !correctMatch) return;
      
      const id = parseInt(idMatch[1]);
      const question = questionMatch[1];
      const correct = correctMatch[1];
      
      const correctAnswer = correct === 'A' ? (optionAMatch?.[1] || '') :
                           correct === 'B' ? (optionBMatch?.[1] || '') :
                           correct === 'C' ? (optionCMatch?.[1] || '') :
                           (optionDMatch?.[1] || '');
      
      // Check year in question
      const yearInQuestion = question.match(/\b(19|20)\d{2}\b/);
      if (yearInQuestion && parseInt(yearInQuestion[0]) !== year) {
        issues.yearMismatch.push({
          country,
          year,
          questionId: id,
          questionYear: yearInQuestion[0]
        });
      }
      
      // Check hints
      const hints = [
        { num: 1, text: hint1Match?.[1] || '' },
        { num: 2, text: hint2Match?.[1] || '' },
        { num: 3, text: hint3Match?.[1] || '' }
      ];
      
      hints.forEach(hint => {
        if (correctAnswer && hint.text && 
            hint.text.toLowerCase().includes(correctAnswer.toLowerCase())) {
          issues.hintsRevealAnswers.push({
            country,
            year,
            questionId: id,
            hint: `hint${hint.num}`,
            hintText: hint.text,
            answer: correctAnswer
          });
        }
      });
    });
  }
});

// Report
if (issues.wrongQuestionCount.length > 0) {
  console.log(`❌ WRONG QUESTION COUNT (${issues.wrongQuestionCount.length}):`);
  issues.wrongQuestionCount.forEach(issue => {
    console.log(`  ${issue.country} ${issue.year}: ${issue.count} questions (expected 10)`);
  });
  console.log('');
}

if (issues.hintsRevealAnswers.length > 0) {
  console.log(`❌ HINTS REVEAL ANSWERS (${issues.hintsRevealAnswers.length}):`);
  issues.hintsRevealAnswers.slice(0, 30).forEach(issue => {
    console.log(`  ${issue.country} ${issue.year} Q${issue.questionId} ${issue.hint}: "${issue.hintText.substring(0, 50)}" contains answer`);
  });
  if (issues.hintsRevealAnswers.length > 30) {
    console.log(`  ... and ${issues.hintsRevealAnswers.length - 30} more`);
  }
  console.log('');
}

if (issues.yearMismatch.length > 0) {
  console.log(`❌ YEAR MISMATCH (${issues.yearMismatch.length}):`);
  issues.yearMismatch.slice(0, 30).forEach(issue => {
    console.log(`  ${issue.country} ${issue.year} Q${issue.questionId}: mentions ${issue.questionYear}`);
  });
  if (issues.yearMismatch.length > 30) {
    console.log(`  ... and ${issues.yearMismatch.length - 30} more`);
  }
  console.log('');
}

const totalIssues = issues.wrongQuestionCount.length + 
                   issues.hintsRevealAnswers.length + 
                   issues.yearMismatch.length;

if (totalIssues === 0) {
  console.log('✅ ALL CHECKS PASSED!');
} else {
  console.log(`\n⚠️  TOTAL ISSUES FOUND: ${totalIssues}`);
}
