import axios from "axios";
import useSWR from "swr";

export function buildURL(name: string) {
	return import.meta.env.VITE_POKEAPI_BASE_URL + `${name}`;
}

export async function getPokemonImageByName(name: string) {
	const res = await axios.get(buildURL(name));
	return res.data.sprites.front_shiny;
}

export function usePokemonImage(name: string) {
	const shouldFetch = name.trim() !== "";
	const { data, error, isLoading } = useSWR(
		shouldFetch ? name : null,
		getPokemonImageByName,
	);

	return {
		imgSrc: data,
		isLoading,
		isError: !!error,
	};
}
