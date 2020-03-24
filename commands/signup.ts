import Eris, { Message } from "eris";
import { trimArgs } from "../modules/utils";
import { addTournament, removeTournament } from "../modules/tournaments";

export async function signup(msg: Message): Promise<void> {
	const content = trimArgs(msg);
	const tournament = addTournament(content);
	if (!tournament) {
		await msg.channel.createMessage("The channel ID for the sign up channel needs to point to a text channel!");
		return;
	}
}

export async function close(msg: Eris.Message): Promise<void> {
	await removeTournament();
	await msg.channel.createMessage("Tournament closed!");
}
