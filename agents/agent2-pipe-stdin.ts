#!/usr/bin/env node
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Agent 2: Pipe Content Approach
 * Strategy: Reads the file content and pipes it through stdin with instructions
 */

const testDocPath = path.resolve('./Test Doc.md');

try {
  console.log('Agent 2: Starting pipe/stdin approach...');
  
  // Read the current content of the file
  const currentContent = fs.readFileSync(testDocPath, 'utf-8');
  
  // Create a prompt that includes the file content
  const prompt = `Here is the current content of Test Doc.md:

\`\`\`markdown
${currentContent}
\`\`\`

Please modify this file by adding a new section with the heading '## Agent 2 Reports Success' and write about how Agent 2 successfully passed the document content via stdin. Write the updated content back to Test Doc.md at path: ${testDocPath}`;
  
  // Use echo to pipe the prompt to claude with proper flags
  const command = `echo "${prompt.replace(/"/g, '\\"').replace(/\n/g, '\\n')}" | claude --model sonnet --permission-mode acceptEdits`;
  
  console.log('Executing piped command...');
  
  const result = execSync(command, {
    encoding: 'utf-8',
    stdio: 'pipe',
    shell: true
  });
  
  console.log('Agent 2 Result:', result);
  console.log('Agent 2: Completed successfully!');
} catch (error) {
  console.error('Agent 2 Error:', error);
}