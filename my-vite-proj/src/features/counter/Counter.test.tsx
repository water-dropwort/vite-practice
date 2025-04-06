import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../../../src/features/counter/counterSlice";
import { Counter } from "../../../src/features/counter/Counter";

const renderCounter = () => {
	const store = configureStore({ reducer: { counter: counterReducer } });
	render(
		<Provider store={store}>
			<Counter />
		</Provider>,
	);
};

describe("Counter component", () => {
	test("should render with initial state", () => {
		renderCounter();
		expect(screen.getByLabelText("Current count")).toHaveTextContent("0");
	});

	test("should increment count when increment button is clicked", async () => {
		const user = userEvent.setup();
		renderCounter();
		await user.click(screen.getByLabelText("Increment value"));
		expect(screen.getByLabelText("Current count")).toHaveTextContent("1");
	});

	test("should decrement count when decrement button is clicked", async () => {
		const user = userEvent.setup();
		renderCounter();
		await user.click(screen.getByLabelText("Decrement value"));
		expect(screen.getByLabelText("Current count")).toHaveTextContent("-1");
	});
});
