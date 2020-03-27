import { Message } from "eris";
import { prefix, toRole } from "./config.json";
import { timer, cancel } from "./commands/timer";
import { trimCommand } from "./modules/utils";
import { signup, close } from "./commands/signup";
import { bot } from "./modules/bot";

interface Command {
	name: string;
	func: (msg: Message) => Promise<void>;
	check: (msg: Message) => boolean;
}

function toCheck(msg: Message): boolean {
	const member = msg.member;
	if (member) {
		return member.roles.includes(toRole);
	}
	return false;
}

const commands: Command[] = [
	{
		name: "timer",
		func: timer,
		check: toCheck
	},
	{
		name: "signup",
		func: signup,
		check: toCheck
	},
	{
		name: "close",
		func: close,
		check: toCheck
	},
	{
		name: "cancel",
		func: cancel,
		check: toCheck
	}
];

bot.on("messageCreate", (msg: Message) => {
	if (msg.author.bot) {
		return;
	}
	const content = trimCommand(msg);
	for (const command of commands) {
		if (content.startsWith(prefix + command.name) && command.check(msg)) {
			command.func(msg);
			return;
		}
	}
});

bot.on("ready", () => {
	console.log("Logged in as %s - %s", bot.user.username, bot.user.id);
});

bot.connect().catch(console.error);
