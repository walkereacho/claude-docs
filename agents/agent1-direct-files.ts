#!/usr/bin/env node
import { execSync } from 'child_process';
import * as path from 'path';

/**
 * Agent 1: Direct Files Approach
 * Strategy: Uses the --files flag to provide context and asks Claude to modify the file
 */

const testDocPath = path.resolve('./Test Doc.md');

try {
  console.log('Agent 1: Starting direct files approach...');
  
  // Build the command with proper flags and file reference
  const prompt = `Please add a new section to the Test Doc.md file located at '${testDocPath}'. Add it after the existing content with the heading '## Agent 1 Says Hello' and write a friendly message about successfully passing the document to Claude Code using direct path reference.`;
  const command = `echo "${prompt}" | claude --model sonnet --permission-mode acceptEdits`;
  
  console.log('Executing command:', command);
  
  const result = execSync(command, {
    encoding: 'utf-8',
    stdio: 'pipe'
  });
  
  console.log('Agent 1 Result:', result);
  console.log('Agent 1: Completed successfully!');
} catch (error) {
  console.error('Agent 1 Error:', error);
}