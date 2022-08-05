import { nanoid } from 'nanoid';
import Room from './lib/Room';
import RoomManager from './RoomManager';

describe('RoomManager', () => {
	const room = new Room('My room');

	it('Is empty by default', () => {
		expect(RoomManager.all()).toEqual([]);
	});

	it('Can add a room', () => {
		RoomManager.addRoom(room);
		expect(RoomManager.rooms.length).toEqual(1);
		const insertedRoom = RoomManager.rooms[0];
		expect(room.name).toEqual(insertedRoom.name);
	});

	it('Can get a room', () => {
		expect(RoomManager.getRoom(room.id)).toEqual(room);
		expect(RoomManager.getRoom(room)).toEqual(room);
		expect(RoomManager.getRoom(nanoid())).toBe(undefined);
	});

	it('Has updated list of all rooms', () => {
		const rooms = RoomManager.all();
		expect(rooms.length).toEqual(1);
		expect(rooms).toEqual([room.toClient()]);
	});

	it('Can remove a room', () => {
		expect(RoomManager.rooms.length).toEqual(1);
		RoomManager.removeRoom(nanoid());
		expect(RoomManager.rooms.length).toEqual(1);
		RoomManager.removeRoom(room.id);
		expect(RoomManager.rooms.length).toEqual(0);
	});
});
