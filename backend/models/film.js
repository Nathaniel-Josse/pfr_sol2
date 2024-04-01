import mongoose from 'mongoose';
import mongooseUniqueValidator from 'mongoose-unique-validator';

const filmSchema = new mongoose.Schema({
    id: Number,
    titre: String,
    titre_original: String,
    realisateur: String,
    annee: Number,
    nationalite: String,
    duree: String,
    genre: String,
    synopsis: String,
});

filmSchema.plugin(mongooseUniqueValidator);

export default mongoose.model("film", filmSchema, "films");