import mergeImages from 'merge-images';
import type Cube from '$client/lib/Cube';

export default function (sprite_size: number, cubes: Cube[]): Promise<string> {
	return new Promise((resolve) => {
		mergeImages(
			cubes.map((cube): mergeImages.ImageSource => {
				return { src: cube.sprites[0], x: cube.x * sprite_size, y: cube.y * sprite_size };
			}),
			{
				width: sprite_size * 10,
				height: sprite_size * 20
			}
		).then((b64) => resolve(b64));
	});
}
