import Eris from "eris";

export function trimCommand(msg: Eris.Message | string): string {
	const m = msg instanceof Eris.Message ? msg.content : msg;
	return m.trim().toLowerCase().split(/ +/).join(" ");
}

export function trimArgs(msg: Eris.Message | string): string {
	const m = msg instanceof Eris.Message ? msg.content : msg;
	return m.trim().split(/ +/).slice(1).join(" ");
}
