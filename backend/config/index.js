import dotenv from 'dotenv';

dotenv.config();

export const env = {
    token: process.env.TOKEN,
    tmdb_api_key: process.env.TMDB_API_KEY,
}