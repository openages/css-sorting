'use strict'

import assert from 'assert'
import fs from 'fs'
import proxyquire from 'proxyquire'
import vscode from 'vscode'

import { ISettings } from '../types'

const text = fs.readFileSync('./fixtures/test.scss').toString()
const textExpected = fs.readFileSync('./fixtures/test-expected.scss').toString()

function mockupDocument(): vscode.TextDocument {
	return <vscode.TextDocument>{
		languageId: 'scss',
		uri: { fsPath: '.tmp/test.scss' },
		lineCount: text.split('\n').length,
		lineAt: line => ({
			lineNumber: line,
			text: text.split('\n')[line]
		}),
		getText: () => text
	}
}

class Position {
	constructor(
		public line: number,
		public character: string
	) {}
}

class Range {
	constructor(
		public start: Position,
		public end: Position
	) {}
}

const sorting = proxyquire('./index', {
	vscode: {
		Position,
		Range,
		workspace: { rootPath: '.tmp' },
		'@noCallThru': true
	}
})

describe('PostCSS Sorting API', () => {
	it('should work without configuration', async () => {
		const document = mockupDocument()
		const settings: ISettings = {}

		const actual = await sorting.use(settings, document, null)

		assert.equal(actual.css, textExpected)
	})

	// it('should work with postcss-sorting config as js file', async () => {
	// 	const document = mockupDocument()
	// 	const settings: ISettings = {
	// 		config: {
	// 			order: ['custom-properties', 'dollar-variables', 'declarations', 'at-rules', 'rules']
	// 		}
	// 	}

	// 	const expected = textExpected
	// 	const actual = await sorting.use(settings, document, null)

	// 	assert.equal(actual.css, expected)
	// })
})
