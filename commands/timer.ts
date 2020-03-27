import { Message, TextChannel } from "eris";
import { trimArgs } from "../modules/utils";
import { defaultRoundTime, participantRole, timerChannel } from "../config.json";
import { bot } from "../modules/bot";

let curTimer: Timer | undefined;

class Timer {
	private time: number;
	private mes: Message | undefined;
	private chan = bot.getChannel(timerChannel);
	private interval: NodeJS.Timeout | undefined;
	constructor(mins: number) {
		this.time = mins * 60;
		this.start();
	}

	private formatTime(): string {
		const minutes = Math.floor(this.time / 60);
		const seconds = this.time % 60;
		return minutes + ":" + seconds.toString().padStart(2, "0");
	}

	private async start(): Promise<void> {
		if (!(this.chan instanceof TextChannel)) {
			await this.finish();
			return;
		}
		this.mes = await this.chan.createMessage("**Time left in the round**: `" + this.formatTime() + "`");
		this.interval = setInterval(() => {
			// arrow function to not rebind "this"
			this.tick();
		}, 5000);
	}

	private async tick(): Promise<void> {
		if (!(this.chan instanceof TextChannel) || !this.mes) {
			await this.finish();
			return;
		}
		this.time -= 5;
		if (this.time === 5 * 60) {
			await this.chan.createMessage("5 minutes left in the round! <@&" + participantRole + ">");
		}
		if (this.time === 0) {
			await this.finish();
		}
		await this.mes.edit("**Time left in the round**: `" + this.formatTime() + "`");
	}

	private async finish(): Promise<void> {
		if (this.chan instanceof TextChannel && this.interval) {
			clearInterval(this.interval);
			await this.chan.createMessage(
				"That's time in the round! Finish your current phase, then the player with higher LP is the winner. Please report your results to the tournament organiser.  <@&" +
					participantRole +
					">"
			);
		}
		curTimer = undefined;
	}

	public async abort(): Promise<void> {
		if (this.interval) {
			clearInterval(this.interval);
		}
		if (this.chan instanceof TextChannel) {
			await this.chan.createMessage("The current round has finished early.");
		}
		curTimer = undefined;
	}
}

export async function timer(msg: Message): Promise<void> {
	if (!curTimer) {
		const args = trimArgs(msg);
		let time = defaultRoundTime;
		const num = parseInt(args);
		if (!isNaN(num)) {
			time = num;
		}
		curTimer = new Timer(time);
	}
}

export async function cancel(): Promise<void> {
	if (curTimer) {
		await curTimer.abort();
	}
}
