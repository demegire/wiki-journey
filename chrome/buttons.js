document.getElementById('shareButton').addEventListener('click', function() {
    function drawImageWithText() {
    const svgElement = document.querySelector('svg');
    const {width, height} = svgElement.getBoundingClientRect();

    // Create a canvas element to render the SVG
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // Fill the canvas with a white background
    ctx.fillStyle = 'white'; // Set fill color to white
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill the entire canvas
    ctx.font = '16px "LinBiolinum_aS"';
    

    // Use a Blob to convert SVG to a URL that can be drawn on Canvas
    let data = new XMLSerializer().serializeToString(svgElement);
    // Assume viewBox is like "viewBox = minX minY width height"
    const viewBox = svgElement.getAttribute('viewBox');
    if (viewBox) {
        const viewBoxValues = viewBox.split(',');
        if (viewBoxValues.length === 4) {
            minX = parseFloat(viewBoxValues[0]);
            minY = parseFloat(viewBoxValues[1]);
        }
    }
    
    // Adjust the watermark position based on viewBox
    const watermarkString = `<text x="${minX + 10}" y="${minY + 20}" style="font-family: 'LinBiolinum_aS'; font-size: 36px;" fill="#000" opacity="0.5">Wiki Journey</text>`;
    data = data.replace('</svg>', `${watermarkString}</svg>`);
    const svgBlob = new Blob([data], {type: 'image/svg+xml;charset=utf-8'});
    const url = URL.createObjectURL(svgBlob);

    const image = new Image();
    image.onload = function() {
        // Draw the SVG onto the Canvas
        ctx.drawImage(image, 0, 0);
        URL.revokeObjectURL(url);

        // Convert Canvas to PNG and trigger download
        canvas.toBlob(function(blob) {
            // Create a new URL for the blob
            const blobUrl = URL.createObjectURL(blob);

            // Create a temporary anchor element and trigger the download
            const downloadLink = document.createElement('a');
            downloadLink.href = blobUrl;
            downloadLink.download = 'wikijourney.png'; // Specify the download file name
            document.body.appendChild(downloadLink); // Append to the document
            downloadLink.click(); // Trigger the download

            // Clean up by revoking the blob URL and removing the temporary link
            URL.revokeObjectURL(blobUrl);
            document.body.removeChild(downloadLink);
        }, 'image/png'); // Specify PNG format here
    };
    image.src = url;
    }
    
    if ('fonts' in document) {
        document.fonts.load('16px "LinBiolinum_aS"').then(function () {
          // This ensures the font is available for the canvas
          drawImageWithText();
        });
      } else {
        // Fallback for browsers that do not support Font Loading API
        drawImageWithText();
      }
});
document.getElementById('infoButton').addEventListener('click', function() {
    const url = 'https://demegire.github.io/wikijourney'; // Replace with the URL you want to redirect to
    window.open(url, '_blank'); // Open in a new tab
});

