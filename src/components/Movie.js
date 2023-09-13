import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from React Router

const Movie = ({ movie, selectMovie }) => {
    const IMAGE_PATH = "https://image.tmdb.org/t/p/w500";

    return (
        <Link to={`/movies/${movie.id}`} className={"movie"}> {/* Link to movie details page */}
            <div onClick={() => selectMovie(movie)} className={"movie"}>
                <div className="movie-title">
                    {movie.poster_path &&
                        <img src={IMAGE_PATH + movie.poster_path} alt={movie.title} />
                    }
                    <div className={"flex between movie-infos"}>
                        <h5 className={"movie-title"}>{movie.title}</h5>
                        {movie.vote_average ? <span className={"movie-voting"}>{movie.vote_average}</span> : null}
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default Movie;