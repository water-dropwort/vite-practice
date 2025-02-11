import { useState } from "react";
import "./App.css";
import "@reduxjs/toolkit";
import { Counter } from "./features/counter/Counter";
import { useLazyGetPokemonByNameQuery } from "./services/pokemon";

function App() {
	const [pokemonName, setPokemonName] = useState("");
	const [trigger, { data, error, isLoading }] = useLazyGetPokemonByNameQuery();

	return (
		<>
			<Counter />
			<input type="text" onChange={(e) => setPokemonName(e.target.value)} />
			<button
				type="button"
				onClick={() => {
					if (pokemonName.trim()) {
						trigger(pokemonName);
					}
				}}
			>
				Search Pokemon
			</button>
			{error ? (
				<>Oh no, there was an error</>
			) : isLoading ? (
				<>Loading ...</>
			) : data ? (
				<>
					<h3>{data.species.name}</h3>
					<img src={data.sprites.front_shiny} alt={data.species.name} />
				</>
			) : null}
		</>
	);
}

export default App;
