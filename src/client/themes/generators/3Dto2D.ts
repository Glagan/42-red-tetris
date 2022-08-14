import mergeImages from 'merge-images';
import type Cube from '$client/lib/Cube';

export default function (spriteSize: number, cubes: Cube[]): Promise<string> {
	return new Promise((resolve) => {
		mergeImages(
			cubes.map((cube): mergeImages.ImageSource => {
				return { src: cube.sprites[0], x: cube.x * spriteSize, y: cube.y * spriteSize };
			}),
			{
				width: spriteSize * 10,
				height: spriteSize * 20
			}
		).then((b64) => resolve(b64));
	});
}
