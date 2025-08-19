#!/usr/bin/env node
import { execSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Agent 3: Context Directory Approach
 * Strategy: Uses the current working directory context with explicit file reference
 */

const testDocPath = path.resolve('./Test Doc.md');
const workDir = path.dirname(testDocPath);

try {
  console.log('Agent 3: Starting context directory approach...');
  
  // Create a temporary instruction file that references the test doc
  const instructionFile = path.join(workDir, '.agent3-instructions.md');
  const instructions = `# Task for Claude Code

Please modify the file 'Test Doc.md' in the current directory by adding a new section:

## Agent 3 Achieved Connection

Write about how Agent 3 successfully used the working directory context to pass the document to Claude Code. The file is located at: ${testDocPath}

After adding this section, save the file.`;
  
  fs.writeFileSync(instructionFile, instructions);
  
  // Execute claude from the directory containing Test Doc.md
  const prompt = `Please read the file '.agent3-instructions.md' in the current directory and follow its instructions to modify Test Doc.md`;
  const command = `cd "${workDir}" && echo "${prompt}" | claude --model sonnet --permission-mode acceptEdits`;
  
  console.log('Executing command with context:', command);
  
  const result = execSync(command, {
    encoding: 'utf-8',
    stdio: 'pipe',
    shell: true
  });
  
  console.log('Agent 3 Result:', result);
  
  // Clean up instruction file
  try {
    fs.unlinkSync(instructionFile);
  } catch (e) {
    // Ignore cleanup errors
  }
  
  console.log('Agent 3: Completed successfully!');
} catch (error) {
  console.error('Agent 3 Error:', error);
}