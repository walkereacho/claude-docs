#!/usr/bin/env node
import { execSync } from 'child_process';
import * as path from 'path';

/**
 * Agent 7: Continue Session Approach
 * Strategy: Uses --continue flag to maintain conversation across multiple edits
 */

const testDocPath = path.resolve('./Test Doc.md');

function executeClaudeCommand(prompt: string, useContinue: boolean = false): string {
  const continueFlag = useContinue ? '--continue' : '';
  const command = `echo "${prompt.replace(/"/g, '\\"')}" | claude --model sonnet --permission-mode acceptEdits ${continueFlag}`.trim();
  
  console.log('Executing:', command.substring(0, 80) + '...');
  
  const result = execSync(command, {
    encoding: 'utf-8',
    stdio: 'pipe',
    shell: true,
    cwd: path.dirname(testDocPath) // Ensure we're in the same directory for --continue to work
  });
  
  return result;
}

async function runAgent7() {
  try {
    console.log('Agent 7: Starting continue session approach...');
    console.log(`Working directory: ${path.dirname(testDocPath)}`);
    
    // First interaction: Start a new conversation
    const firstPrompt = `Please add a new section to the Test Doc.md file located at '${testDocPath}'. Add it after the existing content with the heading '## Agent 7 New Conversation' and explain that this starts a new conversation thread.`;
    
    console.log('\n=== FIRST INTERACTION (NEW CONVERSATION) ===');
    const firstResult = executeClaudeCommand(firstPrompt, false);
    console.log('First Result:', firstResult);
    
    // Wait a moment before continuing
    console.log('\n⏳ Waiting 3 seconds before continuing conversation...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Second interaction: Continue the previous conversation
    const secondPrompt = `Excellent! Now please add another section right after the previous one with the heading '## Agent 7 Continued Conversation' and explain how you're continuing the previous conversation using the --continue flag. Mention any context you remember from our previous interaction.`;
    
    console.log('\n=== SECOND INTERACTION (CONTINUING CONVERSATION) ===');
    const secondResult = executeClaudeCommand(secondPrompt, true);
    console.log('Second Result:', secondResult);
    
    // Wait before final interaction
    console.log('\n⏳ Waiting 3 seconds before final interaction...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Third interaction: Continue again to test persistence
    const thirdPrompt = `Perfect! Now add a final section '## Agent 7 Conversation Summary' that summarizes our entire conversation thread. Reference what we've done in both previous interactions to demonstrate conversation memory.`;
    
    console.log('\n=== THIRD INTERACTION (CONTINUING CONVERSATION) ===');
    const thirdResult = executeClaudeCommand(thirdPrompt, true);
    console.log('Third Result:', thirdResult);
    
    console.log('\n✅ Agent 7: Successfully completed continue-based conversation');
    console.log('Session demonstrated:');
    console.log('  - Initial conversation start');
    console.log('  - --continue flag usage');
    console.log('  - Conversation memory across interactions');
    
  } catch (error) {
    console.error('Agent 7 Error:', error);
  }
}

// Run the agent
runAgent7().catch(console.error);