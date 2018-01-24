'use strict';

import * as vscode from 'vscode';
import { Disposable } from 'vscode';

export class TextDocumentContentProvider extends Disposable implements vscode.TextDocumentContentProvider {
    private _onDidChange = new vscode.EventEmitter<vscode.Uri>();
    private lastUri: vscode.Uri;
    private serverPort: number;

    constructor() {
        super(() => { });
    }
    public dispose() {
    }
    public set ServerPort(value: number) {
        this.serverPort = value;
    }
    public provideTextDocumentContent(uri: vscode.Uri): Thenable<string> {
        this.lastUri = uri;
        return this.generateResultsView();
    }

    get onDidChange(): vscode.Event<vscode.Uri> {
        return this._onDidChange.event;
    }

    private generateResultsView(): Promise<string> {

        // Fix for issue #669 "Results Panel not Refreshing Automatically" - always include a unique time
        // so that the content returned is different. Otherwise VSCode will not refresh the document since it
        // thinks that there is nothing to be updated.
        let timeNow = new Date().getTime();
        const htmlContent = `
                    <!DOCTYPE html>
                    <head><style type="text/css"> html, body{ height:100%; width:100%; } </style>
                    <script type="text/javascript">
                        function start(){
                            alert('reloaded results window at time ${timeNow}ms');
                            document.getElementById('myframe').src = 'http://localhost:${this.serverPort}';
                        }
                    </script>
                    </head>
                    <body onload="start()">
                    <iframe id="myframe" frameborder="0" style="border: 0px solid transparent;height:100%;width:100%;" src="" seamless></iframe></body></html>`;
        return new Promise((resolve) => resolve(htmlContent));
    }
}
