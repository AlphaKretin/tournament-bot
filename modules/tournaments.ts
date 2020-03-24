import { Message, GuildChannel, TextChannel } from "eris";
import { bot } from "./bot";
import { addReactionButton } from "../modules/reactionButtons";
import { signupChannel } from "../config.json";

interface UserRegistration {
	channel: string;
	message: string;
}

export class Tournament {
	private users: { [userID: string]: UserRegistration };
	private msg: Message;
	constructor(msg: Message) {
		this.users = {};
		this.msg = msg;
	}

	public async addUser(userID: string): Promise<void> {
		if (!(userID in this.users)) {
			const user = bot.users.get(userID);
			const chan = this.msg.channel;
			let name = userID;
			if (user) {
				name = user.username;
				if (this.msg.channel instanceof GuildChannel) {
					const member = this.msg.channel.guild.members.get(userID);
					if (member && member.nick) {
						name = member.nick;
					}
				}
			}
			const mes = await chan.createMessage("**" + name + "** has signed up for the tournament!");
			this.users[userID] = {
				message: mes.id,
				channel: mes.channel.id
			};
		}
	}

	public async removeUser(userID: string): Promise<void> {
		if (userID in this.users) {
			const userReg = this.users[userID];
			await bot.deleteMessage(userReg.channel, userReg.message);
			delete this.users[userID];
		}
	}
}

const tournaments: { [message: string]: Tournament } = {};

export async function addTournament(message: string): Promise<Tournament | undefined> {
	const suChan = bot.getChannel(signupChannel);
	if (!(suChan instanceof TextChannel)) {
		return;
	}
	const mes = await suChan.createMessage(message + "\n__Click ✅ below to sign up for this tournament!__");
	tournaments[mes.id] = new Tournament(mes);
	addReactionButton(
		mes,
		"✅",
		async (_, userID: string) => {
			await tournaments[mes.id].addUser(userID);
		},
		async (_, userID: string) => {
			await tournaments[mes.id].removeUser(userID);
		},
		true
	);
	await mes.pin();
	return tournaments[mes.id];
}
