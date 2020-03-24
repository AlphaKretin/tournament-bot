import { Message, GuildChannel } from "eris";
import { prefix } from "./config.json";
import { timer } from "./commands/timer";
import { trimCommand } from "./modules/utils";
import { signup } from "./commands/signup";
import { bot } from "./modules/bot";

interface Command {
	name: string;
	func: (msg: Message) => Promise<void>;
	check: (msg: Message) => Promise<boolean>;
}

async function toCheck(msg: Message): Promise<boolean> {
	const member = msg.member;
	if (member) {
		return member.permission.has("manageMessages");
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
