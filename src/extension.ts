import * as vscode from 'vscode';
import * as systeminformation from 'systeminformation';

var cpuProvider: CPUWebviewProvider | undefined = undefined;

export function activate(context: vscode.ExtensionContext) {
	let output = vscode.window.createOutputChannel("Resource Monitor");
	output.appendLine("I work.");

	cpuProvider = new CPUWebviewProvider(context, output);

	context.subscriptions.push(vscode.window.registerWebviewViewProvider("resourcemonitor.cpu", cpuProvider));
}

export function deactivate() {
	cpuProvider!.onDeactivate();
}

class CPUWebviewProvider implements vscode.WebviewViewProvider {
	view?: vscode.WebviewView;
	context: vscode.ExtensionContext;
	output: vscode.OutputChannel;
	interval?: NodeJS.Timeout;

	constructor(context: vscode.ExtensionContext, output: vscode.OutputChannel) {
		this.output = output;
		this.context = context;
	}

	resolveWebviewView(view: vscode.WebviewView, context: vscode.WebviewViewResolveContext<unknown>, token: vscode.CancellationToken): void | Thenable<void> {
		this.view = view;

		this.view.webview.options = {
			enableScripts: true,
		};

		const nonce = getNonce();
		const scriptUri = view.webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, "media", "cpu.js"));

		view.webview.html = `
		<!DOCTYPE html>
		<html lang="en">
			<head>
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${view.webview.cspSource}; img-src ${view.webview.cspSource} https:; script-src 'nonce-${nonce}';">
			</head>
			<body>
				<b>Hello world</b>
				<div id="cpu"></div>
				<script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
		</html>
		`;

		view.webview.onDidReceiveMessage(message => {
			this.output.appendLine(`extension received message: ${JSON.stringify(message)}`);
		});

		this.interval = setInterval(() => {
			systeminformation.currentLoad().then(load => {
				this.view?.webview.postMessage({
					type: "load",
					payload: load,
				});
			});
		}, 1000);
	}

	onDeactivate() {
		if (this.interval) {
			this.interval = undefined;
		}
	}
}

function getNonce() {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}
