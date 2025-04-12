import { describe, test, expect, beforeEach, vi } from "vitest";
import { getPokemonImageByName, usePokemonImage } from "./get-pokemonImage";
import { renderHook, waitFor } from "@testing-library/react";

const { mockedGet } = vi.hoisted(() => {
	return {
		mockedGet: vi.fn(),
	};
});

vi.mock("axios", async () => {
	const mod = await vi.importActual<typeof import("axios")>("axios");
	return {
		...mod,
		default: {
			...mod.default,
			get: mockedGet,
		},
	};
});

describe("get-pokemonImage", () => {
	beforeEach(() => {
		mockedGet.mockReset();
	});

	describe("getPokemonImageByName", () => {
		test("name引数をURLに組み込んでaxios.getを呼び出す", async () => {
			mockedGet.mockReturnValue({
				data: {
					sprites: {
						front_shiny: "",
					},
				},
			});

			await getPokemonImageByName("test");
			expect(mockedGet).toBeCalledWith(
				"https://pokeapi.co/api/v2/pokemon/test",
			);
		});

		test("getPokemonImageByNameはaxios.getで受け撮ったデータのdata.spirites.front_shinyの値を返す", async () => {
			mockedGet.mockReturnValue({
				data: {
					sprites: {
						front_shiny: "TESTRESULT",
					},
				},
			});

			const result = await getPokemonImageByName("test");
			expect(result).toEqual("TESTRESULT");
		});
	});

	describe("usePokemonImage", () => {
		test("nameが空文字のとき、(undefined, false, false)が返される", () => {
			mockedGet.mockReturnValue({
				data: {
					sprites: {
						front_shiny: "test",
					},
				},
			});

			const { result } = renderHook(() => usePokemonImage(""));

			expect(result.current.imgSrc).toEqual(undefined);
			expect(result.current.isLoading).toBe(false);
			expect(result.current.isError).toBe(false);
		});

		test("API通信中はisLoadingがTrueになる。", async () => {
			mockedGet.mockReturnValue({
				data: {
					sprites: {
						front_shiny: "test",
					},
				},
			});

			const { result } = renderHook(() => usePokemonImage("pikachu"));

			expect(result.current.imgSrc).toEqual(undefined);
			expect(result.current.isLoading).toBe(true);
			expect(result.current.isError).toBe(false);
			await waitFor(() => {});
		});

		test("API通信が正常に成功すると、imgSrcにfront_shinyの値がセットされる", async () => {
			mockedGet.mockReturnValue({
				data: {
					sprites: {
						front_shiny: "TESTRESULT",
					},
				},
			});

			const { result } = renderHook(() => usePokemonImage("ditto"));

			await waitFor(() => {
				expect(result.current.imgSrc).toMatch("TESTRESULT");
				expect(result.current.isLoading).toBe(false);
				expect(result.current.isError).toBe(false);
			});
		});

		test("API通信に失敗すると、isErrorがTrueになる", async () => {
			mockedGet.mockRejectedValue(new Error());
			const { result } = renderHook(() => usePokemonImage("bulbasaur"));

			await waitFor(() => {
				expect(result.current.imgSrc).toEqual(undefined);
				expect(result.current.isLoading).toBe(false);
				expect(result.current.isError).toBe(true);
			});
		});
	});
});
