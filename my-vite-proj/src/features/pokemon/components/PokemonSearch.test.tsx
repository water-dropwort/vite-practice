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

	test("初期表示時、NO IMAGEの文字が表示されている", () => {
		mockedUsePokemonImage.mockReturnValue({
			imgSrc: undefined,
			isLoading: false,
			isError: false,
		});
		renderPokemonSearch();
		expect(screen.getByText("NO IMAGE")).toBeInTheDocument();
	});

	test("isLoading=Trueのとき、Loading...の文字が表示される", () => {
		mockedUsePokemonImage.mockReturnValue({
			imgSrc: "",
			isLoading: true,
			isError: false,
		});
		renderPokemonSearch();
		expect(screen.getByText("Loading...")).toBeInTheDocument();
	});

	test("imgSrcがセットされているときは、imgタグが表示される", () => {
		mockedUsePokemonImage.mockReturnValue({
			imgSrc: "testurl",
			isLoading: false,
			isError: false,
		});
		renderPokemonSearch();
		expect(screen.getByRole("presentation")).toBeInTheDocument();
	});

	test("isError=Trueのとき、Failed to get imageが表示される", () => {
		mockedUsePokemonImage.mockReturnValue({
			imgSrc: null,
			isLoading: false,
			isError: true,
		});
		renderPokemonSearch();
		expect(screen.getByText("Failed to get image")).toBeInTheDocument();
	});

	test("検索ボックスに文字を入力した時点では、usePokemonImageが実行されない。", async () => {
		mockedUsePokemonImage.mockReturnValue({
			imgSrc: null,
			isLoading: false,
			isError: false,
		});
		const user = userEvent.setup();
		renderPokemonSearch();
		const INPUTTEXT = "pikachu";
		await user.type(screen.getByLabelText("pokemon-search-input"), INPUTTEXT);
		expect(mockedUsePokemonImage).not.toBeCalledWith(INPUTTEXT);
	});

	test("Searchボタンを押下すると、検索ボックスに入力した内容でusePokemonImageが実行される", async () => {
		mockedUsePokemonImage.mockReturnValue({
			imgSrc: null,
			isLoading: false,
			isError: false,
		});

		const user = userEvent.setup();
		renderPokemonSearch();
		const INPUTTEXT = "pikachu";
		await user.type(screen.getByLabelText("pokemon-search-input"), INPUTTEXT);
		await user.click(screen.getByLabelText("pokemon-search-button"));
		expect(mockedUsePokemonImage).toBeCalledWith(INPUTTEXT);
	});
});
