
import * as vscode from 'vscode';
import * as systeminformation from 'systeminformation';

class Graph implements vscode.WebviewViewProvider {
	view?: vscode.WebviewView;
	context: vscode.ExtensionContext;
	output: vscode.OutputChannel;

	constructor(context: vscode.ExtensionContext, output: vscode.OutputChannel) {
		this.output = output;
		this.context = context;
	}

	resolveWebviewView(view: vscode.WebviewView, context: vscode.WebviewViewResolveContext<unknown>, token: vscode.CancellationToken): void | Thenable<void> {
		this.view = view;

		this.view.webview.options = {
			enableScripts: true,
			localResourceRoots: [vscode.Uri.joinPath(this.context.extensionUri, "src")],
		};

		const nonce = getNonce();
		const scriptUri = view.webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, "src", "chart.js"));

		view.webview.html = `
		<!DOCTYPE html>
		<html lang="en">
			<head>
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src ${view.webview.cspSource} https:; script-src 'nonce-${nonce}';">
				<script nonce="${nonce}" src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
			</head>
			<body>
				<div id="chart"></div>
				<script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
		</html>
		`;

		this.view?.webview.onDidReceiveMessage(message => {
			switch (message.type) {
				case "ready":
					this.onWebviewReady();
					break;
			}
		});
	}

	onWebviewReady() {
        throw new Error("not implemented");
	}
}

export class CPUGraph extends Graph {
	interval?: NodeJS.Timeout;

    onWebviewReady() {
		this.view?.webview.postMessage({
			type: "options",
			payload: {
				series: [{ data: [] }],
			},
		});

		this.interval = setInterval(() => {
			systeminformation.currentLoad().then(load => {
				this.view?.webview.postMessage({
					type: "data",
					payload: [{
						data: [[new Date().getTime(), load.currentLoad]],
					}],
				});
			});
		}, 1000);
    }

	onDeactivate() {
		if (this.interval) {
			clearInterval(this.interval);
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
