import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PokemonSearch } from "./PokemonSearch";

/*
 * Utility
 */
const renderPokemonSearch = () => {
	render(<PokemonSearch />);
};

/*
 * Mock
 */
const { mockedUsePokemonImage } = vi.hoisted(() => {
	return {
		mockedUsePokemonImage: vi.fn(),
	};
});
vi.mock("../api/get-pokemonImage", () => ({
	usePokemonImage: mockedUsePokemonImage,
}));

/*
 * Testing
 */
describe("PokemonSearch component", () => {
	beforeEach(() => {
		mockedUsePokemonImage.mockClear();
	});

	describe("読み込み中のとき", () => {
		test("「Loading...」の文字が表示される", () => {
			// Arrange
			mockedUsePokemonImage.mockReturnValue({
				imgSrc: undefined,
				isLoading: true,
				isError: false,
			});
			// Act
			renderPokemonSearch();
			// Assert
			expect(screen.getByText("Loading...")).toBeVisible();
		});
	});

	describe("エラーが発生しているとき", () => {
		test("「Failed to get image」が表示される", () => {
			// Arrange
			mockedUsePokemonImage.mockReturnValue({
				imgSrc: undefined,
				isLoading: false,
				isError: true,
			});
			// Act
			renderPokemonSearch();
			// Assert
			expect(screen.getByText("Failed to get image")).toBeVisible();
		});
	});

	describe("画像のURLが存在しないとき、", () => {
		test("「NO IMAGE」の文字が表示されている", () => {
			// Arrange
			mockedUsePokemonImage.mockReturnValue({
				imgSrc: undefined,
				isLoading: false,
				isError: false,
			});
			// Act
			renderPokemonSearch();
			// Assert
			expect(screen.getByText("NO IMAGE")).toBeVisible();
		});
	});

	describe("画像のURLが存在するとき、", () => {
		test("そのURLがsrc属性に設定されたimgタグが表示される", () => {
			// Arrange
			const TESTURL = "TESTURL";
			mockedUsePokemonImage.mockReturnValue({
				imgSrc: TESTURL,
				isLoading: false,
				isError: false,
			});
			// Act
			renderPokemonSearch();
			// Assert
			const pokemonImg = screen.getByLabelText("pokemon-image");
			expect(pokemonImg).toBeVisible();
			expect(pokemonImg).toHaveAttribute("src", TESTURL);
		});
	});

	describe("検索ボックスにポケモンの名前を入力して、Searchボタンをクリックすると", () => {
		test("入力された情報でusePokemonImageが呼び出される", async () => {
			// Arrange
			const TESTINPUTTEXT = "pikachu";
			const user = userEvent.setup();
			renderPokemonSearch();
			mockedUsePokemonImage.mockClear();
			// Act
			await user.type(
				screen.getByLabelText("pokemon-search-input"),
				TESTINPUTTEXT,
			);
			await user.click(screen.getByLabelText("pokemon-search-button"));
			// Assert
			expect(mockedUsePokemonImage).toBeCalledTimes(1);
			expect(mockedUsePokemonImage).toBeCalledWith(TESTINPUTTEXT);
		});

		test("画像を取得できたときは、imgタグのalt属性に検索ボックスに入力されている内容がセットされる", async () => {
			// Arrange
			const TESTINPUTTEXT = "pikachu";
			const user = userEvent.setup();
			mockedUsePokemonImage.mockReturnValue({
				imgSrc: "testimg",
				isLoading: false,
				isError: false,
			});
			renderPokemonSearch();
			// Act
			await user.type(
				screen.getByLabelText("pokemon-search-input"),
				TESTINPUTTEXT,
			);
			await user.click(screen.getByLabelText("pokemon-search-button"));
			// Assert
			expect(screen.getByLabelText("pokemon-image")).toHaveAttribute(
				"alt",
				TESTINPUTTEXT,
			);
		});
	});
});
