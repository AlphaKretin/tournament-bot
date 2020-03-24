import { Message, GuildChannel } from "eris";
import { bot } from "./bot";

export function trimCommand(msg: Message | string): string {
	const m = msg instanceof Message ? msg.content : msg;
	return m.trim().toLowerCase().split(/ +/).join(" ");
}

export function trimArgs(msg: Message | string): string {
	const m = msg instanceof Message ? msg.content : msg;
	return m.trim().split(/ +/).slice(1).join(" ");
}

export function canReact(msg: Message): boolean {
	const chan = msg.channel;
	if (!(chan instanceof GuildChannel)) {
		return false;
	}
	const perms = chan.permissionsOf(bot.user.id);
	return perms.has("addReactions") && perms.has("readMessageHistory");
}
