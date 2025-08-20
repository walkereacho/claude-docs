import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';

const execAsync = promisify(exec);

interface ClaudeCodeSettings {
	claudePath: string;
	customPath: string;
	claudeModel: string;
}

export class ClaudeCodeService {
	/**
	 * Executes a Claude Code command with the given prompt and file path
	 * Uses the Agent 1 approach: direct file path reference in the prompt
	 */
	static async executeCommand(
		prompt: string,
		filePath: string,
		settings: ClaudeCodeSettings
	): Promise<{ success: boolean; error?: string }> {
		try {
			// Build the full prompt that includes both user request and file path
			const fullPrompt = `${prompt}. Please modify the file at: ${filePath}`;

			// Escape the prompt for shell execution
			const escapedPrompt = fullPrompt.replace(/"/g, '\\"').replace(/\$/g, '\\$');

			// Build the command using settings
			const claudePath = settings.claudePath || 'claude';
			const model = settings.claudeModel || 'sonnet';
			const command = `echo "${escapedPrompt}" | ${claudePath} --model ${model} --permission-mode acceptEdits`;

			console.log('Executing Claude Code command:', command.substring(0, 100) + '...');

			// Execute asynchronously to avoid blocking the UI
			const { stdout, stderr } = await execAsync(command, {
				encoding: 'utf-8',
				cwd: path.dirname(filePath),
				env: {
					...process.env,
					PATH: settings.customPath || '/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin'
				}
			});

			if (stderr && !stderr.includes('Warning')) {
				console.error('Claude Code stderr:', stderr);
			}

			console.log('Claude Code execution completed');
			return { success: true };

		} catch (error: any) {
			console.error('Claude Code execution error:', error);

			// Check for specific error patterns
			if (error.message?.includes('command not found')) {
				return {
					success: false,
					error: 'Claude Code CLI not found. Please ensure it is installed and in your PATH.'
				};
			}

			return {
				success: false,
				error: error.message || 'Unknown error occurred'
			};
		}
	}
}