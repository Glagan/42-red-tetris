export default function (factors: Array<number>, power = 50, bonus = 0) {
	let total = 0;

	total += bonus;
	for (let i = 0; i < factors.length; i++) total += Math.pow(power, i) + factors[i];

	return total;
}
