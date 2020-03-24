import Eris from "eris";
import { trimArgs } from "../modules/utils";
import { defaultRoundTime } from "../config.json";

function formatTime(secs: number): string {
	const minutes = Math.floor(secs / 60);
	const seconds = secs % 60;
	return minutes + ":" + seconds.toString().padStart(2, "0");
}

export async function timer(msg: Eris.Message): Promise<void> {
	const args = trimArgs(msg);
	let time = defaultRoundTime;
	const num = parseInt(args);
	if (!isNaN(num)) {
		time = num;
	}
	let seconds = time * 60;
	const mes = await msg.channel.createMessage("**Time left in the round**: `" + formatTime(seconds) + "`");
	const interval = setInterval(async () => {
		seconds -= 5;
		if (seconds === 10 * 60) {
			await mes.channel.createMessage("10 minutes left in the round!");
		}
		if (seconds === 0) {
			clearInterval(interval);
			await mes.channel.createMessage(
				"That's time in the round! Finish your current phase, then the player with higher LP is the winner. Please report your results to the tournament organiser."
			);
		}
		await mes.edit("**Time left in the round**: `" + formatTime(seconds) + "`");
	}, 5000);
}
