import { App, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { ClaudeCodeService } from './services/ClaudeCodeService';


interface ClaudeCodePluginSettings {
	claudePath: string;
	customPath: string;
}

// Try to detect the user's claude installation
function detectClaudePath(): string {
	const homePath = process.env.HOME || '';
	if (homePath) {
		// Common installation paths to check
		const possiblePaths = [
			`${homePath}/.bun/bin/claude`,
			`${homePath}/.local/bin/claude`,
			'/usr/local/bin/claude',
			'claude' // fallback to PATH
		];
		// For now, return the first one (in real implementation, we'd check if file exists)
		return possiblePaths[0];
	}
	return 'claude';
}

function detectSystemPath(): string {
	const homePath = process.env.HOME || '';
	const defaultPath = '/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin';
	if (homePath) {
		return `${homePath}/.bun/bin:/opt/homebrew/bin:/opt/homebrew/sbin:${defaultPath}`;
	}
	return defaultPath;
}

const DEFAULT_SETTINGS: ClaudeCodePluginSettings = {
	claudePath: detectClaudePath(),
	customPath: detectSystemPath()
}

export default class ClaudeCodePlugin extends Plugin {
	settings: ClaudeCodePluginSettings;

	async onload() {
		await this.loadSettings();

		// Add settings tab
		this.addSettingTab(new ClaudeCodeSettingTab(this.app, this));

		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: 'send-doc-to-claude-code',
			name: 'Send doc to Claude Code',
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
					if (!checking) {
						const file = markdownView.file;
						if (!file) {
							new Notice('No active file found');
							return false;
						}

						// Get the absolute path of the current file
						// @ts-ignore - getBasePath exists but isn't in the type definitions
						const basePath = this.app.vault.adapter.getBasePath?.() || this.app.vault.adapter.basePath || '';
						const filePath = basePath ? `${basePath}/${file.path}` : file.path;

						new ClaudePromptModal(this.app, async (prompt, model) => {
							// Show that we're processing with a longer timeout
							const loadingNotice = new Notice(`🤖 Claude Code (${model}) is working on your file...`, 0);

							try {
								// Execute the command with settings and model
								const result = await ClaudeCodeService.executeCommand(
									prompt,
									filePath,
									{ ...this.settings, claudeModel: model }
								);

								// Hide loading notice
								loadingNotice.hide();

								// Show result notification
								if (result.success) {
									new Notice('✅ Claude Code executed successfully! Check your file for changes.', 5000);
								} else {
									new Notice(`❌ Error: ${result.error || 'Unknown error'}`, 8000);
								}
							} catch (error) {
								loadingNotice.hide();
								new Notice(`❌ Unexpected error: ${error}`, 8000);
							}
						}).open();
					}

					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
			}
		});
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class ClaudePromptModal extends Modal {
	result: string;
	model: string = 'sonnet'; // Default model
	onSubmit: (result: string, model: string) => void;

	constructor(app: App, onSubmit: (result: string, model: string) => void) {
		super(app);
		this.onSubmit = onSubmit;
	}

	onOpen() {
		const { contentEl } = this;

		contentEl.createEl("h2", { text: "Send to Claude Code" });

		contentEl.createEl("p", {
			text: "Enter your prompt for Claude Code. The current document will be included automatically."
		});

		// Model selection
		const modelContainer = contentEl.createDiv({ attr: { style: "margin: 10px 0;" } });
		modelContainer.createEl("label", { text: "Model: ", attr: { style: "font-weight: bold; margin-right: 10px;" } });

		const modelButtons = modelContainer.createDiv({ attr: { style: "display: inline-flex; gap: 5px;" } });

		const models = [
			{ value: 'sonnet', label: 'Sonnet' },
			{ value: 'opus', label: 'Opus' },
			{ value: 'haiku', label: 'Haiku' }
		];

		models.forEach(modelOption => {
			const button = modelButtons.createEl("button", {
				text: modelOption.label,
				attr: {
					style: `padding: 5px 15px; ${this.model === modelOption.value ?
						'background-color: var(--interactive-accent); color: var(--text-on-accent);' :
						'background-color: var(--background-secondary);'}`
				}
			});
			button.onclick = () => {
				this.model = modelOption.value;
				// Update button styles
				modelButtons.querySelectorAll('button').forEach(btn => {
					btn.style.backgroundColor = 'var(--background-secondary)';
					btn.style.color = '';
				});
				button.style.backgroundColor = 'var(--interactive-accent)';
				button.style.color = 'var(--text-on-accent)';
			};
		});

		const inputContainer = contentEl.createDiv();
		const textArea = inputContainer.createEl("textarea", {
			attr: {
				style: "width: 100%; height: 150px; margin: 10px 0;",
				placeholder: "e.g., Add a new section about TypeScript best practices..."
			}
		});

		textArea.focus();

		const buttonContainer = contentEl.createDiv({
			attr: { style: "display: flex; justify-content: flex-end; gap: 10px; margin-top: 10px;" }
		});

		const cancelButton = buttonContainer.createEl("button", { text: "Cancel" });
		cancelButton.onclick = () => {
			this.close();
		};

		const submitButton = buttonContainer.createEl("button", {
			text: "Send to Claude",
			attr: { style: "background-color: var(--interactive-accent); color: var(--text-on-accent);" }
		});
		submitButton.onclick = () => {
			const value = textArea.value.trim();
			if (value) {
				this.result = value;
				this.close();
				this.onSubmit(this.result, this.model);
			}
		};

		// Allow submit with Cmd/Ctrl+Enter
		textArea.addEventListener("keydown", (e) => {
			if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
				submitButton.click();
			}
		});
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}

class ClaudeCodeSettingTab extends PluginSettingTab {
	plugin: ClaudeCodePlugin;

	constructor(app: App, plugin: ClaudeCodePlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl('h2', { text: 'Claude Code Plugin Settings' });

		new Setting(containerEl)
			.setName('Claude Path')
			.setDesc('Path to the Claude CLI executable. Use "claude" if it\'s in your PATH, or provide full path like "/Users/username/.bun/bin/claude"')
			.addText(text => text
				.setPlaceholder('/path/to/claude')
				.setValue(this.plugin.settings.claudePath)
				.onChange(async (value) => {
					this.plugin.settings.claudePath = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('System PATH')
			.setDesc('Additional PATH directories for Claude to access tools like Node.js. Separate multiple paths with colons (:)')
			.addTextArea(text => text
				.setPlaceholder('/usr/local/bin:/usr/bin:/bin')
				.setValue(this.plugin.settings.customPath)
				.onChange(async (value) => {
					this.plugin.settings.customPath = value;
					await this.plugin.saveSettings();
				}))
			.addExtraButton(button => button
				.setIcon('reset')
				.setTooltip('Detect system PATH')
				.onClick(async () => {
					// Try to detect system PATH
					const defaultPath = '/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin';
					const homePath = process.env.HOME || '';
					const detectedPath = homePath ?
						`${homePath}/.bun/bin:/opt/homebrew/bin:/opt/homebrew/sbin:${defaultPath}` :
						defaultPath;
					this.plugin.settings.customPath = detectedPath;
					await this.plugin.saveSettings();
					this.display(); // Refresh the display
				}));
	}
}
