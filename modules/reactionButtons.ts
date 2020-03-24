import { Message, MessageContent, Emoji, PossiblyUncachedMessage } from "eris";
import { canReact } from "./utils";
import { bot } from "./bot";

type ReactionFunc = (msg: Message, userID: string) => Promise<void | MessageContent>;

class ReactionButton {
	public name: string;
	private func: ReactionFunc;
	private hostMsg: Message;
	constructor(msg: Message, emoji: string, fun: ReactionFunc) {
		this.hostMsg = msg;
		this.func = fun;
		this.name = emoji;
	}
	public async execute(userID: string): Promise<void> {
		const result = await this.func(this.hostMsg, userID);
		if (result !== undefined) {
			await this.hostMsg.edit(result);
		}
	}

	get id(): string {
		return this.hostMsg.id;
	}
}

const reactionButtons: {
	[messageID: string]: {
		[emoji: string]: ReactionButton;
	};
} = {};
const reactionTimeouts: {
	[messageID: string]: NodeJS.Timer;
} = {};

export async function removeButtons(msg: Message): Promise<void> {
	if (msg) {
		delete reactionButtons[msg.id];
		delete reactionTimeouts[msg.id];
		if (canReact(msg)) {
			await msg.removeReactions();
		}
	}
}

export async function addReactionButton(
	msg: Message,
	emoji: string,
	func: ReactionFunc,
	permanent = false
): Promise<void> {
	await msg.addReaction(emoji);
	const button = new ReactionButton(msg, emoji, func);
	if (!(msg.id in reactionButtons)) {
		reactionButtons[msg.id] = {};
	}
	reactionButtons[msg.id][emoji] = button;
	if (!(msg.id in reactionTimeouts)) {
		if (!permanent) {
			const time = setTimeout(async () => {
				await removeButtons(msg);
			}, 1000 * 60);
			reactionTimeouts[msg.id] = time;
		}
	}
}

bot.on("messageReactionAdd", async (msg: PossiblyUncachedMessage, emoji: Emoji, userID: string) => {
	if (userID === bot.user.id) {
		return;
	}
	if (reactionButtons[msg.id] && reactionButtons[msg.id][emoji.name]) {
		await reactionButtons[msg.id][emoji.name].execute(userID);
	}
});
