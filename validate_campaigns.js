// Validation script for campaign questions
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/data/campaignQuestions.ts');
const content = fs.readFileSync(filePath, 'utf-8');

// Extract all campaigns
const campaignRegex = /(\w+):\s*\{([^}]+)\}/g;
const yearRegex = /(\d{4}):\s*\[([^\]]+)\]/g;

const issues = {
  wrongQuestionCount: [],
  duplicateQuestions: [],
  hintsRevealAnswers: [],
  yearMismatch: [],
  duplicateYears: []
};

// Track all questions for duplicates
const allQuestions = new Map(); // question text -> [country, year, id]

// Parse the file
let countryMatch;
const countries = {};

while ((countryMatch = campaignRegex.exec(content)) !== null) {
  const country = countryMatch[1].replace(/['"]/g, '');
  const countryContent = countryMatch[2];
  
  countries[country] = {};
  
  let yearMatch;
  while ((yearMatch = yearRegex.exec(countryContent)) !== null) {
    const year = parseInt(yearMatch[1]);
    const questionsContent = yearMatch[2];
    
    // Count questions
    const questionMatches = questionsContent.match(/\{[\s\S]*?\}/g) || [];
    
    if (questionMatches.length !== 10) {
      issues.wrongQuestionCount.push({
        country,
        year,
        count: questionMatches.length,
        expected: 10
      });
    }
    
    // Check for duplicate years
    if (countries[country][year]) {
      issues.duplicateYears.push({ country, year });
    }
    countries[country][year] = true;
    
    // Parse each question
    questionMatches.forEach((qMatch, idx) => {
      const idMatch = qMatch.match(/id:\s*(\d+)/);
      const questionMatch = qMatch.match(/question:\s*"([^"]+)"/);
      const correctMatch = qMatch.match(/correctAnswer:\s*['"]([A-D])['"]/);
      const hint1Match = qMatch.match(/hint1:\s*"([^"]+)"/);
      const hint2Match = qMatch.match(/hint2:\s*"([^"]+)"/);
      const hint3Match = qMatch.match(/hint3:\s*"([^"]+)"/);
      const optionAMatch = qMatch.match(/optionA:\s*"([^"]+)"/);
      const optionBMatch = qMatch.match(/optionB:\s*"([^"]+)"/);
      const optionCMatch = qMatch.match(/optionC:\s*"([^"]+)"/);
      const optionDMatch = qMatch.match(/optionD:\s*"([^"]+)"/);
      
      if (!idMatch || !questionMatch || !correctMatch) return;
      
      const id = parseInt(idMatch[1]);
      const question = questionMatch[1];
      const correct = correctMatch[1];
      const correctAnswer = correct === 'A' ? optionAMatch?.[1] : 
                           correct === 'B' ? optionBMatch?.[1] :
                           correct === 'C' ? optionCMatch?.[1] :
                           optionDMatch?.[1];
      
      // Check year consistency in question
      const yearInQuestion = question.match(/\b(19|20)\d{2}\b/);
      if (yearInQuestion && parseInt(yearInQuestion[0]) !== year) {
        issues.yearMismatch.push({
          country,
          year,
          questionId: id,
          questionYear: yearInQuestion[0],
          expectedYear: year
        });
      }
      
      // Check hints don't reveal answer
      const hints = [
        hint1Match?.[1] || '',
        hint2Match?.[1] || '',
        hint3Match?.[1] || ''
      ];
      
      hints.forEach((hint, hintIdx) => {
        if (correctAnswer && hint.toLowerCase().includes(correctAnswer.toLowerCase())) {
          issues.hintsRevealAnswers.push({
            country,
            year,
            questionId: id,
            hint: `hint${hintIdx + 1}`,
            hintText: hint,
            answer: correctAnswer
          });
        }
      });
      
      // Check for duplicate questions
      const questionKey = question.toLowerCase().trim();
      if (allQuestions.has(questionKey)) {
        const existing = allQuestions.get(questionKey);
        issues.duplicateQuestions.push({
          country,
          year,
          questionId: id,
          duplicateOf: existing
        });
      } else {
        allQuestions.set(questionKey, { country, year, id });
      }
    });
  });
}

// Print results
console.log('=== CAMPAIGN VALIDATION REPORT ===\n');

console.log(`Total Countries: ${Object.keys(countries).length}`);
const totalCampaigns = Object.values(countries).reduce((sum, c) => sum + Object.keys(c).length, 0);
console.log(`Total Campaigns: ${totalCampaigns}\n`);

if (issues.wrongQuestionCount.length > 0) {
  console.log(`❌ WRONG QUESTION COUNT (${issues.wrongQuestionCount.length}):`);
  issues.wrongQuestionCount.forEach(issue => {
    console.log(`  ${issue.country} ${issue.year}: ${issue.count} questions (expected 10)`);
  });
  console.log('');
}

if (issues.duplicateYears.length > 0) {
  console.log(`❌ DUPLICATE YEARS (${issues.duplicateYears.length}):`);
  issues.duplicateYears.forEach(issue => {
    console.log(`  ${issue.country}: ${issue.year} appears multiple times`);
  });
  console.log('');
}

if (issues.duplicateQuestions.length > 0) {
  console.log(`❌ DUPLICATE QUESTIONS (${issues.duplicateQuestions.length}):`);
  issues.duplicateQuestions.slice(0, 20).forEach(issue => {
    console.log(`  ${issue.country} ${issue.year} Q${issue.questionId} duplicates ${issue.duplicateOf.country} ${issue.duplicateOf.year} Q${issue.duplicateOf.id}`);
  });
  if (issues.duplicateQuestions.length > 20) {
    console.log(`  ... and ${issues.duplicateQuestions.length - 20} more`);
  }
  console.log('');
}

if (issues.hintsRevealAnswers.length > 0) {
  console.log(`❌ HINTS REVEAL ANSWERS (${issues.hintsRevealAnswers.length}):`);
  issues.hintsRevealAnswers.slice(0, 20).forEach(issue => {
    console.log(`  ${issue.country} ${issue.year} Q${issue.questionId} ${issue.hint}: "${issue.hintText}" contains "${issue.answer}"`);
  });
  if (issues.hintsRevealAnswers.length > 20) {
    console.log(`  ... and ${issues.hintsRevealAnswers.length - 20} more`);
  }
  console.log('');
}

if (issues.yearMismatch.length > 0) {
  console.log(`❌ YEAR MISMATCH (${issues.yearMismatch.length}):`);
  issues.yearMismatch.slice(0, 20).forEach(issue => {
    console.log(`  ${issue.country} ${issue.year} Q${issue.questionId}: question mentions ${issue.questionYear} but campaign is ${issue.expectedYear}`);
  });
  if (issues.yearMismatch.length > 20) {
    console.log(`  ... and ${issues.yearMismatch.length - 20} more`);
  }
  console.log('');
}

const totalIssues = issues.wrongQuestionCount.length + 
                   issues.duplicateYears.length + 
                   issues.duplicateQuestions.length + 
                   issues.hintsRevealAnswers.length + 
                   issues.yearMismatch.length;

if (totalIssues === 0) {
  console.log('✅ ALL CHECKS PASSED!');
} else {
  console.log(`\n⚠️  TOTAL ISSUES FOUND: ${totalIssues}`);
}
