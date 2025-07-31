import React, { useState, useEffect } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';

const SpotifyPlayer = () => {
  const [spotifyApi] = useState(new SpotifyWebApi());
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  const CLIENT_ID = 'your_spotify_client_id'; // Replace with your Spotify app client ID
  const REDIRECT_URI = window.location.origin;
  const SCOPES = [
    'streaming',
    'user-read-email',
    'user-read-private',
    'user-read-playback-state',
    'user-modify-playback-state',
    'playlist-read-private',
    'playlist-read-collaborative'
  ].join(' ');

  useEffect(() => {
    // Check if user is returning from Spotify auth
    const hash = window.location.hash;
    if (hash) {
      const token = hash.substring(1).split('&').find(elem => elem.startsWith('access_token')).split('=')[1];
      if (token) {
        spotifyApi.setAccessToken(token);
        setIsAuthenticated(true);
        window.location.hash = '';
        fetchUserPlaylists();
      }
    }
  }, [spotifyApi]);

  const authenticateSpotify = () => {
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPES)}`;
    window.location.href = authUrl;
  };

  const fetchUserPlaylists = async () => {
    try {
      const response = await spotifyApi.getUserPlaylists();
      setPlaylists(response.items);
    } catch (error) {
      console.error('Error fetching playlists:', error);
    }
  };

  const playPlaylist = async (playlistId) => {
    try {
      await spotifyApi.play({
        context_uri: `spotify:playlist:${playlistId}`
      });
      setSelectedPlaylist(playlistId);
    } catch (error) {
      console.error('Error playing playlist:', error);
    }
  };

  const pausePlayback = async () => {
    try {
      await spotifyApi.pause();
    } catch (error) {
      console.error('Error pausing playback:', error);
    }
  };

  const resumePlayback = async () => {
    try {
      await spotifyApi.play();
    } catch (error) {
      console.error('Error resuming playback:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="spotify-auth">
        <button onClick={authenticateSpotify} className="spotify-auth-btn">
          Connect to Spotify
        </button>
        <p className="spotify-auth-text">Connect your Spotify account to play music</p>
      </div>
    );
  }

  return (
    <div className="spotify-player">
      <div className="spotify-playlists">
        <h4>Your Playlists</h4>
        <select 
          onChange={(e) => playPlaylist(e.target.value)}
          value={selectedPlaylist || ''}
          className="spotify-playlist-select"
        >
          <option value="">Select a playlist</option>
          {playlists.map((playlist) => (
            <option key={playlist.id} value={playlist.id}>
              {playlist.name}
            </option>
          ))}
        </select>
      </div>
      
      <div className="spotify-controls">
        <button onClick={resumePlayback} className="spotify-control-btn">▶️</button>
        <button onClick={pausePlayback} className="spotify-control-btn">⏸️</button>
      </div>
    </div>
  );
};

export default SpotifyPlayer;