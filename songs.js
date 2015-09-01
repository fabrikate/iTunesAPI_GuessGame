$(function() {

  var songIds =
  ["995535015", "966411602", "823593456", "956689796", "78964625", "349659857",
  "726378511",  "943946671","982388023", "907242704", "201281527", "656801339",
  "910038357", "250038575", "878000348",  "794095205",  "1645339",  "400835962",
  "325618", "169003415",  "51958108", "76532142", "192688540", "684811768",
  "344799464", "217633921", "192811017", "640047583", "517438248" ];
   // declare globals and hide artwork image and played Songs.
   var songName, artist, album, artwork, playUrl, idNum;
   var guessRight = 0, guessWrong = 0;
   var playedSongs = [];
   $('img').hide();
   $('#playedSongs').hide();

	function loadAjax() {
	  $.ajax({
	   	url: 'https://itunes.apple.com/lookup?id=' + songIds[Math.floor(Math.random() * songIds.length)],
	   	jsonp: 'callback',
	   	dataType: 'jsonp',
	   	success: function(data) {
	   		songName = data.results[0].trackName;
	   		artist = data.results[0].artistName;
	   		album = data.results[0].collectionName;
	   		artwork = data.results[0].artworkUrl100;
	   		playUrl = data.results[0].previewUrl;
	   		idNum = data.results[0].trackId;

	   		$('#audio_preview').attr('src', playUrl);
	   	},
	   	error: function(err) {
	   		console.log('error is ', err);
	   	}
	   })
		$("#audio_preview").on("canplay", function() {
		  $("#audio_preview")[0].play();
		});
	}
	loadAjax();

	// submit event triggers hardGamePlay function
	$('#playerGuessForm').on('submit', function(e) {
		e.preventDefault();
		gamePlay();
		songPlayLog();
		$('input').val('');
	})

	$('#nextBtn').on('click', function(e) {
		playedSongs =[];
		songInfo = [];
		loadAjax();
	})

	function gamePlay() {
		var playerGuess = $('#playerGuess').val();
		var guess = playerGuess.split(' ');

		var songStuff = artist + ' '+ songName + ' ' + album;
		var desired = songStuff.replace(/[^\w\s]/gi, '');
		var songInfo = desired.split(' ');
		var a = false;
		guess.forEach(function(word) {
			if ( songInfo.indexOf(word) !== -1) {
				a = true;
				return;
			}
		})
		if (a) {
			guessRight++;
			$('img').attr('src', artwork);
			$('img').show();
			$('#showMsg').text('You got ' + playerGuess + ' Right!');
			$('#guessRight').text(guessRight);
		} else {
			guessWrong++;
			$('img').attr('src', artwork);
			$('img').show();
			$('#showMsg').text('No, it is "' + songName + '" by ' + artist);
			$('#guessWrong').text(guessWrong);
		}
	}
	function songPlayLog() {
		//get the id of the song playing, and delete it
		var idStr = idNum.toString();
		var deltedNum = songIds.indexOf(idStr);
		console.log(deltedNum);
		if(deltedNum >= 0) {
			songIds.splice(deltedNum, 1);
			playedSongs.push(songName);
		} else {
			console.log('Error');
		}
		// create a list of the song names being played
		var i = 0;
		//get the list tow show
		if (songIds.length <= 1) {
			playedSongs.forEach(function() {
				$('#playedSongs').append('<li>' + playedSongs[i] + '</li>');
				i++;
		})
			$('#finalTally').text('You got ' + guessRight + '/29 correct!');
			$('#playedSongs').fadeIn();

		}
	}
});

