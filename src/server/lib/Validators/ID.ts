export default function isValidID(value: unknown) {
	return typeof value === 'string' && value.length === 21;
}
