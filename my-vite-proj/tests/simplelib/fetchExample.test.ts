import { beforeAll, afterEach, afterAll, expect, test } from "vitest";
import { fetchExample } from "../../src/simplelib/fetchExample";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";

const mockData = {
	text: "hello, world",
};

const server = setupServer(
	http.get("https://example.com", () => {
		return HttpResponse.json(mockData);
	}),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("example msw test", async () => {
	const res = await fetchExample();
	expect(await res.json()).toEqual({ text: "hello, world" });
});
