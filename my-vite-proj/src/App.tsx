import "./App.css";
import "@reduxjs/toolkit";
import { Counter } from "./features/counter/Counter";
import { PokemonSearch } from "./features/pokemon/components/PokemonSearch";

function App() {
	return (
		<div>
			<Counter />
			<PokemonSearch />
		</div>
	);
}

export default App;
