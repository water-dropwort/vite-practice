import { useState, useRef } from "react";
import { usePokemonImage } from "../api/get-pokemonImage";

function Initial() {
	return <>NO IMAGE</>;
}

function Loading() {
	return <>Loading...</>;
}

function Success({ imgSrc, alt }: { imgSrc: string; alt: string }) {
	return <img aria-label="pokemon-image" src={imgSrc} alt={alt}></img>;
}

function Error({ errorText }: { errorText: string }) {
	return <span>{errorText}</span>;
}

export function PokemonSearch() {
	const refInputPokemonName = useRef("");
	const [pokemonName, setPokemonName] = useState("");

	const { imgSrc, isLoading, isError } = usePokemonImage(pokemonName);

	const handleSearch = () => {
		setPokemonName(refInputPokemonName.current);
	};

	const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		refInputPokemonName.current = e.target.value;
	};

	return (
		<div>
			<>
				<input
					type="text"
					aria-label="pokemon-search-input"
					onChange={handleInput}
				/>
				<button
					type="button"
					onClick={handleSearch}
					disabled={isLoading}
					aria-label="pokemon-search-button"
				>
					Search
				</button>
			</>
			<div>
				{isLoading ? (
					<Loading />
				) : isError ? (
					<Error errorText="Failed to get image" />
				) : imgSrc ? (
					<Success imgSrc={imgSrc} alt={pokemonName} />
				) : (
					<Initial />
				)}
			</div>
		</div>
	);
}
