import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Pokemon {
	species: {
		name: string;
		url: string;
	};
	sprites: {
		back_default: string;
		back_female: string;
		back_shiny: string;
		back_shiny_female: string;
		front_default: string;
		front_female: string;
		front_shiny: string;
		front_shiny_female: string;
	};
}

export const pokemonApi = createApi({
	reducerPath: "pokemonApi",
	baseQuery: fetchBaseQuery({ baseUrl: "https://pokeapi.co/api/v2/" }),
	endpoints: (builder) => ({
		getPokemonByName: builder.query<Pokemon, string>({
			query: (name) => `pokemon/${name}`,
		}),
	}),
});

export const { useLazyGetPokemonByNameQuery } = pokemonApi;
