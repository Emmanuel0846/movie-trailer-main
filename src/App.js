import React, { useState } from "react"; 
import './App.css';
import axios from 'axios';
import Movie from "./components/Movie";
import MovieDetails from "./components/MovieDetails"; // Import MovieDetails component
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Youtube from 'react-youtube'; // Import the Youtube component


function App() {
    const MOVIE_API = "https://api.themoviedb.org/3/";
    const SEARCH_API = MOVIE_API + "search/movie";
    const DISCOVER_API = MOVIE_API + "discover/movie";
    const API_KEY = "aa5c677e096736a95b57c8d27c0075e1";
    const BACKDROP_PATH = "https://image.tmdb.org/t/p/w1280";

    const [playing, setPlaying] = useState(false);
    const [trailer, setTrailer] = useState(null);
    const [movies, setMovies] = useState([]);
    const [searchKey, setSearchKey] = useState("");
    const [selectedMovie, setSelectedMovie] = useState(null);



    const fetchMovies = async () => {
        const endpoint = searchKey ? SEARCH_API : DISCOVER_API;
        try {
            const { data } = await axios.get(endpoint, {
                params: {
                    api_key: API_KEY,
                    query: searchKey
                }
            });

            setMovies(data.results);
            setSelectedMovie(data.results.length ? data.results[0] : null);

            if (data.results.length) {
                await fetchMovie(data.results[0].id);
            }
        } catch (error) {
            console.error("Error fetching movies:", error);
        }
    }

    const fetchMovie = async (id) => {
        try {
            const { data } = await axios.get(`${MOVIE_API}movie/${id}`, {
                params: {
                    api_key: API_KEY,
                    append_to_response: "videos"
                }
            });

            if (data.videos && data.videos.results) {
                const trailer = data.videos.results.find(vid => vid.name === "Official Trailer");
                setTrailer(trailer ? trailer : data.videos.results[0]);
            }

            setSelectedMovie(data);
        } catch (error) {
            console.error("Error fetching movie details:", error);
        }
    }

    const selectMovie = (movie) => {
        fetchMovie(movie.id);
        setPlaying(false);
        setSelectedMovie(movie);
        window.scrollTo(0, 0);
    }

    const renderMovies = () => (
        movies.map(movie => (
            <Movie
                selectMovie={selectMovie}
                key={movie.id}
                movie={movie}
            />
        ))
    )

    return (
      <Router>
          <div className="App">
              <header className="center-max-size header">
                  <span className={"brand"}>MovieBox</span>
                  <form className="form" onSubmit={(event) => {
                      event.preventDefault();
                      fetchMovies();
                  }}>
                      <input
                          className="search"
                          type="text"
                          id="search"
                          onInput={(event) => setSearchKey(event.target.value)}
                      />
                      <button className="submit-search" type="submit"><i className="fa fa-search"></i></button>
                  </form>
              </header>
              <main>
                  <Routes>
                      <Route path="/movies/:id" element={<MovieDetails movie={selectedMovie} trailer={trailer} playing={playing} setPlaying={setPlaying} />} />
                      <Route path="/" element={
                          <>
                              {movies.length ?
                                  <>
                                      {selectedMovie ?
                                          <div className="poster" style={{ backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)), url(${BACKDROP_PATH}${selectedMovie.backdrop_path})` }}>
                                              {playing ?
                                                  <>
                                                      <Youtube videoId={trailer.key} className={"youtube amru"} containerClassName={"youtube-container amru"} opts={{ width: '100%', height: '100%', playerVars: { autoplay: 1, controls: 0, cc_load_policy: 0, fs: 0, iv_load_policy: 0, modestbranding: 0, rel: 0, showinfo: 0 } }} />
                                                      <button onClick={() => setPlaying(false)} className={"button close-video"}>Close</button>
                                                  </> :
                                                  <div className="center-max-size">
                                                      <div className="poster-content">
                                                          {trailer ?
                                                              <button className={"button play-video"} onClick={() => setPlaying(true)} type="button">Play Trailer</button>
                                                              : 'Sorry, no trailer available'}
                                                          <h1>{selectedMovie.title}</h1>
                                                          <p>{selectedMovie.overview}</p>
                                                      </div>
                                                  </div>
                                              }
                                          </div>
                                          : null}

                                      <div className={"center-max-size container"}>
                                          {renderMovies()}
                                      </div>
                                  </>
                                  : 'Sorry, no movies found'}
                          </>
                      } />
                  </Routes>
              </main>
          </div>
      </Router>
  );
}

export default App;