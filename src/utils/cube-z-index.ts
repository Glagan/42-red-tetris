export default function calculateZIndex(x: number, y: number, horizontalAlignement: -1 | 0 | 1) {
	return (
		-Math.abs(y - 9) * 20 + // y
		(horizontalAlignement === 0 ? (x < 5 ? 5 + x : 5 - x) : x * horizontalAlignement) // x
	);
}
