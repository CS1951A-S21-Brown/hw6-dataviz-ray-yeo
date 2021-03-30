// Add your JavaScript code here
const MAX_WIDTH = Math.max(1080, window.innerWidth);
const MAX_HEIGHT = 720;
const margin = {top: 40, right: 100, bottom: 40, left: 175};

let graph_1_width = (MAX_WIDTH / 2) - 100, graph_1_height = 800;
let graph_2_width = (MAX_WIDTH / 2) - 100, graph_2_height = 800;
let graph_3_width = (MAX_WIDTH / 2) - 100, graph_3_height = 800;



//Graph 1: Static Bar Graph showing # of titles per genre
let svg = d3.select("#graph1")
    .append("svg")
    .attr("width", graph_1_width)
    .attr("height", graph_1_height)
    .append("g")
    .attr("transform", `translate(${margin.left + 50}, ${margin.top})`);

// Set up reference to count SVG group
let countRef = svg.append("g");

d3.csv("data/netflix.csv").then(function(data){

    //ideally, cleaned data should hold just the columns and their counts
    data = obtain_genre_counts(data);

    let values_list = Object.values(data);
    let keys_list = Object.keys(data);
    //sort to display genres based on their count
    keys_list = keys_list.sort(function(a,b) {return data[b] - data[a]});
    values_list = values_list.sort(function(a, b) {return b - a});

    //sets up linear scale = boundaries
    let x = d3.scaleLinear()
        .domain([0, d3.max(values_list)])
        .range([0, graph_1_width-margin.left-margin.right]);


    //want all the genres
    let y = d3.scaleBand()
        .domain(keys_list.map(function(d) {return d}))
        .range([0,graph_1_height-margin.top-margin.bottom])
        .padding(0.1);  // Improves readability

    //y-axis label
    svg.append("g")
    .call(d3.axisLeft(y).tickSize(0).tickPadding(10));

    let color = d3.scaleOrdinal()
        .domain(Object.keys(data).map(function(d) {return d}))
        .range(d3.quantize(d3.interpolateHcl("#66a0e2", "#81c2c3"), 30));

    //make bars
    let bars = svg.selectAll("rect").data(keys_list);
    bars.enter()
        .append("rect")
        .merge(bars)
        .attr("fill", function(d) { return color(d) }) 
        .attr("x", x(0))
        .attr("y", function(d) { return y(d);})          //apply styles based on the data point
        .attr("width", function(d) {return x(parseInt(data[d]));})
        .attr("height",  y.bandwidth());        //y.bandwidth() makes a reasonable display height


    // contains the count at the end of the bar
    let counts = countRef.selectAll("text").data(keys_list);

    counts.enter()
    .append("text")
    .merge(counts)
    .attr("x", function(d) { return x(parseInt(data[d])) + 10;})       //Add a small offset to the right edge of the bar
    .attr("y", function(d) { return y(d) + 10})       //Add a small offset to the top edge of the bar,
    .style("text-anchor", "start")
    .text(function(d) {return parseInt(data[d]);});           //Get the count


    //x-axis label
    svg.append("text")
    .attr("transform", `translate(${(graph_1_width - margin.left - margin.right) / 2},
                                ${(graph_1_height - margin.top - margin.bottom) + 15})`)
    .style("text-anchor", "middle")
    .text("Count");

    //y-axis label
    svg.append("text")
    .attr("transform", `translate(-150, ${(graph_1_height - margin.top - margin.bottom) / 2})`)
    .style("text-anchor", "middle")
    .text("Genre");

    //chart title
    svg.append("text")
    .attr("transform", `translate(${(graph_1_width - margin.left - margin.right) / 2}, ${-10})`)
    .style("text-anchor", "middle")
    .style("font-size", 15)
    .text("Number of Titles Per Genre");
    });



//GRAPH 2 (but put into graph3 spot)!!!!!!
let svg2 = d3.select("#graph2")
    .append("svg")
    .attr("width", graph_3_width)
    .attr("height", graph_3_height)
    .append("g")
    .attr("transform", `translate(${margin.left + 50}, ${margin.top})`);

let tooltip = d3.select("#graph2")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// Set up reference to count SVG group
let countRef2 = svg2.append("g");

d3.csv("data/netflix.csv").then(function(data){
    data = obtain_year_counts(data);

    let values_list = Object.values(data);
    let keys_list = Object.keys(data);
    values_list = values_list.sort(function(a, b) {return b - a});
    //sets up linear scale = boundaries
    let x = d3.scaleLinear()
        .domain([0, d3.max(values_list)])
        .range([0, graph_2_width-margin.left-margin.right]);


    //want all the genres
    let y = d3.scaleBand()
        .domain(keys_list.map(function(d) {return d})) //genre field should be single genres after parsing
        .range([0,graph_2_height-margin.top-margin.bottom])
        .padding(0.1);  // Improves readability

    //y-axis label
    svg2.append("g")
    .call(d3.axisLeft(y).tickSize(0).tickPadding(10));

    let color = d3.scaleOrdinal()
        .domain(Object.keys(data).map(function(d) {return d}))
        .range(d3.quantize(d3.interpolateHcl("#64bd6d", "#81c2c3"), 30));

    // Mouseover function to display the tooltip on hover
    let mouseover = function(d) {
        let html = `Exact Average Runtime: ${data[d]}`

        // Show the tooltip and set the position relative to the event X and Y location
        tooltip.html(html)
            .style("left", `${(d3.event.pageX) + 100}px`)
            .style("top", `${(d3.event.pageY) - 30}px`)
            .style("box-shadow", `2px 2px 5px ${color(keys_list[d])}`) 
            .transition()
            .duration(200)
            .style("opacity", 0.9)
    };

    // Mouseout function to hide the tool on exit
    let mouseout = function(d) {
        // Set opacity back to 0 to hide
        tooltip.transition()
            .duration(200)
            .style("opacity", 0);
    };

    //make bars
    let bars = svg2.selectAll("rect").data(keys_list);
    bars.enter()
        .append("rect")
        .merge(bars)
        .attr("fill", function(d) { return color(d) })
        .attr("x", x(0))
        .attr("y", function(d) { return y(d);})          //apply styles based on the data point
        .attr("width", function(d) {return x(parseInt(data[d]));})
        .attr("height",  y.bandwidth())    //y.bandwidth() makes a reasonable display height
        .on("mouseover", mouseover) // for mouse handling
        .on("mouseout", mouseout);


    // contains the count at the end of the bar
    let counts = countRef2.selectAll("text").data(keys_list);

    counts.enter()
    .append("text")
    .merge(counts)
    .attr("x", function(d) { return x(parseInt(data[d])) + 10;})       //Add a small offset to the right edge of the bar
    .attr("y", function(d) { return y(d) + 10})       //Add a small offset to the top edge of the bar
    .style("text-anchor", "start")
    .text(function(d) {return parseInt(data[d]);});           //Get the count


    //x-axis label
    svg2.append("text")
    .attr("transform", `translate(${(graph_2_width - margin.left - margin.right) / 2},
                                ${(graph_2_height - margin.top - margin.bottom) + 15})`)       
    .style("text-anchor", "middle")
    .text("Average runtime");

    //y-axis label
    svg2.append("text")
    .attr("transform", `translate(-150, ${(graph_2_height - margin.top - margin.bottom) / 2})`)       
    .text("Years");

    //chart title
    svg2.append("text")
    .attr("transform", `translate(${(graph_2_width - margin.left - margin.right) / 2}, ${-10})`)       
    .style("text-anchor", "middle")
    .style("font-size", 15)
    .text("Average Movie Runtime Since 1975");
});



 
//Graph 3 !!!!!! put into graph 2 spot
let svg3 = d3.select("#graph3")
    .append("svg")
    .attr("width", graph_2_width)
    .attr("height", graph_2_height)
    .append("g")
    .attr("transform", `translate(${margin.left + 50}, ${margin.top})`);


//sets up linear scale = boundaries
let x = d3.scaleLinear()
    .range([0, graph_2_width-margin.left-margin.right]);

//want all the pairs
let y = d3.scaleBand()
    .range([0,graph_2_height-margin.top-margin.bottom])
    .padding(0.1);  // Improves readability


// Set up reference to count SVG group
let countRef3 = svg3.append("g");
let y_axis_label = svg3.append("g");

//x-axis label
svg3.append("text")
.attr("transform", `translate(${(graph_3_width - margin.left - margin.right) / 2},
                            ${(graph_3_height - margin.top - margin.bottom) + 15})`)       
.style("text-anchor", "middle")
.text("Count");

//y-axis label
svg3.append("text")
.attr("transform", `translate(-150, ${(graph_3_height - margin.top - margin.bottom) / 2})`)    
.style("text-anchor", "middle")
.text("Pair");

//chart title
let title = svg3.append("text")
.attr("transform", `translate(${(graph_3_width - margin.left - margin.right) / 2}, ${-10})`)      
.style("text-anchor", "middle")
.style("font-size", 15)

//SET DATA
setData(10);




function obtain_genre_counts(data) {
    var dict = {}
    for (i=0; i < data.length; i++) {
        unfiltered_genres_list = data[i].listed_in.split(',');
        for (j = 0; j < unfiltered_genres_list.length; j++){
            //clean data using trim
            unfiltered_genres_list[j] = unfiltered_genres_list[j].trim();
            if(unfiltered_genres_list[j] in dict){
                dict[unfiltered_genres_list[j]] +=1;
            }
            else {
                dict[unfiltered_genres_list[j]] = 1;
            }
        }
    }
    return dict;
}


function obtain_year_counts(data){
    var year_to_duration = {}
    var year_to_count = {}
    for (i=0; i < data.length; i++) {
        //only want to look at movies
        if(data[i].type == "Movie"){
            var unfiltered_year = parseInt(data[i].release_year);
            var duration = data[i].duration.trim();
            duration = duration.match(/\d/g);
            duration = duration.join("");
            duration = Number(duration);
            //only continue if the release year is greater than or equal to 1975
            if (unfiltered_year < 1975){
                continue;
            }
            if (unfiltered_year in year_to_duration) {
                year_to_duration[unfiltered_year] += duration;
                year_to_count[unfiltered_year] += 1;
            }
            else{
                year_to_duration[unfiltered_year] = duration;
                year_to_count[unfiltered_year] = 1;
            }
        }
    }

    var year_to_avg_duration = {}
    var years = Object.keys(year_to_duration);
    for (i=0; i < years.length; i++){
        current_year = years[i]
        current_year_total_duration = year_to_duration[current_year];
        current_year_total_count = year_to_count[current_year];
        year_to_avg_duration[current_year] = current_year_total_duration / current_year_total_count;
    }
    return year_to_avg_duration;
}

function obtain_actor_director_pairs(data){
    var dict = {}
    //outer loop goes through all the movies
    for (i=0; i < data.length; i++) {
        let directors_list = data[i].director.split(',');
        let actors_list = data[i].cast.split(',')
        if (directors_list == "" || actors_list == ""){
            continue
        }
        //go through all the directors in the movie
        for (j=0; j < directors_list.length; j++){
            //go through all the actors in the movie
            for(k = 0; k < actors_list.length; k++){
                let director = null;
                let actor = null;
                let combined = null;
                //edge case checking
                if (directors_list[j] != null && actors_list[k] != null){
                    director = directors_list[j].trim();
                    actor = actors_list[k].trim();
                    //represents the cleaned and combined pair
                    combined = [director, actor];
                    if(director == null || director == "" || actor == "" || actor == null || director == ","){
                        continue;
                    }
                    if (combined in dict) {
                        dict[combined] += 1;
                    }
                    else{
                        dict[combined] = 1;
                    }
                }
                else{
                    continue;
                }
            }
        }
    }
    console.log(Object.keys(dict).length);
    return dict;
}


function setData(count){
    d3.csv("data/netflix.csv").then(function(data){
        
        //data keys = director, actor
        // data values = count
        data = obtain_actor_director_pairs(data);
    
        let values_list = Object.values(data);
        let keys_list = Object.keys(data);

        //order the keys list by count
        keys_list = keys_list.sort(function(a,b) {return data[b] - data[a]});

        //we only want the ones from 0 to count
        keys_list = keys_list.splice(0,count);
        console.log(keys_list)
        values_list = values_list.sort(function(a, b) {return b - a});

        x.domain([0, d3.max(keys_list, function(d) { return data[d]; })]) 
        y.domain(keys_list.map(function(d) {return d}))
        y_axis_label.call(d3.axisLeft(y).tickSize(0).tickPadding(10));
    
        let color = d3.scaleOrdinal()
            .domain(Object.keys(data).map(function(d) {return d}))
            .range(d3.quantize(d3.interpolateHcl("#ed7358", "#ffcb69"), 30));
    
        //make bars
        let bars = svg3.selectAll("rect").data(keys_list);
        bars.enter()
            .append("rect")
            .merge(bars)
            .transition()
            .duration(1000)
            .attr("fill", function(d) { return color(d) })
            .attr("x", x(0))
            .attr("y", function(d) { return y(d);})          //apply styles based on the data point
            .attr("width", function(d) {return x(parseInt(data[d]));})
            .attr("height",  y.bandwidth());        //y.bandwidth() makes a reasonable display height
    
    
        // contains the count at the end of the bar
        let counts = countRef3.selectAll("text").data(keys_list);
    
        counts.enter()
        .append("text")
        .merge(counts)
        .transition()
        .duration(1000)
        .attr("x", function(d) { return x(parseInt(data[d])) + 10;})       //Add a small offset to the right edge of the bar
        .attr("y", function(d) { return y(d) + 10})       // Add a small offset to the top edge of the bar
        .style("text-anchor", "start")
        .text(function(d) {return parseInt(data[d]);});           // Get count


        title.text(`Top ${count} Director-Actor Pairs`);

        bars.exit().remove();
        counts.exit().remove();
        });
}