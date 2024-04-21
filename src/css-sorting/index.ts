'use strict'

import * as postcss from 'postcss'
import * as postcssSorting from 'postcss-sorting'
import * as vscode from 'vscode'

import { IResult, ISettings } from '../types'

export function isSupportedSyntax(language: string): boolean {
	return ['css', 'postcss', 'less', 'scss'].indexOf(language) !== -1
}

export async function use(settings: ISettings, document: vscode.TextDocument, inRange: vscode.Range): Promise<IResult> {
	if (!isSupportedSyntax(document.languageId)) {
		console.error(
			'Cannot execute PostCSS Sorting because there is not style files. Supported: LESS, SCSS and CSS.'
		)

		return
	}

	let text
	let range = inRange

	if (!range) {
		const lastLine = document.lineAt(document.lineCount - 1)
		const start = new vscode.Position(0, 0)
		const end = new vscode.Position(document.lineCount - 1, lastLine.text.length)

		range = new vscode.Range(start, end)
		text = document.getText()
	} else {
		text = document.getText(range)
	}

	const postcssConfig: postcss.ProcessOptions = {
		from: document.uri.fsPath || ''
	}

	if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length !== 0) {
		postcssConfig.from = vscode.workspace.workspaceFolders[0].uri.fsPath || ''
	}

	const postcssPlugins: postcss.AcceptedPlugin[] = [postcssSorting(settings.config)]

	return postcss(postcssPlugins)
		.process(text, postcssConfig)
		.then(
			result =>
				<IResult>{
					css: result.css,
					range
				}
		)
}
