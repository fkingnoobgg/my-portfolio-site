(function($) {
    var myfile = document.getElementById("myfile");
    function readFile() {
        var reader = new FileReader();
        reader.onload = function () {
            data = reader.result;
            lines = data.trim().split('\n');
            headers = lines[0].split(',')
            parsedData = [];
            for (var i = 1; i < lines.length; i++) {
                var line = lines[i].split(',');
                var parsedLine = {}
                for (var j = 0; j < line.length; j++) {
                    var header = headers[j]
                    parsedLine[header] = line[j]
                }
                parsedData.push(parsedLine)
            }
            //console.log(parsedData);
            var VWAP = calcVWAP(parsedData);
            console.log(VWAP);
        };
        // start reading the file. When it is done, calls the onload event defined above.
        reader.readAsBinaryString(myfile.files[0]);
    }

    function calcVWAP(data) {
        var volume = 0;
        var cumWeightedPrice = 0;
        for (var i = 0; i < data.length; i++) {
            var volumeTraded = parseFloat(data[i].Volume);
            var price = parseFloat(data[i].Last);
            cumWeightedPrice = cumWeightedPrice + (volumeTraded * price);
            volume = volume + volumeTraded;
        }
        //console.log(parseFloat(data[0].Last));
        return cumWeightedPrice/volume;
    }
    myfile.addEventListener('change', readFile);
})(jQuery);
