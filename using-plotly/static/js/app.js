function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  var url = `/metadata/${sample}`;
  
  d3.json(url).then(function(response) {
    var sample_list = d3.select("#sample-metadata").html("");
    Object.entries(response).forEach(function ([key, value]) {
      console.log(`${key}: ${value}`);
      var row = sample_list.append("li");
      row.text(`${key}: ${value} \n`);
    });
  });


  // Use d3 to select the panel with id of `#sample-metadata`
  
  // Use `.html("") to clear any existing metadata
  // Use `Object.entries` to add each key and value pair to the panel
    // Log the key and value
  
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var url = `/samples/${sample}`;
  d3.json(url).then(function(response) {
    var return_val = Object.entries(response);
    console.log(return_val);
    // @TODO: Build a Bubble Chart using the sample data
    var sizes = [];
    return_val[2][1].forEach(element =>{
      sizes.push(element*2/3);
    })
    var trace1 = {
      x: return_val[0][1],
      y: return_val[2][1],
      text: return_val[1][1],
      mode: 'markers',
      marker: {color: return_val[0][1], size: sizes} 
    };
  
    var b_data = [trace1];

    var layout = {
      xaxis: { title: "OTU ID"},
    };

    Plotly.newPlot('bubble', b_data, layout);
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each). 


    var p_data = [{
      values: return_val[2][1].slice(0,10),
      labels: return_val[0][1].slice(0,10),
      hovertext: return_val[1][1].slice(0,10),
      type: 'pie'
    }];

    Plotly.newPlot('pie', p_data);

  });
}


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then(sampleNames => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
       /* console.log(sample);*/
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
