import { render } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import userEvent from "@testing-library/user-event";

function MyComponent() {
	return (
		<div>
			<button type="button" aria-label="mycomponent-button">
				Click Here!
			</button>
		</div>
	);
}

describe("test", () => {
	test.concurrent("Check Button Label test", () => {
		const container = document.createElement("div");
		const dom = render(<MyComponent />, { container: container });
		const mycomponentButton = dom.getByLabelText("mycomponent-button");
		expect(mycomponentButton.textContent).toMatch("Click Here!");
	});

	test.concurrent("Click", async () => {
		const container = document.createElement("div");
		const user = userEvent.setup();
		const dom = render(<MyComponent />, { container: container });
		const mycomponentButton = dom.getByLabelText("mycomponent-button");
		await user.click(mycomponentButton);
		expect(mycomponentButton.textContent).toMatch("Click Here!");
	});
});
