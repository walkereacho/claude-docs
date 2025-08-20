# Claude Docs
An Obsidian plugin that integrates Claude Code CLI directly into your note-taking/doc-writing workflow. Send your markdown documents to Claude for AI-powered editing without leaving Obsidian.

## Features

- **Direct Integration**: Send the current markdown document to Claude Code with a single command
- **Model Selection**: Choose between Sonnet, Opus, or Haiku models directly in the prompt modal
- **Smart Path Detection**: Automatically detects Claude installation and system paths
- **Configurable Settings**: Customize Claude CLI path and system PATH for your environment
- **Non-blocking Execution**: Async command execution ensures Obsidian UI remains responsive
- **Visual Feedback**: Loading indicators and success/error notifications keep you informed

## Prerequisites

- [Claude Code CLI](https://github.com/anthropics/claude-code) must be installed on your system
- Valid Claude API access

## Installation

1. Clone this repository into your vault's `.obsidian/plugins/` directory
2. Navigate to the plugin directory and run:
   ```bash
   npm install
   npm run build
   ```
3. Enable the plugin in Obsidian's Community Plugins settings

## Usage

### Basic Usage

1. Open any markdown file in Obsidian
2. Open the Command Palette (Cmd/Ctrl + P)
3. Search for "Send doc to Claude Code"
4. In the modal that appears:
   - Select your preferred model (Sonnet, Opus, or Haiku)
   - Enter your prompt (e.g., "Add a section about TypeScript best practices")
   - Click "Send to Claude" or press Cmd/Ctrl + Enter
5. Claude will modify your file directly

### Configuration

Access plugin settings through Settings → Plugin Options → Claude Code

#### Available Settings:

- **Claude Path**: Path to the Claude CLI executable
  - Default: Auto-detects common installation locations
  - Examples: `/Users/username/.bun/bin/claude`, `claude` (if in PATH)

- **System PATH**: Additional PATH directories for Claude to access tools
  - Default: Auto-detects system paths including Homebrew and common bin directories
  - Use the "Detect system PATH" button for automatic configuration

## How It Works

The plugin uses the following approach:
1. Captures your prompt and the current document's absolute path
2. Constructs a command: `echo "prompt + filepath" | claude --model [selected] --permission-mode acceptEdits`
3. Executes the command with proper environment variables
4. Claude modifies your file directly
5. You see the changes immediately in Obsidian

## Development

### Building from Source

```bash
# Install dependencies
npm install

# Development build with file watching
npm run dev

# Production build
npm run build
```

### Project Structure

```
claude-docs/
├── main.ts                 # Main plugin file
├── services/
│   └── ClaudeCodeService.ts # Claude CLI integration
├── manifest.json           # Plugin metadata
└── README.md              # This file
```

## Troubleshooting

### "Claude Code CLI not found" Error

1. Ensure Claude Code is installed: `which claude`
2. Update the Claude Path in settings to the full path
3. Verify your System PATH includes necessary directories

### Command Execution Fails

1. Check that Claude Code works in your terminal
2. Ensure you have proper API access configured
3. Try running with a simple prompt first

### File Not Modified

1. Verify the file is saved before sending to Claude
2. Check Obsidian's console for error messages
3. Ensure Claude has permission to modify files in your vault

## Security Considerations

- The plugin executes shell commands with your prompts
- File paths are passed to external processes
- Ensure you trust the Claude Code CLI installation
- Review prompts before sending sensitive documents

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

[MIT License](LICENSE)

## Acknowledgments

Built using insights from extensive Claude Code CLI testing documented in [CLAUDE_CODE_AGENT_FINDINGS.md](CLAUDE_CODE_AGENT_FINDINGS.md).