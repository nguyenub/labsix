import AreaChart from './AreaChart.js';
import StackedAreaChart from './StackedAreaChart.js';

d3.csv("unemployment.csv", d3.autoType).then(data => {

    var i;
    for (i = 0; i<data.length; i++){
        console.log(i)
        var sum = 0;
        console.log(Object.values(data[i]));
        for (var key in Object.values(data[i])){
            if (Object.values(data[i]).hasOwnProperty(key)) {
                console.log(key,Object.values(data[i])[key]);
            if (Number.isInteger(Object.values(data[i])[key])){
                sum = sum + Object.values(data[i])[key];
                console.log(sum)
            }
                data[i].total = sum;
            }
        }
    }

    // process data and create charts
    const stackedAreaChart = StackedAreaChart(".stackchart");

    stackedAreaChart.update(data);

    const areaChart = AreaChart(".areachart");

    areaChart.update(data);

    areaChart.on("brushed", (range)=>{
        stackedAreaChart.filterByDate(range); // coordinating with stackedAreaChart
    })
});



