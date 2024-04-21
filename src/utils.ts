import vscode from 'vscode'

import { ISettings } from './types'

export function getSettings(): ISettings {
	return vscode.workspace.getConfiguration().get('CSSSorting') as ISettings
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
