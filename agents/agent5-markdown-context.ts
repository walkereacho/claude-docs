#!/usr/bin/env node
import { execSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Agent 5: Markdown Context Approach
 * Strategy: Creates a markdown file with embedded file content and instructions
 */

const testDocPath = path.resolve('./Test Doc.md');

try {
  console.log('Agent 5: Starting markdown context approach...');
  
  // Read current content
  const currentContent = fs.readFileSync(testDocPath, 'utf-8');
  
  // Create a comprehensive markdown context file
  const contextPath = path.join(path.dirname(testDocPath), '.agent5-context.md');
  const contextContent = `# Claude Code Task from Agent 5

## Current File Information
- **File Path**: ${testDocPath}
- **File Name**: Test Doc.md
- **Task**: Add Agent 5's contribution to the document

## Current File Content
The file currently contains:

\`\`\`markdown
${currentContent}
\`\`\`

## Required Action
Please edit the file at \`${testDocPath}\` and add the following section at the end:

### New Section to Add:
\`\`\`markdown
## Agent 5 Markdown Context Method

Agent 5 successfully demonstrated the markdown context approach! This method involves:
- Creating a detailed context file in markdown format
- Embedding the current file content
- Providing clear instructions for modifications
- Using Claude Code's ability to understand markdown structure

This approach leverages Claude's strength in understanding structured documents.
\`\`\`

## Verification
After making the change, the file should have the new section added while preserving all existing content.
`;
  
  fs.writeFileSync(contextPath, contextContent);
  
  // Execute claude with the context file
  const prompt = `Please read the context file at ${contextPath} and follow the instructions to modify Test Doc.md as specified. The file to modify is at: ${testDocPath}`;
  const command = `echo "${prompt}" | claude --model sonnet --permission-mode acceptEdits`;
  
  console.log('Executing with markdown context...');
  
  const result = execSync(command, {
    encoding: 'utf-8',
    stdio: 'pipe'
  });
  
  console.log('Agent 5 Result:', result);
  
  // Clean up context file
  try {
    fs.unlinkSync(contextPath);
  } catch (e) {
    // Ignore cleanup errors
  }
  
  console.log('Agent 5: Completed successfully!');
} catch (error) {
  console.error('Agent 5 Error:', error);
}