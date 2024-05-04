import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    data: null,
    loading: null,
    error: false,
}

export const Movies = createSlice({
    name: "Movies",
    initialState,
    /*
        C'est ici que les reducers sont définis. Les reducers sont des fonctions qui décrivent comment l'état de l'application change en réponse à des actions (envoyées au store).
    */
    reducers : {
        FETCH_START: (draft) => {
            draft.loading = true;
        },
        FETCH_SUCCESS: (draft, action) => {
            draft.loading = false;
            draft.data = action.payload;
        },
        FETCH_SUCCESS_TITLE: (draft, action) => {
            draft.loading = false;
            draft.data = action.payload.sort((a, b) => {
                const titreA = a.titre.toUpperCase();
                const titreB = b.titre.toUpperCase();
                if (titreA < titreB) {
                  return -1;
                }
                if (titreA > titreB) {
                  return 1;
                }
            });
        },
        FETCH_SUCCESS_DATE: (draft, action) => {
            draft.loading = false;
            draft.data = action.payload.sort((a, b) => {
                const anneeA = a.annee
                const anneeB = b.annee
                if (anneeA < anneeB) {
                  return -1;
                }
                if (anneeA > anneeB) {
                  return 1;
                }
            });
        },
        FETCH_SUCCESS_HOMME: (draft, action) => {
            draft.loading = false;
            draft.data = action.payload.filter((element) => element.category === 'h');
        },
        FETCH_SUCCESS_FEMME: (draft, action) => {
            draft.loading = false;
            draft.data = action.payload.filter((element) => element.category === 'f');
        },
        FETCH_SUCCESS_DETAILS: (draft, action) => {
            draft.loading = false;
            let id = action.payload[1];
            draft.data = action.payload[0][id];
        },
        FETCH_FAILURE: (draft) => {
            draft.loading = false;
            draft.error = true;
        }
    }

})

export const { FETCH_START, FETCH_SUCCESS, FETCH_SUCCESS_TITLE, FETCH_SUCCESS_DATE, FETCH_FAILURE, FETCH_SUCCESS_DETAILS } = Movies.actions;

export default Movies.reducer;
