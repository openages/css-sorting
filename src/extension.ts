'use strict'

import vscode from 'vscode'

import { use } from './css-sorting'
import { getSettings } from './managers/settings'
import { output } from './utils'

export function activate(context: vscode.ExtensionContext): void {
	const outputChannel: vscode.OutputChannel = null

	// Supported languages
	const supportedDocuments: vscode.DocumentSelector = [
		{ language: 'css', scheme: 'file' },
		{ language: 'scss', scheme: 'file' },
		{ language: 'less', scheme: 'file' }
	]

	// For plugin command: "CSSSorting.execute"
	const command = vscode.commands.registerTextEditorCommand('CSSSorting.execute', textEditor => {
		// Prevent run command without active TextEditor
		if (!vscode.window.activeTextEditor) {
			return null
		}

		const document = textEditor.document
		const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri)
		const workspaceUri = workspaceFolder ? workspaceFolder.uri : null
		const settings = getSettings(workspaceUri)

		use(settings, document, null)
			.then(result => {
				if (!result) return

				textEditor.edit(editBuilder => {
					editBuilder.replace(result.range, result.css)
				})
			})
			.catch(err => output(outputChannel, err, settings.showErrorMessages))
	})

	// For commands: "Format Document" and "Format Selection"
	const format = vscode.languages.registerDocumentRangeFormattingEditProvider(supportedDocuments, {
		provideDocumentRangeFormattingEdits(
			document: vscode.TextDocument,
			range: vscode.Range
		): vscode.ProviderResult<vscode.TextEdit[]> {
			// Prevent run command without active TextEditor
			if (!vscode.window.activeTextEditor) {
				return null
			}

			const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri)
			const workspaceUri = workspaceFolder ? workspaceFolder.uri : null
			const settings = getSettings(workspaceUri)

			return use(settings, document, range)
				.catch(err => output(outputChannel, err, settings.showErrorMessages))
				.then(result => {
					if (!result) {
						return
					}

					return [vscode.TextEdit.replace(result.range, result.css)]
				})
		}
	})

	// Subscriptions
	context.subscriptions.push(command)
	context.subscriptions.push(format)
}
