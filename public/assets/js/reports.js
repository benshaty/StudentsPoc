// Draw the charts and set the charts values
function drawChart() {
    var dataChartBar = google.visualization.arrayToDataTable(gradesArray);
    var dataChartGuage = google.visualization.arrayToDataTable(gradesGuageArray);


    var optionsBar = {
        legend: 'none',
        titles: 'Avarage Grade By Course',
        width: 550,
        height: 400,
        hAxis: {
            title: 'Grade',
            minValue: 0
        },
        vAxis: {
            title: 'Course'
        }
    };

    var optionsGuage = {
        width: 400,
        height: 220,
        redFrom: 0,
        redTo: 55,
        yellowFrom: 55,
        yellowTo: 90,
        greenFrom: 90,
        greenTo: 100,
        minorTicks: 5
    };

    // Display the chart inside the <div> element with id="barchart"
    var chartBar = new google.visualization.BarChart(document.getElementById('barchart'));
    chartBar.draw(dataChartBar, optionsBar);
    // Display the chart inside the <div> element with id="guagechart"
    var chartGuage = new google.visualization.Gauge(document.getElementById('guagechart'));
    chartGuage.draw(dataChartGuage, optionsGuage);


}

window.onload = () => {
    // Append data to arrays
    for (const key in grades) {
        gradesArray.push([grades[key].name, grades[key].grade,
            `#${Math.floor(Math.random()*16777215).toString(16)}`
        ]);
        gradesGuageArray.push([grades[key].name, grades[key].grade]);
    }
    // Load google charts
    google.charts.load('current', {
        'packages': ['corechart', 'bar', 'gauge']
    });
    // Set google charts onload callback 
    google.charts.setOnLoadCallback(drawChart);

}