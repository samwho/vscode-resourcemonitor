(function () {
    const vscode = acquireVsCodeApi();
    window.addEventListener('message', event => {
        const message = event.data;

        switch (message.type) {
            case 'load':
                {
                    const payload = message.payload;
                    document.getElementById("cpu").innerHTML = `<b>${payload.currentLoad}</b>`;
                    break;
                }
        }

        vscode.postMessage({
            type: "ack",
            payload: message,
        });
    });
}());
