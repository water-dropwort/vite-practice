import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../../../src/features/counter/counterSlice";
import { Counter } from "../../../src/features/counter/Counter";

describe("Counter component", () => {
	test("should render with initial state", () => {
		const store = configureStore({ reducer: { counter: counterReducer } });

		render(
			<Provider store={store}>
				<Counter />
			</Provider>,
		);

		expect(screen.getByText("0")).toBeInTheDocument();
	});
});
