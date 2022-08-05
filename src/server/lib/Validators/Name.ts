export default function isValidName(value: unknown) {
	const cleanValue = typeof value === 'string' ? value.trim() : '';
	return cleanValue.length >= 2 && cleanValue.length <= 20;
}
