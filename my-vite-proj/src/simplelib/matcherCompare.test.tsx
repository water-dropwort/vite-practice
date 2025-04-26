import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";

const renderForm = () => {
	render(
		<>
			<div style={{ visibility: "visible" }}>Visible Item</div>
			<div style={{ visibility: "hidden" }}>Hidden Item</div>
			<div style={{ visibility: "collapse" }}>Collapse Item</div>
		</>,
	);
};

describe("Compare toBeInTheDocument and toBeVisible", () => {
	test("toBeInTheDocument", () => {
		renderForm();
		expect(screen.getByText("Visible Item")).toBeInTheDocument();
		expect(screen.getByText("Hidden Item")).toBeInTheDocument();
		expect(screen.getByText("Collapse Item")).toBeInTheDocument();
	});

	test("toBeVisible", () => {
		renderForm();
		expect(screen.getByText("Visible Item")).toBeVisible();
		expect(screen.getByText("Hidden Item")).not.toBeVisible();
		expect(screen.getByText("Collapse Item")).not.toBeVisible();
	});
});
