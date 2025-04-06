import userEvent from "@testing-library/user-event";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";

const mockedMouseDown = vi.fn();
const mockedClick = vi.fn();
const mockedMouseUp = vi.fn();
const renderButton = () => {
	render(
		<button
			aria-label="MyButton"
			onClick={mockedClick}
			onMouseDown={mockedMouseDown}
			onMouseUp={mockedMouseUp}
		>
			Button
		</button>,
	);
};

describe("Comparing the behaviour between userEvent and fireEvent", () => {
	beforeEach(() => {
		mockedMouseDown.mockReset();
		mockedMouseUp.mockReset();
		mockedClick.mockReset();
	});

	test("userEvent", async () => {
		const user = userEvent.setup();
		renderButton();
		await user.click(screen.getByLabelText("MyButton"));
		// userEventのclickはmouseDownもmouseUpも発火する。
		expect(mockedMouseDown).toHaveBeenCalled();
		expect(mockedClick).toHaveBeenCalled();
		expect(mockedMouseUp).toHaveBeenCalled();
	});

	test("fireEvent", async () => {
		renderButton();
		fireEvent.click(screen.getByLabelText("MyButton"));
		await waitFor(() => {
			// fireEventのclickはmouseDownとmouseUpを発火しない。
			expect(mockedMouseDown).not.toHaveBeenCalled();
			expect(mockedClick).toHaveBeenCalled();
			expect(mockedMouseUp).not.toHaveBeenCalled();
		});
	});
});
