export default function calculateZIndex(x: number, y: number, horizontalAlignement: -1 | 0 | 1) {
	return (
		-Math.abs(y - 9) * 20 + // y
		x * horizontalAlignement // x
	);
}
