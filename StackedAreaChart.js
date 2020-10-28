export default function StackedAreaChart(container){

    // INITIALIZATION
    let margin = { top: 40, right: 20, bottom: 40, left: 90 },
    width = 750 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom; 

    var type = ""
    let selected = null, xDomain, data;
    let DATA;

   let svg = d3
       .select(".stackchart")
       .append("svg")
       .attr("width", width + margin.left + margin.right)
       .attr("height", height + margin.top + margin.bottom)
       .append("g")
       .attr("transform", `translate(${margin.left},${margin.top})`);
    
    var clipPath = svg.append("defs")
        .append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)
        .attr("height", height);


    let group = svg.append('g')
    const tooltip = svg
        .append("text")
        .text(type)

    let xScale = d3
       .scaleTime()
       .range([0,width])

    let yScale = d3
       .scaleLinear()
       .range([height,0])

    var xAxis = d3.axisBottom()
       .scale(xScale);

    var yAxis = d3.axisLeft()
       .scale(yScale);

    var xAxisGroup = svg.append("g")
       .attr('class', 'axis x-axis')

    var yAxisGroup = svg.append('g')
       .attr('class', 'axis y-axis');
    
    function updateMain(selected, data, svg){

       var colorScale = d3.scaleOrdinal(d3.schemeTableau10)
           .domain(data.columns.slice(1));

           svg.select('axis y-axis').exit().remove()

        // INITIALIZATION
           let margin = { top: 40, right: 20, bottom: 40, left: 90 },
           width = 750 - margin.left - margin.right,
           height = 400 - margin.top - margin.bottom; 

           var type = ""
           let selection;


       let xScale = d3
           .scaleTime()
           .range([0,width])

       let yScale = d3
           .scaleLinear()
           .range([height,0])

       //=== Create & Initialize Axes ===
       let xAxis = d3.axisBottom()
           .scale(xScale);

       let yAxis = d3.axisLeft()
           .scale(yScale);

       xScale
           .domain(xDomain? xDomain: d3.extent(data, d=>d.date));
       yScale
           .domain([0, d3.max(data, d=>d[selected])]);

           var area3 = d3.area()
           .x(function(d) { return xScale(d.date); })
           .y0(function() { return yScale(0); })
           .y1(function(d) { return yScale(d[selected]); });

           svg.append("path")
           .attr("class", "area3")
           .attr("fill", "PeachPuff")
           .attr("clip-path", "url(#clip)")
           .on("click", (event, d) => {
               svg.selectAll('.area3').remove()
               update(data)
           })

           d3.select(".area3")
           .datum(data)
           .attr("d",area3)

           xAxisGroup
           .call(xAxis)
           // .attr("transform", `translate(0, ${height})`);

           yAxisGroup
           .call(yAxis)
        }

   //====Update function====
   function update(_data){ 
       console.log(_data)
       svg.selectAll('.area3').exit().remove()
       svg.select('axis y-axis').exit().remove()

       if (DATA == null){
           console.log(DATA)
           DATA = _data
       }

       selected = null
       data = _data;

     

       const keys = selected? [selected] : data.columns.slice(1)

       console.log(keys)
   
       var stack = d3.stack()
           .keys(data.columns.slice(1))
           .order(d3.stackOrderNone)
           .offset(d3.stackOffsetNone);
   
       var series = stack(data);

       console.log(series)

       xScale
           .domain(xDomain? xDomain: d3.extent(data, d=>d.date));
       yScale
           .domain([0, d3.max(data, d=>d.total)]);

       var colorScale = d3.scaleOrdinal(d3.schemeTableau10)
           .domain(data.columns.slice(1));

        
       var area2 = d3.area()
           .x(d=>xScale(d.data.date))
           .y0(d=>yScale(d[0]))
           .y1(d=>yScale(d[1]))

           const areas = group.selectAll('.area2')
           .data(series, (d) => d.key);

       svg.select('.x-axis')
           .call(xAxis)
           .attr("transform", `translate(0, ${height})`);
           
       svg.select('.y-axis')
           .call(yAxis)

           areas
           .enter()
            .append('path')
            .attr('class', 'area2')
           .attr("fill", d=>colorScale(d.key))
           .attr("clip-path", "url(#clip)")
           .on("mouseover", (event, d, i) => tooltip.text((d.key).replace(/_/g,' ')))
           .on("mouseout", (event, d, i) => tooltip.text(""))
           .on("click", (event, d) => {
                   console.log("ELSE")
                   selected = d.key;
                   svg.selectAll('path').remove()
                   updateMain(selected, DATA, svg)
                   //update(data); // simply update the chart again
           })
           .merge(areas)
           .attr("d", area2)  


           areas.enter().remove()
       
   }
   function filterByDate(range){
       xDomain = range;  // -- (3)
       if (selected != null){
           updateMain(selected, data, svg)
       }
       if (selected == null) {
           console.log(data)
           update(data); // -- (4)
       }
   }

   return {
       updateMain,
       update,
       filterByDate
   }
   
};