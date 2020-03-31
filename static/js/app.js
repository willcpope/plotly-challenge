// Allow selection of new sample from data
function optionChanged(newSample) {
    barChart(newSample)
    bubbleChart(newSample);
    metadata(newSample);
}

// Extract data based on selection
function metadata(sample) {
    var panel = d3.select('#sample-metadata');

    panel.html('');
    d3.json("././data/samples.json").then(data => {
        var metadata = data.metadata.filter(obj => obj.id == sample)[0];
        Object.entries(metadata).forEach(([key, value]) => {
            panel
                .append('h6')
                .text(`${key.toUpperCase()}: ${value}`)
        })
    })
}

// Create bubble chart
function bubbleChart(sample) {
    d3.json("././data/samples.json").then(data => {
        var samples = data.samples.filter(obj => obj.id == sample)[0];

        var bubbleLayout = {
            margin: { t: 0 },
            hovermode: 'closest',
            xaxis: { title: 'OTU ID' },
            margin: { t: 30 }
        };

        var bubbleData = [
            {
                x: samples.otu_ids,
                y: samples.sample_values,
                test: samples.otu_labels,
                mode: 'markers',
                marker: {
                    size: samples.sample_values,
                    color: samples.otu_ids,
                    colorscale: 'Earth'
                }
            }
        ];

        Plotly.newPlot('bubble', bubbleData, bubbleLayout)
    })
}

// Create bar chart
function barChart(sample) {
    d3.json("././data/samples.json").then(data => {
        var samples = data.samples.filter(obj => obj.id == sample)[0];
        var yticks = samples.otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();

        var barData = [
            {
                y: yticks,
                x: samples.sample_values.slice(0, 10).reverse(),
                text: samples.otu_labels.slice(0, 10).reverse(),
                type: 'bar',
                orientation: 'h'
            }
        ];

        var barLayout = {
            margin: { t: 30, l: 150 }
        };

        Plotly.newPlot('bar', barData, barLayout);
    });
};

// Populate dropdown with data
function fillDropDown() {
    var selector = d3.select('select');
    d3.json("././data/samples.json").then(data => {
        data.names.forEach(name => {
            selector
                .append('option')
                .text(name)
                .property('value', name)
        });
        metadata(data.names[0]);
        bubbleChart(data.names[0]);
        barChart(data.names[0]);
    })
}

fillDropDown()
