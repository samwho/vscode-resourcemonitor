(function () {
    const vscode = acquireVsCodeApi();
    var chart = new ApexCharts(document.querySelector("#chart"), {
        series: [],
        chart: {
            type: 'line',
            animations: {
                enabled: true,
                easing: 'linear',
                speed: 0,
                dynamicAnimation: {
                    enabled: true,
                    speed: 1000,
                }
            },
            toolbar: {
                show: false,
            },
            zoom: {
                enabled: false,
            },
        },
        tooltip: {
            enabled: false,
        },
        grid: {
            show: false,
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            curve: 'smooth',
        },
        markers: {
            size: 0,
        },
        xaxis: {
            type: "datetime",
            range: 10 * 1000,
            labels: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
            axisBorder: {
                show: false,
            }
        },
        yaxis: {
            max: 100,
            min: 0,
            opposite: true,
            tickAmount: 5,
            labels: {
                formatter: value => parseInt(value),
            },
        },
        legend: {
            show: false,
        },
    });
    chart.render();

    window.addEventListener('message', event => {
        const message = event.data;
        switch (message.type) {
            case 'data':
                chart.appendData(message.payload);
                break;
            case 'options':
                chart.updateOptions(message.payload);
                break;
        }
    });

    vscode.postMessage({
        type: "ready",
        payload: undefined,
    });
}());
