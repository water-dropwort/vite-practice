import { describe, test, expect, beforeAll, afterAll, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PokemonSearch } from "./PokemonSearch";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { SWRConfig } from "swr";

const EXIST_POKEMON = "pikachu";
const EXIST_POKEMON_FRONT_SHINY = "pikachu_front_shiny";
const pikachu = {
	sprites: {
		front_shiny: EXIST_POKEMON_FRONT_SHINY,
	},
};

const restHandler = [
	http.get(`https://pokeapi.co/api/v2/pokemon/${EXIST_POKEMON}`, () => {
		return HttpResponse.json(pikachu);
	}),
];

const server = setupServer(...restHandler);

const renderWithNoCache = (ui: React.ReactNode) => {
	render(<SWRConfig value={{ provider: () => new Map() }}>{ui}</SWRConfig>);
};

describe("mswを使ったPokemonSearchコンポーネントのテスト", () => {
	beforeAll(() => {
		server.listen({ onUnhandledRequest: "error" });
	});

	afterAll(() => {
		server.close();
	});

	afterEach(() => {
		server.resetHandlers();
	});

	describe("存在するポケモンの名前で検索したとき、", () => {
		let pokemonImg: HTMLElement;

		beforeAll(async () => {
			// Arrange
			const user = userEvent.setup();
			renderWithNoCache(<PokemonSearch />);
			// Act
			await user.type(
				screen.getByLabelText("pokemon-search-input"),
				EXIST_POKEMON,
			);
			await user.click(screen.getByLabelText("pokemon-search-button"));
			// Pre-Assert
			pokemonImg = await screen.findByLabelText("pokemon-image");
		});
		test("画像(imgタグ)が表示される。", () => {
			// Assert
			expect(pokemonImg).toBeVisible();
		});

		test("imgタグのsrcにfront_shinyのURLがセットされている", () => {
			// Assert
			expect(pokemonImg).toHaveAttribute("src", EXIST_POKEMON_FRONT_SHINY);
		});

		test("imgタグのaltに検索ボックスに入力したポケモンの名前が設定される", () => {
			// Assert
			expect(pokemonImg).toHaveAttribute("alt", EXIST_POKEMON);
		});
	});
});
