import { GuildChannel, Message } from "eris";
import { trimArgs } from "../modules/utils";
import { addReactionButton } from "../modules/reactionButtons";
import { bot } from "../modules/bot";

export async function signup(msg: Message): Promise<void> {
	const content = trimArgs(msg);
	const mes = await msg.channel.createMessage(content + "\n__Click ✅ below to sign up for this tournament!__");
	addReactionButton(
		mes,
		"✅",
		async (m: Message, userID: string) => {
			const user = bot.users.get(userID);
			const chan = m.channel;
			let name = userID;
			if (user) {
				name = user.username;
				if (chan instanceof GuildChannel) {
					const member = chan.guild.members.get(userID);
					if (member && member.nick) {
						name = member.nick;
					}
				}
			}
			await chan.createMessage("**" + name + "** has signed up for the tournament!");
		},
		true
	);
}
