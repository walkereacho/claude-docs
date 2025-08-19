#!/usr/bin/env node
import { execSync } from 'child_process';
import * as path from 'path';
import { randomUUID } from 'crypto';

/**
 * Agent 6: Persistent Session Approach
 * Strategy: Creates a UUID session and maintains conversation across multiple document edits
 */

const testDocPath = path.resolve('./Test Doc.md');

function executeClaudeCommand(sessionId: string, prompt: string): string {
  const command = `echo "${prompt.replace(/"/g, '\\"')}" | claude --model sonnet --permission-mode acceptEdits --session-id ${sessionId}`;
  
  console.log('Executing:', command.substring(0, 80) + '...');
  
  const result = execSync(command, {
    encoding: 'utf-8',
    stdio: 'pipe',
    shell: true
  });
  
  return result;
}

async function runAgent6() {
  try {
  console.log('Agent 6: Starting persistent session approach...');
  
  // Generate a UUID for our session
  const sessionId = randomUUID();
  console.log(`Generated session ID: ${sessionId}`);
  
  // First interaction: Add initial section
  const firstPrompt = `Please add a new section to the Test Doc.md file located at '${testDocPath}'. Add it after the existing content with the heading '## Agent 6 Session Started' and write about starting a persistent Claude Code session with ID: ${sessionId}`;
  
  console.log('\n=== FIRST INTERACTION ===');
  const firstResult = executeClaudeCommand(sessionId, firstPrompt);
  console.log('First Result:', firstResult);
  
  // Wait a moment before second interaction
  console.log('\n⏳ Waiting 2 seconds before continuing conversation...');
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Second interaction: Continue the conversation in the same session
  const secondPrompt = `Great! Now please add another section right after the previous one with the heading '## Agent 6 Continued Conversation' and explain how this is the same Claude Code session continuing the conversation. Mention that we're demonstrating persistent session capability across multiple interactions.`;
  
  console.log('\n=== SECOND INTERACTION (SAME SESSION) ===');
  const secondResult = executeClaudeCommand(sessionId, secondPrompt);
  console.log('Second Result:', secondResult);
  
  // Wait a moment before third interaction
  console.log('\n⏳ Waiting 2 seconds before final interaction...');
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Third interaction: Demonstrate memory of previous interactions
  const thirdPrompt = `Perfect! Now please add a final section '## Agent 6 Session Summary' that summarizes what we accomplished in this session. Reference the previous sections we added and confirm that you remember our earlier interactions in this session.`;
  
  console.log('\n=== THIRD INTERACTION (SAME SESSION) ===');
  const thirdResult = executeClaudeCommand(sessionId, thirdPrompt);
  console.log('Third Result:', thirdResult);
  
  console.log(`\n✅ Agent 6: Successfully completed persistent session with ID: ${sessionId}`);
  console.log('Session demonstrated:');
  console.log('  - UUID-based session creation');
  console.log('  - Multiple interactions in same session');
  console.log('  - Session memory across interactions');
  
  } catch (error) {
    console.error('Agent 6 Error:', error);
  }
}

// Run the agent
runAgent6().catch(console.error);