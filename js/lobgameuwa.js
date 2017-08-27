(function($) {
    var myfile = document.getElementById("myfile");
    function readFile() {
        var reader = new FileReader();
        reader.onload = function () {
            data = reader.result;
            lines = data.split('\n');
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
            cumWeightedPrice += data[i].Volume * data[i].Last;
            volume += data[i].Volume;
        }
        return cumWeightedPrice/volume;
    }
    myfile.addEventListener('change', readFile);
})(jQuery);
