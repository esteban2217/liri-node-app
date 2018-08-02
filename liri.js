require("dotenv").config();

var keys = require("./key.js");
// console.log(keys);

var Twitter = require("twitter");

var Spotify = require("node-spotify-api");

var request = require("request");

var fs = require("fs");



// Initialize the spotify & twitter API client using our client id and secret
// var spotify = new Spotify(keys.spotify);


// FUNCTIONS
// =====================================

var getArtistNames = function(artist){
    return artist.name;
};

// Function for running a spotify search

var getMeSpotify = function(songName){
    var spotify = new Spotify(keys.spotify);
   
    if(songName === undefined){
        songName = "DARE";
    }
    spotify.search(
        {
            type: "track",
            query: songName
        },
        function(err, data){
            if(err){
                return console.log("error occured: " + err);
                
            }
            // console.log(data);

            var songs = data.tracks.items;

            for (var i = 0; i<songs.length; i++){
                console.log(i);
                console.log("artist(s): " + songs[i].artists.map(getArtistNames));
                console.log("song name: " + songs[i].name);
                console.log("preview song: " + songs[i].preview_url);
                console.log("album: " + songs[i].album.name);
                console.log("-----------------------------------");
            
                fs.appendFile("log.txt", i, function(err){
                    if (err) {
                        console.log(err);
                      } else {
                        console.log("Content Added!");
                      }
                })
                
            }
        }
    );
};

// Function for running a twitter search

var getMyTwitt = function(){
    var client = new Twitter(keys.twitter);
    
    var params = {
        screen_name: "cnn", count: 20
    };

    client.get("statuses/user_timeline", params, function(error, tweets, response) {
        if (!error) {
            // consol.log(tweets);
          for (var i = 0; i < tweets.length; i++) {
            console.log(tweets[i].created_at);
            console.log("");
            console.log(tweets[i].text);
            fs.appendFile("log.txt", i, function(err){
                if (error) {
                    console.log(error);
                  } else {
                    console.log("Content Added!");
                  }
                })
            }
        } else{
            console.log(error);
        }
      });
}

// Function for running a movie search. Using the request module hitting the omdb api

var getMeMovie = function(movieName){
    if(movieName === undefined){
        movieName = "The Matrix";
    }

    var urlHit = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&tomatoes=true&apikey=trilogy";
    // console.log(urlHit);
    request(urlHit, function(err, response, body){
        if (!err && response.statusCode === 200) {
            var jsonData = JSON.parse(body);
               
            console.log("Title: " + jsonData.Title);
            console.log("Year: " + jsonData.Year);
            console.log("Rated: " + jsonData.Rated);
            console.log("IMDB Rating: " + jsonData.imdbRating);
            console.log("Country: " + jsonData.Country);
            console.log("Language: " + jsonData.Language);
            console.log("Plot: " + jsonData.Plot);
            console.log("Actors: " + jsonData.Actors);
            console.log("Rotten Tomatoes Rating: " + jsonData.Ratings[1].Value);
       
            fs.appendFile("log.txt", jsonData, function(err){
                if (err) {
                    console.log(err);
                  } else {
                    console.log("Content Added!");
                  }
            })
        }
    });
};

// Function for running a command based on text file

var doWhatItSays = function() {
    fs.readFile("random.txt", "utf8", function(error, data) {
        console.log(data);
       
        var dataArr = data.split(',')
        for (var i = 0; i < dataArr.length; i++) {
            console.log(dataArr[i]);
          }

    });
}

var pick = function(caseData, functionData) {
    switch (caseData) {
        case 'my-tweets':
            getMyTwitt();
            break;
        case 'spotify-this-song':
            getMeSpotify(functionData);
            break;
        case 'movie-this':
            getMeMovie(functionData);
            break;
        case 'do-what-it-says':
            doWhatItSays();
            break;
        default:
            console.log('LIRI doesn\'t know that');
    }
}

//run this on load of js file
var runThis = function(argOne, argTwo) {
    pick(argOne, argTwo);
};

runThis(process.argv[2], process.argv[3]);
