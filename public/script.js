
  (function() {

    /**
     * Obtains parameters from the hash of the URL
     * @return Object
     */
    function getHashParams() {
      var hashParams = {};
      var e, r = /([^&;=]+)=?([^&;]*)/g,
          q = window.location.hash.substring(1);
      while ( e = r.exec(q)) {
         hashParams[e[1]] = decodeURIComponent(e[2]);
      }
      return hashParams;
    }
    var params = getHashParams();

    var access_token = params.access_token,
        refresh_token = params.refresh_token,
        error = params.error;

    var currentSong="";
    var currentArtist = "";

    var song=""; var artist = ""; var albumArt = "";

    if (error) {
      alert('There was an error during the authentication');
    } else {
      if (access_token) {

        $('#login').hide();
        $('#container').show();

        function fetchDetails(){
          $.ajax({
              url: 'https://api.spotify.com/v1/me/player/currently-playing',
              headers: {
                'Authorization': 'Bearer ' + access_token
              },
              success: function(response) {
                console.log(response);
                if(response.is_playing && ((currentSong != song || currentArtist != artist)
                  || (currentSong == "" && currentArtist == ""))){
                    
                  song = response.item.name;
                  artist = response.item.artists[0].name;
                  albumArt = response.item.album.images[0].url;

                  $("#song").html(song);
                  $("#artist").html(artist);
                  $("#albumArt").attr("src", albumArt);
                  $('#container').fadeIn();
                }
                else{
                  $('#container').fadeOut();
                }
              }
          });
        }
        fetchDetails();
        setInterval(fetchDetails, 1500);
      } else {
        $('#container').fadeOut();
        // render initial screen
        $('#login').show();
        $('#container').hide();
      }
    }
  })();
