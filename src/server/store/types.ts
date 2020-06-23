
export interface Connection {
	clientId: string,
	roomId: string,
	name: string,
}
export interface Room {
	roomId: string,
	people: string[],
}
