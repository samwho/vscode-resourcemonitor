import * as vscode from 'vscode';
import * as systeminformation from 'systeminformation';

import * as webview from './webview';

var cpu: webview.CPUGraph | undefined = undefined;

export function activate(context: vscode.ExtensionContext) {
	let output = vscode.window.createOutputChannel("Resource Monitor");

	cpu = new webview.CPUGraph(context, output);
	context.subscriptions.push(vscode.window.registerWebviewViewProvider("resourcemonitor.cpu", cpu));
}

export function deactivate() {
	if (cpu) {
		cpu.onDeactivate();
	}
}
