#!/usr/bin/env node
import { execSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Master Runner Script
 * Executes all 5 agents sequentially and reports their results
 */

interface AgentResult {
  name: string;
  success: boolean;
  error?: string;
  duration: number;
}

const agents = [
  { name: 'Agent 1 - Direct Files', script: './agent1-direct-files.ts' },
  { name: 'Agent 2 - Pipe/Stdin', script: './agent2-pipe-stdin.ts' },
  { name: 'Agent 3 - Context Directory', script: './agent3-context-dir.ts' },
  { name: 'Agent 4 - Multi-Command', script: './agent4-multicommand.ts' },
  { name: 'Agent 5 - Markdown Context', script: './agent5-markdown-context.ts' }
];

async function runAgent(agent: typeof agents[0]): Promise<AgentResult> {
  const startTime = Date.now();
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Running: ${agent.name}`);
  console.log('='.repeat(60));
  
  try {
    const result = execSync(`npx tsx ${agent.script}`, {
      encoding: 'utf-8',
      stdio: 'inherit'
    });
    
    const duration = Date.now() - startTime;
    console.log(`✅ ${agent.name} completed in ${duration}ms`);
    
    return {
      name: agent.name,
      success: true,
      duration
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`❌ ${agent.name} failed after ${duration}ms`);
    console.error(`Error: ${errorMessage}`);
    
    return {
      name: agent.name,
      success: false,
      error: errorMessage,
      duration
    };
  }
}

async function main() {
  console.log('🚀 Starting Claude Code Document Passing Experiment');
  console.log(`📁 Working with: ${path.resolve('./Test Doc.md')}`);
  console.log(`⏰ Started at: ${new Date().toISOString()}\n`);
  
  // Create a backup of the original file
  const testDocPath = path.resolve('./Test Doc.md');
  const backupPath = path.resolve('./Test Doc.backup.md');
  
  if (fs.existsSync(testDocPath)) {
    fs.copyFileSync(testDocPath, backupPath);
    console.log(`📋 Created backup at: ${backupPath}\n`);
  }
  
  const results: AgentResult[] = [];
  
  // Run each agent with a delay between them
  for (const agent of agents) {
    const result = await runAgent(agent);
    results.push(result);
    
    // Wait 2 seconds between agents to avoid rate limiting
    if (agents.indexOf(agent) < agents.length - 1) {
      console.log('\n⏳ Waiting 2 seconds before next agent...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  // Print summary
  console.log(`\n${'='.repeat(60)}`);
  console.log('📊 FINAL RESULTS SUMMARY');
  console.log('='.repeat(60));
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`\n✅ Successful: ${successful.length}/${results.length}`);
  successful.forEach(r => {
    console.log(`   • ${r.name} (${r.duration}ms)`);
  });
  
  if (failed.length > 0) {
    console.log(`\n❌ Failed: ${failed.length}/${results.length}`);
    failed.forEach(r => {
      console.log(`   • ${r.name} (${r.duration}ms)`);
      if (r.error) {
        console.log(`     Error: ${r.error.substring(0, 100)}...`);
      }
    });
  }
  
  // Check if Test Doc.md was modified
  console.log('\n📄 Checking Test Doc.md for modifications...');
  try {
    const finalContent = fs.readFileSync(testDocPath, 'utf-8');
    const backupContent = fs.readFileSync(backupPath, 'utf-8');
    
    if (finalContent !== backupContent) {
      console.log('✅ Test Doc.md was successfully modified!');
      console.log(`   Original size: ${backupContent.length} bytes`);
      console.log(`   Final size: ${finalContent.length} bytes`);
      console.log(`   Difference: ${finalContent.length - backupContent.length} bytes`);
    } else {
      console.log('⚠️  Test Doc.md appears unchanged');
    }
  } catch (error) {
    console.error('❌ Error checking file modifications:', error);
  }
  
  console.log(`\n🏁 Experiment completed at: ${new Date().toISOString()}`);
  console.log(`⏱️  Total duration: ${results.reduce((sum, r) => sum + r.duration, 0)}ms`);
}

// Run the main function
main().catch(error => {
  console.error('Fatal error in runner:', error);
  process.exit(1);
});