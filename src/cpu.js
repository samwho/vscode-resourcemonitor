document.getElementById("cpu").innerHTML = "HELLO";

// (function () {
//     const vscode = acquireVsCodeApi();
//     window.addEventListener('message', event => {
//         const message = event.data;
//
//         switch (message.type) {
//             case 'load':
//                 {
//                     const load = message.load;
//                     document.getElementById("cpu").innerHTML = `<b>${load.currentLoad}</b>`;
//                     break;
//                 }
//         }
//
//         vscode.postMessage({
//             type: "ack",
//             payload: message,
//         });
//     });
// }());
//
