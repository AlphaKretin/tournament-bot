import { Message, GuildChannel, TextChannel } from "eris";
import { bot } from "./bot";
import { addReactionButton, removeButtons } from "../modules/reactionButtons";
import { signupChannel, participantRole } from "../config.json";

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
					if (member) {
						if (member.nick) {
							name = member.nick;
						}
						await member.addRole(participantRole);
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
			if (this.msg.channel instanceof GuildChannel) {
				const member = this.msg.channel.guild.members.get(userID);
				if (member) {
					await member.removeRole(participantRole);
				}
			}
		}
	}

	public async destruct(): Promise<void> {
		await removeButtons(this.msg);
		if (this.msg.channel instanceof GuildChannel) {
			for (const user of Object.keys(this.users)) {
				const member = this.msg.channel.guild.members.get(user);
				if (member) {
					await member.removeRole(participantRole);
				}
			}
		}
		await this.msg.unpin();
	}
}

let currentTournament: Tournament | undefined;

export async function addTournament(message: string): Promise<Tournament | undefined> {
	const suChan = bot.getChannel(signupChannel);
	if (!(suChan instanceof TextChannel) || currentTournament) {
		return;
	}
	const mes = await suChan.createMessage(message + "\n__Click ✅ below to sign up for this tournament!__");
	currentTournament = new Tournament(mes);
	addReactionButton(
		mes,
		"✅",
		async (_, userID: string) => {
			if (currentTournament) {
				await currentTournament.addUser(userID);
			}
		},
		async (_, userID: string) => {
			if (currentTournament) {
				await currentTournament.removeUser(userID);
			}
		},
		true
	);
	await mes.pin();
	return currentTournament;
}

export async function removeTournament(): Promise<void> {
	if (currentTournament) {
		await currentTournament.destruct();
		currentTournament = undefined;
	}
}
