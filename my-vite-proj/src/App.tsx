import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import "@reduxjs/toolkit";
import { Counter } from "./features/counter/Counter";
import { useGetPokemonByNameQuery } from "./services/pokemon";

function App() {
	const [count, setCount] = useState(0);
	const { data, error, isLoading } = useGetPokemonByNameQuery("bulbasaur");

	return (
		<>
			<Counter />
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
