import counterReducer, {
	increment,
	decrement,
	incrementByAmount,
	CounterState,
} from "../../../src/features/counter/counterSlice";
import { describe, test, expect } from "vitest";

describe("counter reducer", () => {
	const initialState: CounterState = { value: 0 };

	test("should handle initial state", () => {
		expect(counterReducer(undefined, { type: "unknown" })).toEqual(
			initialState,
		);
	});

	test("should handle increment", () => {
		const nextState = counterReducer(initialState, increment());
		expect(nextState.value).toBe(1);
	});

	test("should handle decrement", () => {
		const nextState = counterReducer(initialState, decrement());
		expect(nextState.value).toBe(-1);
	});

	test("should handle incrementByAmount", () => {
		const nextState = counterReducer(initialState, incrementByAmount(5));
		expect(nextState.value).toBe(5);
	});
});
