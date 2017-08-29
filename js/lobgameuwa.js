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
            sumScores(usersScores);
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
            var transaction = data[i];
            var volume = parseFloat(transaction.Volume);
            var price = parseFloat(transaction.Last);

            if (transaction.Bidder in usersScores) {
                usersScores[transaction.Bidder] = usersScores[transaction.Bidder] + volume * (price - VWAP);
            } else {
                usersScores[transaction.Bidder] = volume * (price - VWAP);
            }

            if (transaction.Asker in usersScores) {
                usersScores[transaction.Asker] = usersScores[transaction.Asker] + volume * (VWAP - price);
            } else {
                usersScores[transaction.Asker] = volume * (VWAP - price);
            }
            console.log(usersScores);
        }
        return usersScores;
    }

    function sumScores(scores) {
        var sum = 0;
        for (var score in scores) {
            sum = sum + scores[score];
        }
        console.log(sum);
        return sum
    }
    myfile.addEventListener('change', readFile);
})(jQuery);
