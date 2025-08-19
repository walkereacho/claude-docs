#!/usr/bin/env node
import { execSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Agent 4: Multi-Command Approach
 * Strategy: Uses multiple sequential commands to establish context and then modify
 */

const testDocPath = path.resolve('./Test Doc.md');

function runAgent4() {
  console.log('Agent 4: Starting multi-command approach...');
  
  try {
    // First, create a script file with multiple commands
    const scriptContent = `
# First, read the current content
cat "${testDocPath}"

# Then modify it
echo ""
echo "## Agent 4 Multi-Command Success"
echo "Agent 4 demonstrates the power of combining multiple commands to work with Test Doc.md"
echo "This approach shows how sequential operations can build context for Claude Code."
`;
    
    const scriptFile = path.join(path.dirname(testDocPath), '.agent4-script.sh');
    fs.writeFileSync(scriptFile, scriptContent);
    fs.chmodSync(scriptFile, '755');
    
    // Build a complex command that reads, processes, and writes
    const complexPrompt = `
I need you to:
1. Read the file at ${testDocPath}
2. Add a new section titled "## Agent 4 Multi-Command Success"
3. Write about how Agent 4 used a multi-command approach
4. Save the changes back to the file

The file currently exists at: ${testDocPath}
Please use your file editing capabilities to add this new section.
`;
    
    // Execute with claude using echo pipe
    const command = `echo "${complexPrompt.trim().replace(/"/g, '\\"')}" | claude --model sonnet --permission-mode acceptEdits`;
    
    console.log('Executing command:', command);
    
    const result = execSync(command, {
      encoding: 'utf-8',
      stdio: 'pipe',
      shell: true
    });
    
    
    // Clean up script file
    try {
      fs.unlinkSync(scriptFile);
    } catch (e) {
      // Ignore cleanup errors
    }
    
    console.log('Agent 4: Completed successfully!');
    
  } catch (error) {
    console.error('Agent 4 Error:', error);
  }
}

// Run the agent
runAgent4();