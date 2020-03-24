import { Message, TextChannel } from "eris";
import { trimArgs } from "../modules/utils";
import { defaultRoundTime, participantRole, timerChannel } from "../config.json";
import { bot } from "../modules/bot";

function formatTime(secs: number): string {
	const minutes = Math.floor(secs / 60);
	const seconds = secs % 60;
	return minutes + ":" + seconds.toString().padStart(2, "0");
}

export async function timer(msg: Message): Promise<void> {
	const args = trimArgs(msg);
	let time = defaultRoundTime;
	const num = parseInt(args);
	if (!isNaN(num)) {
		time = num;
	}
	let seconds = time * 60;
	const chan = bot.getChannel(timerChannel);
	if (!(chan instanceof TextChannel)) {
		return;
	}
	const mes = await chan.createMessage("**Time left in the round**: `" + formatTime(seconds) + "`");
	const interval = setInterval(async () => {
		seconds -= 5;
		if (seconds === 5 * 60) {
			await chan.createMessage("5 minutes left in the round! <@&" + participantRole + ">");
		}
		if (seconds === 0) {
			clearInterval(interval);
			await chan.createMessage(
				"That's time in the round! Finish your current phase, then the player with higher LP is the winner. Please report your results to the tournament organiser.  <@&" +
					participantRole +
					">"
			);
		}
		await mes.edit("**Time left in the round**: `" + formatTime(seconds) + "`");
	}, 5000);
}
