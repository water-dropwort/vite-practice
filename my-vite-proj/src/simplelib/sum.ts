export function sum(a: number, b: number) {
	return a + b;
}

export function sumThree(a: number, b: number, c: number) {
	return sum(a, sum(b, a));
}
