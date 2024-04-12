import { configureStore } from '@reduxjs/toolkit';
import Movie from './movie';

export default configureStore({
    reducer: {
        movie: Movie
    }
});