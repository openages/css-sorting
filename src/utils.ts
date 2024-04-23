import vscode from 'vscode'
import { merge } from 'webpack-merge'

import default_config from './default_config'

import type { ISettings } from './types'

export function getSettings() {
	return merge<ISettings>(
		default_config as ISettings,
		(vscode.workspace.getConfiguration().get('CSSSorting') as any).config as ISettings
	)
}

export function output(inChannel: vscode.OutputChannel, message: string, autoShowOutput: boolean = true): void {
	let channel = inChannel
	if (!channel) {
		channel = vscode.window.createOutputChannel('Stylefmt')
	}

	channel.clear()
	channel.appendLine('[Stylefmt]')
	channel.append(message.toString())

	if (autoShowOutput) {
		channel.show()
	}
}
