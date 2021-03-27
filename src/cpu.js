(function () {
    const vscode = acquireVsCodeApi();
    const cpuData = [];
    var ctx = document.getElementById("cpu");
    var chart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                data: cpuData,
            }],
        },
    });

    window.addEventListener('message', event => {
        const message = event.data;

        switch (message.type) {
            case 'load':
                {
                    cpuData.push(message.payload.currentLoad);
                    if (cpuData.length > 10) {
                        cpuData.shift();
                    }
                    chart.data.datasets[0].data = cpuData;
                    chart.update();
                    console.log(chart);
                    break;
                }
        }

        vscode.postMessage({
            type: "ack",
            payload: message,
        });
    });
}());
