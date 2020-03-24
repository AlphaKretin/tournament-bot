import Eris from "eris";
import { token } from "./auth.json";
import { prefix } from "./config.json";
import { timer } from "./commands/timer";
import { trimCommand } from "./modules/utils";

const bot = new Eris.Client(token);

interface Command {
	name: string;
	func: (msg: Eris.Message) => Promise<void>;
}

const commands: Command[] = [
	{
		name: "timer",
		func: timer
	}
];

bot.on("messageCreate", (msg: Eris.Message) => {
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
