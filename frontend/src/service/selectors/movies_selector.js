export const movies = (state) => {
    return state.movie.data
}

export const detailMovie = (state) => {
  return state.movie.data[0]
}