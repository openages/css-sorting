import vscode from 'vscode'

export interface ISettings {
	order?: Array<string>
	'properties-order'?: Array<string>
	'unspecified-properties-position'?: 'top' | 'bottom'
	ignore?: Array<string>
}

export interface IResult {
	css: string
	range: vscode.Range
}
