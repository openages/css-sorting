import { globSync } from 'fast-glob'
import { readFileSync, writeFileSync } from 'fs'
import { extname } from 'path'
import vscode from 'vscode'

import { transform, use } from './sorting'
import { getSettings, output } from './utils'

export function activate(context: vscode.ExtensionContext): void {
	const outputChannel: vscode.OutputChannel = null
	const setting = getSettings()

	const command = vscode.commands.registerTextEditorCommand('css_sorting.execute', textEditor => {
		if (!vscode.window.activeTextEditor) return null

		const document = textEditor.document

		use(document)
			.then(result => {
				if (!result) return

				textEditor.edit(editBuilder => {
					editBuilder.replace(result.range, result.css)
				})
			})
			.catch(err => output(outputChannel, err))
	})

	const format = vscode.commands.registerTextEditorCommand('css_sorting.format', textEditor => {
		if (!vscode.window.activeTextEditor) return null

		const document = textEditor.document

		use(document, textEditor.selection)
			.then(result => {
				if (!result) return

				textEditor.edit(editBuilder => {
					editBuilder.replace(result.range, result.css)
				})
			})
			.catch(err => output(outputChannel, err))
	})

	const save = vscode.workspace.onWillSaveTextDocument(event => {
		if (!vscode.window.activeTextEditor) return null

		const textEditor = vscode.window.activeTextEditor
		const document = event.document
		const ext = extname(document.fileName)

		if (!['.css', '.less', '.scss'].includes(ext)) return

		if (textEditor && event.document.uri.toString() !== textEditor.document.uri.toString()) return

		use(document)
			.then(result => {
				if (!result) return

				textEditor.edit(editBuilder => {
					editBuilder.replace(result.range, result.css)
				})
			})
			.catch(err => output(outputChannel, err))
	})

	const sortFile = async (path: string) => {
		const file_string = readFileSync(path).toString()

		const { css } = await transform(file_string)

		writeFileSync(path, css)
	}

	const sortFiles = async (uri: any) => {
		const files = globSync(['**/*.css', '**/*.less', '**/*.scss'], {
			cwd: uri.path,
			ignore: setting.ignore,
			absolute: true
		})

		const tasks = files.map(item => sortFile(item))
		const total = files.length
		const increment = 100 / total

		let current = files.length

		if (!total) return

		await vscode.window.withProgress(
			{ title: 'CSS Sorting', location: vscode.ProgressLocation.Notification },
			async p => {
				for (const task of tasks) {
					p.report({ message: `${current}/${total}`, increment })

					await task

					current = current - 1
				}

				vscode.window.showInformationMessage(`${total} CSS files has been sorted.`)

				return
			}
		)
	}

	const format_dir = vscode.commands.registerCommand('css_sorting.dir', sortFiles)
	const format_file = vscode.commands.registerCommand('css_sorting.file', uri => sortFile(uri.path))

	context.subscriptions.push(...[command, format, save, format_dir, format_file])
}
