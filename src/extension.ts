"use strict";

import * as path from "path";
import * as vscode from "vscode";
import { TextDocumentContentProvider } from './resultView';
import { Server } from './server';

const previewCommand = "scxml.showPreview";
const previewScheme = "scxml-preview";

function getSchvizPreviewUri(sourceUri: vscode.Uri)
{
    return (new vscode.Uri()).with({
        authority: "preview",
        query: sourceUri.toString(true),
        scheme: previewScheme
    });
}

function getPreviewColumn(editor: vscode.TextEditor)
{
    switch (editor.viewColumn)
    {
        case vscode.ViewColumn.One:
            return vscode.ViewColumn.Two;

        default:
            return vscode.ViewColumn.Three;
    }
}

export function activate(context: vscode.ExtensionContext)
{

    let server;

    const previewContentProvider = new TextDocumentContentProvider();

    context.subscriptions.push(vscode.workspace.registerTextDocumentContentProvider(previewScheme,
        previewContentProvider));

    context.subscriptions.push(vscode.commands.registerCommand(previewCommand, () =>
    {

        server = new Server();
        server.start().then(async port => {
            console.log('server started', port);
            previewContentProvider.ServerPort = port;

            const activeTextEditor = vscode.window.activeTextEditor;

            const sourceDocument = await vscode.workspace.openTextDocument(activeTextEditor .document.uri);
            const sourceText = sourceDocument.getText();
            server.buffer = sourceText;

            return vscode.commands.executeCommand("vscode.previewHtml",
                getSchvizPreviewUri(activeTextEditor.document.uri),
                getPreviewColumn(activeTextEditor),
                `Preview '${path.basename(activeTextEditor.document.uri.fsPath)}'`,
                { allowScripts: true, allowSvgs: true });
        })
    }))

    context.subscriptions.push(vscode.workspace.onDidChangeTextDocument(async (e) => {
        const sourceDocument = await vscode.workspace.openTextDocument(e.document.uri);
        const sourceText = sourceDocument.getText();
        server.sendUpdate(sourceText)
    }))
}
