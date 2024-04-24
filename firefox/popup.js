document.addEventListener('DOMContentLoaded', function() {

    function toLocalISOString(date) {
        var localOffset = date.getTimezoneOffset() * 60000; // offset in milliseconds
        var localTime = new Date(date.getTime() - localOffset);
        return localTime.toISOString().split('T')[0];
    }
    

    const picker = new Pikaday({
        field: document.getElementById('datePicker'),
        onSelect: function(date) {
            const selectedDate = toLocalISOString(date);
            loadJourney(selectedDate);
        }
    });

    // Load journey data for the selected date
    function loadJourney(date) {
        const key = `journey_${date}`;
        browser.storage.local.get([key], function(result) {
            displayJourney(result[key], date);
        });
    }
    function displayJourney(articlesTree, date) {
        const graphContainer = document.getElementById("graph");
        graphContainer.innerHTML = ''; // Clear existing content

        const modifiedArticlesTree = {
            title: date,
            children: articlesTree
        };

        const root = d3.hierarchy(modifiedArticlesTree, d => d.children ? Object.values(d.children) : []);

        const dx = 64;
        const dy = 192;
        const leftTextOffset = 128; // Estimated offset to accommodate leftmost text
        const width = (root.height + 1) * dy + leftTextOffset;
        const tree = d3.tree().nodeSize([dx, dy]);

        root.sort((a, b) => d3.ascending(a.data.title, b.data.title));
        tree(root);

        let x0 = Infinity;
        let x1 = -x0;
        root.each(d => {
            if (d.x > x1) x1 = d.x;
            if (d.x < x0) x0 = d.x;
        });

        const height = x1 - x0 + dx * 2;

        // Since you're in a browser extension popup, use d3.select instead of d3.create
        const svg = d3.select("#graph").append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [-leftTextOffset, x0 - dx, width + leftTextOffset, height]) // Adjust viewBox by leftTextOffset
            .style("font", "18px sans-serif");

        const link = svg.append("g")
            .attr("fill", "none")
            .attr("stroke", "#555")
            .attr("stroke-opacity", 0.4)
            .attr("stroke-width", 1.5)
            .selectAll("path")
            .data(root.links())
            .join("path")
            .attr("d", d3.linkHorizontal()
                .x(d => d.y)
                .y(d => d.x));

        const node = svg.append("g")
            .attr("stroke-linejoin", "round")
            .attr("stroke-width", 3)
            .selectAll("g")
            .data(root.descendants())
            .join("g")
            .attr("transform", d => `translate(${d.y},${d.x})`);

        node.append("circle")
            .attr("fill", d => d.children ? "#555" : "#999")
            .attr("r", 2.5);

        node.append("text")
            .attr("dy", "0.31em")
            .attr("x", d => d.children ? -6 : 6)
            .attr("text-anchor", d => d.children ? "end" : "start")
            .text(d => d.data.title)
            .attr("fill", "black") // Set the text color
            .clone(true).lower()
            .attr("stroke", "white"); // Remove the stroke or set to a contrasting color if needed
          

        // Add this SVG to your popup
        document.querySelector("#graph").appendChild(svg.node());
}
const today = new Date();
document.getElementById('datePicker').value = toLocalISOString(today); // Set date picker value to today
loadJourney(toLocalISOString(today));
});
