export const movies = (state) => {
    return state.movie.data
}

export const test = (state) => {
    return state.data
}

export const detailMovie = (state) => {
  return state.movie.data[0]
}