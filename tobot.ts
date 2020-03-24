import { Message } from "eris";
import { prefix } from "./config.json";
import { timer } from "./commands/timer";
import { trimCommand } from "./modules/utils";
import { signup } from "./commands/signup";
import { bot } from "./modules/bot";

interface Command {
	name: string;
	func: (msg: Message) => Promise<void>;
}

const commands: Command[] = [
	{
		name: "timer",
		func: timer
	},
	{
		name: "signup",
		func: signup
	}
];

bot.on("messageCreate", (msg: Message) => {
	const content = trimCommand(msg);
	for (const command of commands) {
		if (content.startsWith(prefix + command.name)) {
			command.func(msg);
			return;
		}
	}
});

bot.on("ready", () => {
	console.log("Logged in as %s - %s", bot.user.username, bot.user.id);
});

bot.connect().catch(console.error);
