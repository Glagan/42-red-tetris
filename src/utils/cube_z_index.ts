export default function calculate_z_index(x: number, y: number, horizontal_alignement: -1 | 0 | 1) {
	return (
		-Math.abs(y - 9) * 20 + // y
		(horizontal_alignement === 0 ? (x < 5 ? 5 + x : 5 - x) : x * horizontal_alignement) // x
	);
}
