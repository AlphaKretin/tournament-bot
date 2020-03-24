import { Message } from "eris";
import { trimArgs } from "../modules/utils";
import { addTournament } from "../modules/tournaments";

export async function signup(msg: Message): Promise<void> {
	const content = trimArgs(msg);
	const tournament = addTournament(content);
	if (!tournament) {
		await msg.channel.createMessage("The channel ID for the sign up channel needs to point to a text channel!");
		return;
	}
}
