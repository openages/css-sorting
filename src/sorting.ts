import postcss from 'postcss'
import postcssSorting from 'postcss-sorting'
import vscode from 'vscode'

import default_config from './default_config'
import { getSettings } from './utils'

import type { IResult } from './types'

export function isSupportedSyntax(language: string): boolean {
	return ['css', 'less', 'scss'].indexOf(language) !== -1
}

export async function use(document: vscode.TextDocument, inRange?: vscode.Range): Promise<IResult> {
	if (!isSupportedSyntax(document.languageId)) {
		console.error(
			'Cannot execute PostCSS Sorting because there is not style files. Supported: LESS, SCSS and CSS.'
		)

		return
	}

	let text: string
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

	return transform(text, range)
}

export const transform = async (text: string, range?: vscode.Range) => {
	const settings = getSettings()
	const config = Object.keys(settings.config || {}).length ? settings.config : default_config
	const postcssPlugins: postcss.AcceptedPlugin[] = [postcssSorting(config)]

	const { css } = await postcss(postcssPlugins).process(text)

	return { css, range }
}
