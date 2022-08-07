export default function isValidQuery(value: unknown) {
	const cleanValue = typeof value === 'string' ? value.trim() : '';
	return cleanValue.length >= 1 && cleanValue.length <= 50;
}
