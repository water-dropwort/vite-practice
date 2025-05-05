import axios from "axios";
import useSWR from "swr";

export async function getPokemonImageByName(name: string) {
	const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
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
