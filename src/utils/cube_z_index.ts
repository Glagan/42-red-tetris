export default function calculate_z_index(x: number, y: number, horizontal_alignement: -1 | 0 | 1) {
	return (
		-Math.abs(y - 9) * 20 + // y
		x * horizontal_alignement // x
	);
}