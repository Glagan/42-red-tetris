export default function (duration: number): Promise<unknown> {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(true);
		}, duration);
	});
}
