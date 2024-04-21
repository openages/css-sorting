'use strict'

import vscode from 'vscode'

export interface ISettings {
	config?: object | string
}

export interface IResult {
	css: string
	range: vscode.Range
}
