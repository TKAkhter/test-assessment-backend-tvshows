export const imdbTvShowDataMapper = (object: any) => {
  const mappedObject: any = {
    Title: object.title,
    Year: object._yearData,
    Rated: object.rated,
    Released: object.released,
    Runtime: object.runtime,
    Genre: object.genres,
    Director: object.director,
    Writer: object.writer,
    Actors: object.actors,
    Plot: object.plot,
    Language: object.languages,
    Country: object.country,
    Awards: object.awards,
    Poster: object.poster,
    Ratings: object.ratings,
    Metascore: object.metascore,
    imdbRating: object.rating,
    imdbVotes: object.votes,
    imdbID: object.imdbid,
    Type: object.type,
    imdburl: object.imdburl,
    start_year: object.start_year,
    end_year: object.end_year,
    totalSeasons: object.totalseasons,
    Response: "True",
  };

  for (let key in mappedObject) {
    if (mappedObject[key] === undefined) {
      delete mappedObject[key];
    }
  }

  return mappedObject;
};
