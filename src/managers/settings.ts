'use strict'

import vscode from 'vscode'

import { ISettings } from '../types'

export function getSettings(): ISettings {
	return vscode.workspace.getConfiguration().get('CSSSorting') as ISettings
}
