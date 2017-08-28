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
            var usersScores = calcScores(parsedData, VWAP);
            //console.log(usersScores);
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

    function calcScores(data, VWAP) {
        usersScores = {};
        for (var i = 0; i < data.length; i++) {

            var volume = parseFloat(data.Volume);
            var price = parseFloat(data.Last);

            if (data.Bidder in usersScores) {
                usersScores[data.Bidder] = usersScores[data.Bidder] + volume * (price - VWAP);
            } else {
                usersScores[data.Bidder] = volume * (price - VWAP);
            }

            if (data.Asker in usersScores) {
                usersScores[data.Asker] = usersScores[data.Asker] + volume * (VWAP - price);
            } else {
                usersScores[data.Asker] = volume * (VWAP - price);
            }
            console.log(usersScores);
        }
        return usersScores;
    }
    myfile.addEventListener('change', readFile);
})(jQuery);
