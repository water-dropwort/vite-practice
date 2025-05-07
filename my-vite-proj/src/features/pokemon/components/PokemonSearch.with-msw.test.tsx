import {
	describe,
	test,
	expect,
	beforeAll,
	beforeEach,
	afterAll,
	afterEach,
} from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PokemonSearch } from "./PokemonSearch";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { SWRConfig } from "swr";
import { buildURL } from "../api/get-pokemonImage";

const server = setupServer();

const renderWithNoCache = (ui: React.ReactNode) => {
	render(<SWRConfig value={{ provider: () => new Map() }}>{ui}</SWRConfig>);
};

beforeAll(() => {
	server.listen({ onUnhandledRequest: "error" });
});

afterAll(() => {
	server.close();
});

describe("存在するポケモンの名前で検索したとき、", () => {
	const POKEMON = "pikachu";
	const POKEMON_FRONT_SHINY = "pikachu_front_shiny";
	const pikachu = {
		sprites: {
			front_shiny: POKEMON_FRONT_SHINY,
		},
	};

	beforeEach(async () => {
		server.use(
			http.get(buildURL(POKEMON), () => {
				return HttpResponse.json(pikachu);
			}),
		);
	});

	afterEach(() => {
		server.resetHandlers();
	});

	test("期待通りの属性が設定された画像(imgタグ)が表示される。", async () => {
		// Arrange
		const user = userEvent.setup();
		renderWithNoCache(<PokemonSearch />);
		// Act
		await user.type(screen.getByLabelText("pokemon-search-input"), POKEMON);
		await user.click(screen.getByLabelText("pokemon-search-button"));
		// Assert
		const pokemonImg = await screen.findByLabelText("pokemon-image");
		// 画像が表示されている
		expect(pokemonImg).toBeVisible();
		// src属性にAPIからのレスポンスのfront_shinyの値がセットされている。
		expect(pokemonImg).toHaveAttribute("src", POKEMON_FRONT_SHINY);
		// alt属性に検索ボックスに入力したポケモンの名前がセットされている。
		expect(pokemonImg).toHaveAttribute("alt", POKEMON);
	});
});

describe("存在しないポケモンの名前で検索したとき", () => {
	const POKEMON = "test";

	beforeEach(async () => {
		// MSW setup
		server.use(
			http.get(buildURL(POKEMON), () => {
				return new Response(null, {
					status: 404,
				});
			}),
		);
		// Arrange
		const user = userEvent.setup();
		renderWithNoCache(<PokemonSearch />);
		// Act
		await user.type(screen.getByLabelText("pokemon-search-input"), POKEMON);
		await user.click(screen.getByLabelText("pokemon-search-button"));
	});

	afterEach(() => {
		server.resetHandlers();
	});

	test("imgタグは表示されない", async () => {
		// Assert
		await screen.findByLabelText("pokemon-errormessage"); //レスポンスを受け取ってエラーメッセージが表示されるまで待機
		expect(screen.queryByLabelText("pokemon-image")).not.toBeInTheDocument();
	});

	test("「Failed to get image」のエラーメッセージが表示される", async () => {
		// Assert
		expect(await screen.findByLabelText("pokemon-errormessage")).toBeVisible();
	});
});
