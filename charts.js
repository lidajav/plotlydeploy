function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var sampleArray = data.samples;
    //console.log("Sample array: "+sampleArray);
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var filterdSample = sampleArray.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    //console.log 
    //var firstSample = sampleArray[0];
    var firstSample = filterdSample[0];
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_idsArray = firstSample.otu_ids.slice(0,10);
    var otu_labelsArray = firstSample.otu_labels.slice(0,10).reverse();
    var sample_valuesArray = firstSample.sample_values.slice(0,10).reverse();
    
    
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    otu_idsArray = otu_idsArray.map(x => "OTU " + x.toString());
    var yticks = otu_idsArray.reverse();

    // 8. Create the trace for the bar chart. 
    var barData = {
      x: sample_valuesArray,
      y: yticks,//otu_idsArray,
      text : otu_labelsArray,
      name: "Chart",
      type: "bar",
      orientation: "h"
    };
    var barData = [barData];  
    

    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title : " Top 10 Bacteria Cultures Found",
      hoverdistance : 1,
      hovermode : 'closest'
    };
    
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);
   
    // 1. Create the trace for the bubble chart.
    var xArray = firstSample.otu_ids;
    var yArray = firstSample.sample_values;
    var lableArray = firstSample.otu_labels;
    var sizeBubbles = yArray.map (x => x*1);
    
    
    //var bubbleColor = 
    var bubbleData = [{
      x: xArray,
      y: yArray,
      text : lableArray,
      mode : 'markers',
      marker :{
        size: sizeBubbles,
        autocolorscale: false,
        colorscale : 'Earth',
        color: xArray,
        opacity: 0.6
      },
      name: "Chart",
      type: "scatter",
    }];
   
  

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title : "Bacteria Cultures Per Sample",
      xaxis: {title: "OTU ID"},
      hoverdistance : 1,
      hovermode : 'closest',
      margin : 500
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // Create a variable that holds the samples array. 
    var sampleArray = data.samples; // delete if it exist
    var metaArray = data.metadata; // delete if it exist
    // Create a variable that filters the samples for the object with the desired sample number.
    var filterdSample = sampleArray.filter(sampleObj => sampleObj.id == sample);
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var filterdMeta = metaArray.filter(sampleObj => sampleObj.id == sample);
    
    // Create a variable that holds the first sample in the array.
    var firstSample = filterdSample[0];

    // 2. Create a variable that holds the first sample in the metadata array.
    var firstMeta = filterdMeta[0];

    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_idsArray = firstSample.otu_ids.slice(0,10);
    var otu_labelsArray = firstSample.otu_labels.slice(0,10);
    var sample_valuesArray = firstSample.sample_values.slice(0,10);

    // 3. Create a variable that holds the washing frequency.
    var wasFreq = parseFloat(firstMeta.wfreq);
    //var myString = "Belly Button Washing Frequency\n"+"Scrubs Per week";
    //var str = ['aaa','bbb'];
    // 4. Create the trace for the gauge chart.
    var gaugeData = [
      {
        domain : {x: otu_idsArray , y: sample_valuesArray},
        value : wasFreq,
        title: {text : '<b>Belly Button Washing Frequency</b><br>Scrubs Per week'},
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: { range: [0, 10] },
          bar: { color: "black" },
          bgcolor: "white",
          steps: [
            { range: [0, 2], color: "red" },
            { range: [2, 4], color: "orange" },
            { range: [4, 6], color: "yellow" },
            { range: [6, 8], color: "yellowgreen" },
            { range: [8, 10], color: "green" }]}
        
    }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = {
      
      margin: { t: 2, r: 25, l: 25, b: 2 },
      paper_bgcolor: "white",
      font: { color: "dark grey", family: "Arial" }
    
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);

  });
}  