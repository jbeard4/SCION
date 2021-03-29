"use strict";

import * as vscode from "vscode";
import { TextDocumentContentProvider } from './resultView';

const previewCommand = "scxml.showPreview";
const previewScheme = "scxml-preview";


export function activate(context: vscode.ExtensionContext) {

    const previewContentProvider = new TextDocumentContentProvider();

    context.subscriptions.push(vscode.workspace.registerTextDocumentContentProvider(previewScheme,
        previewContentProvider));

    context.subscriptions.push(vscode.workspace.onDidChangeTextDocument(async (e) => {
        const sourceDocument = await vscode.workspace.openTextDocument(e.document.uri);
        const sourceText = sourceDocument.getText();
        SCXMLPreviewPanel.currentPanel.sendUpdate(sourceText)
    }))

	context.subscriptions.push(
		vscode.commands.registerCommand(previewCommand, async () => {
            const activeTextEditor = vscode.window.activeTextEditor;

            const sourceDocument = await vscode.workspace.openTextDocument(activeTextEditor.document.uri);
            const sourceText = sourceDocument.getText();

			SCXMLPreviewPanel.createOrShow(context.extensionUri);
            SCXMLPreviewPanel.currentPanel.sendUpdate(sourceText)
		})
	);



	if (vscode.window.registerWebviewPanelSerializer) {
		// Make sure we register a serializer in activation event
		vscode.window.registerWebviewPanelSerializer(SCXMLPreviewPanel.viewType, {
			async deserializeWebviewPanel(webviewPanel: vscode.WebviewPanel, state: any) {
				console.log(`Got state: ${state}`);
				// Reset the webview options so we use latest uri for `localResourceRoots`.
				webviewPanel.webview.options = getWebviewOptions(context.extensionUri);
				SCXMLPreviewPanel.revive(webviewPanel, context.extensionUri);
			}
		});
	}
}

function getWebviewOptions(extensionUri: vscode.Uri): vscode.WebviewOptions {
	return {
		// Enable javascript in the webview
		enableScripts: true,

		// And restrict the webview to only loading content from our extension's `browser` directory.
		localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'browser')]
	};
}

/**
 * Manages scxml preview webview panels
 */
class SCXMLPreviewPanel {
	/**
	 * Track the currently panel. Only allow a single panel to exist at a time.
	 */
	public static currentPanel: SCXMLPreviewPanel | undefined;

	public static readonly viewType = 'scxmlPreview';

	private readonly _panel: vscode.WebviewPanel;
	private readonly _extensionUri: vscode.Uri;
	private _disposables: vscode.Disposable[] = [];

	public static createOrShow(extensionUri: vscode.Uri) {

		if(!vscode.window.activeTextEditor) return;

		// If we already have a panel, show it.
		if (SCXMLPreviewPanel.currentPanel) {
			SCXMLPreviewPanel.currentPanel._panel.reveal();
			return;
		}

		// Otherwise, create a new panel.
		const panel = vscode.window.createWebviewPanel(
			SCXMLPreviewPanel.viewType,
			'SCXML Preview',
			vscode.ViewColumn.Two,
			getWebviewOptions(extensionUri),
		);

		SCXMLPreviewPanel.currentPanel = new SCXMLPreviewPanel(panel, extensionUri);
	}

	public static revive(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
		SCXMLPreviewPanel.currentPanel = new SCXMLPreviewPanel(panel, extensionUri);
	}

	private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
		this._panel = panel;
		this._extensionUri = extensionUri;

		// Set the webview's initial html content
		this._update();

		// Listen for when the panel is disposed
		// This happens when the user closes the panel or when the panel is closed programmatically
		this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

		// Handle messages from the webview
		this._panel.webview.onDidReceiveMessage(
			message => {
				switch (message.command) {
					case 'alert':
						vscode.window.showErrorMessage(message.text);
						return;
				}
			},
			null,
			this._disposables
		);
	}

	public sendUpdate(scxmlContent: string) {
		// Send a message to the webview webview.
		// You can send any JSON serializable data.
		this._panel.webview.postMessage({ command: 'scxml.update', scxmlContent });
	}

	public dispose() {
		SCXMLPreviewPanel.currentPanel = undefined;

		// Clean up our resources
		this._panel.dispose();

		while (this._disposables.length) {
			const x = this._disposables.pop();
			if (x) {
				x.dispose();
			}
		}
	}

	private _update() {
		const webview = this._panel.webview;

		// Vary the webview's content based on where it is located in the editor.
		this._panel.webview.html = this._getHtmlForWebview(webview);
	}

	private _getHtmlForWebview(webview: vscode.Webview) {

        const scriptUris = 
            [
            'polyfill.js',
            'react.js',
            'react-dom.js',
            'scxml.js',
            'schviz.js',
            ].map(file => webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'browser',file)))

		// Uri to load styles into webview

		// Use a nonce to only allow specific scripts to be run
		const nonce = getNonce();

		return `
            <!DOCTYPE html>
            <html>
            <head>
                ${
                    scriptUris.map(uri => `<script nonce="${nonce}" src="${uri}"></script>`).join('\n')
                }
                <style type="text/css">
                body {
                    background : white;
                }
                html, body {
                    margin : 0;
					padding: 0;
                }
				.app {
					position: absolute;
					top: 0;
					left: 0;
					right: 0;
					bottom: 0;
				}
                </style>
            </head>
            <body>
                <div class="app">
                </div>
                <script>
                function render(scxmlString){
                    ReactDOM.render(React.createElement(
                    window.scion.schviz, 
                    {
                        scxmlDocumentString:scxmlString,
                        expandAllStatesByDefault:true
                    }),
                    document.querySelector('.app')
                    );
                }

                window.addEventListener('message', event => {
                    const message = event.data; // The json data that the extension sent
                    switch (message.command) {
                        case 'scxml.update':
                            render(message.scxmlContent);
                            break;
                    }
                });
                </script>
            </body>
            </html>`;
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
