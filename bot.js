// https://discordapp.com/oauth2/authorize?client_id=648596161510506506&scope=bot&permissions=8

const math = require('./node_modules/mathjs');
const config = require('./config.json');
const interaction = require("discord-v13-interaction");
const fs = require("fs");

const { readdirSync } = require('fs');
const { Client, Collection, Permissions, MessageEmbed, Discord } = require('discord.js');
const { Routes } = require('discord-api-types/v9');
const { REST } = require('@discordjs/rest');

const rest = new REST({ version: '9' }).setToken(config.token);
const client = new Client({ intents: ['DIRECT_MESSAGES', 'GUILD_MESSAGES', 'DIRECT_MESSAGE_TYPING', 'DIRECT_MESSAGE_REACTIONS', 'GUILD_MESSAGE_TYPING', 'GUILD_PRESENCES', 'GUILD_INVITES', 'GUILD_EMOJIS_AND_STICKERS', 'GUILD_BANS', 'GUILDS', 'GUILD_MEMBERS', 'GUILD_VOICE_STATES'] }, { partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });


const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const events = readdirSync('./events/').filter(file => file.endsWith('.js'));

const configStart = JSON.parse(fs.readFileSync("./configStart.json", "utf8"));

const masterId = '336191617910177793';
const clientId = "648596161510506506";


var guildId = null;

client.commands = new Collection();
module.exports.client = client;


client.login(config.token);
client.on('error', console.error);

client.on('messageCreate', async message => {

	let prefix = configStart.prefix
	if (message.author == client.user || message.author.bot) return
	try {
		if ((configStart.listen == false) && (message.channel.type === "GUILD_TEXT")) {
			if (!message.member.permissions.has('ADMINISTRATOR')) return
		}
		else if (configStart.listen == true) {
		}
		else {
		}
	} catch (error) {
		console.error(error);
	}
	console.log("Commande reçu: " + message.content)
	const args = message.content.slice(prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();
	const fullcommand = message.content.slice(prefix.length)
	const commandPM = message.content.trim().split(/ +/g).shift().toLowerCase()
	let prefixUsed = message.content.substring(0, 1)
	let secondCommand = args[0] // argument utilisé
	let thirdCommand = args[1] // premier argument
	let msgauthor = message.author.id
	let codeAuteur = msgauthor.substring(0, 4);
	const idAdmins = ["253243505537712131", "322469289598648320", "336191617910177793", "226720181139931137", "240160013765705728"];
	let n = 0, m = 0, i = -1;
	let verif = null;

	if (message.channel.type === "GUILD_TEXT") { // Commandes '?' générales
		// Commandes de réinitialisation
		if ((idAdmins.includes(message.author.id)) && (['x', '$', '§'].includes(prefixUsed))) {
			message.delete();
			if (['reset', '-r', 'r'].includes(command)) {
				configStart.prefix = "?";
				configStart.listen = null;
				return;
			}
			else if (['lock', '-lck', 'lck'].includes(command)) {
				configStart.listen = false;
				return;
			}
			else if (['reboot', '-rb', 'rb'].includes(command)) {
				process.exit()
				return;
			}
			else if (['annonce', 'raid', 'rm'].includes(command)) { //mail [idSalon] [message]
				if (!message.member.permissions.has('MANAGE_MESSAGES')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande")
				if (!thirdCommand) return message.channel.send("Je ne peux pas envoyer de messages vide")
				if (!secondCommand) return message.channel.send("Entrez un nom de salon")
				client.channels.cache.find(r => r.name.startsWith(secondCommand)).send(message.content.substring((3 + secondCommand.length + command.length), message.content.length))
			}
		}
		// Modération
		if (!message.content.startsWith(prefix))
		{
			moderation();
		}
		else {
			if (message.content === '?') message.channel.send("Utilisez ?help pour plus d'informations sur mon fonctionnement!")
			// Mathématiques DONE
			else if (['math'].includes(command)) {
				for (n = 0; n < args.length; n++) {
					m += args[n];
				}

				r = math.evaluate(m)
				message.channel.send(m + " : " + r)
			}
			else if (['math.deriv'].includes(command)) {
				r = math.derivative(args[0], args[1])
				message.channel.send(args[0] + " pour " + args[1] + " : " + r)
			}
			else if (['math.fact'].includes(command)) {
				for (n = 0; n < Number.parseInt(args.length); n++) {
					let i = 1, R = 1, A = Number.parseInt(args[n]);
					while (i <= A) {
						if (!isNaN(args[n])) {
							R = R * i;
							i++;
						}
					}
					message.channel.send(args[n] + " : " + R)
				}
			}
			else if (['math.sqrt'].includes(command)) {
				for (n = 0; n < Number.parseInt(args.length); n++) {
					r = math.sqrt(args[i])
					message.channel.send(args[i] + " : " + r)
				}
			}
			else if (['math.rand'].includes(command)) {
				if ((args[1] < args[0]) || (args[1] == args[0]) || (isNaN(args[0])) || (isNaN(args[1]))) message.channel.send("erreur arguments invalide!");
				else message.channel.send("Résultat: " + Math.floor((Math.random() * Number.parseInt(args[1])) + Number.parseInt(args[0])))
			}

			// Modération
			else if (['del.msg'].includes(command)) {
				if (!message.member.permissions.has('MANAGE_MESSAGES')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande")
				try {
					//if (secondCommand.length == 18) client.channels.cache.messages.fetch(secondCommand).then(message => message.delete());
					if (!secondCommand || secondCommand == '' || secondCommand == 1 || secondCommand < 1) message.channel.bulkDelete(2, true)
					else if (secondCommand < 100) message.channel.bulkDelete(secondCommand + 1, true)
					else if (secondCommand < 10000) {
						for (i = 0; i <= parseInt(secondCommand / 100); i++)	message.channel.bulkDelete(100, true)
					}
					else if (isNaN(secondCommand)) return message.channel.send("Veuillez indiquer un nombre valide")
					else return message.channel.send("Erreur, argument inconnue.")

				} catch (error) {
					console.error(error);
					message.channel.send("Erreur, messages trop vieux.")
				};


			}
			else if (['del.chan'].includes(command)) {
				if (!message.member.permissions.has('MANAGE_CHANNELS')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande")
				if (!secondCommand) return message.channel.send("Un argument est nécessaire")
				for (i = 0; i < args.length; i++) {
					if (args[i].length == 18) {
						try {
							message.guild.channels.cache.get(args[i]).delete();
						}
						catch (error) {
							console.error(error);
						}
					}
					else {
						try {
							message.guild.channels.cache.find(r => r.name.startsWith(args[i])).delete();
						}
						catch (error) {
							console.error(error);
						}
						return 0;
					}
				}
			}
			else if (['create.chan'].includes(command)) {
				if (!message.member.permissions.has('MANAGE_CHANNELS')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande")
				var typechan = 0;
				message.channel.send("command : ?" + fullcommand)
				if (args[0]) {
					channelName = args[0];
				}
				if (['text'].includes(args[1])) {
					var typeChannel = 'GUILD_TEXT';
				}
				else if (['voice'].includes(args[1])) {
					var typeChannel = 'GUILD_VOICE';
				}
				else if (['category'].includes(args[1])) {
					var typeChannel = 'GUILD_CATEGORY';
				}
				message.guild.channels.create(channelName, {
					type: typeChannel, //This create a text channel, you can make a voice one too, by changing "text" to "voice"
					permissionOverwrites: [
						{
							id: message.guild.roles.everyone, //To make it be seen by a certain role, user an ID instead
							allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY']
							//deny: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY']
						}
					],
				})
			}
			else if (['createrole', 'role', 'cr'].includes(command)) { // ?role [nom_role] [couleur] A REFAIRE
				if (!message.member.permissions.has('ADMINISTRATOR')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande")
				var perm = '';
				if (args[0]) {
					var nameRole = args[0];
				}
				if (args[1]) {
					var colorRole = args[1];
				}
				if (['-kick'].includes(fullcommand)) {
					perm = perm | 0x0000000000000002;
				}
				if (['-ban'].includes(fullcommand)) {
					perm = perm | '0x0000000000000004';
				}
				if (['-admin'].includes(fullcommand)) {
					perm = perm | '0x0000000000000008';
				}
				if (['-chan'].includes(fullcommand)) {
					perm = perm | 0x0000000000000010;
				}
				if (['-guild'].includes(fullcommand)) {
					perm = perm | 0x0000000000000020;
				}
				if (['-log'].includes(fullcommand)) {
					perm = perm | 0x0000000000000080;
				}
				if (['-msg'].includes(fullcommand)) {
					perm = perm | 0x0000000000002000;
				}
				if (['-mute'].includes(fullcommand)) {
					perm = perm | 0x0000000000400000; 
				}
				if (['-deaf'].includes(fullcommand)) {
					perm = perm | 0x0000000000800000; 
				}
				if (['-move'].includes(fullcommand)) {
					perm = perm | 0x0000000001000000; 
				}
				if (['-mod'].includes(fullcommand)) {
					perm = perm | 0x0000010000000000; 
				}
				message.guild.roles.create({
					name: nameRole,
					color: colorRole,
					permissions: perm,
				})

			}

			else if (command === 'pin') { // ?pin "id message"
				if (!message.member.permissions.has('MANAGE_MESSAGES')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande.")
				let idSalon = client.channels.cache.get(splitCommand[1].substring(1, (splitCommand[1].length - 1))) // id salon	
				message.channel.fetchMessages({ around: secondCommand, limit: 1 })
					.then(message => {
						const fetchedMsg = message.first();
						fetchedMsg.pin();
					});
			}
			else if (command === 'unpin') { // ?unpin "id message"
				if (!message.member.permissions.has('MANAGE_MESSAGES')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande.")
				let idSalon = client.channels.cache.get(splitCommand[1].substring(1, (splitCommand[1].length - 1))) // id salon	
				message.channel.fetchMessages({ around: secondCommand, limit: 1 })
					.then(message => {
						const fetchedMsg = message.first();
						fetchedMsg.unpin();
					});
			}
			else if (command === 'edit') { // ?edit "id message" "message"
				if (!message.member.permissions.has('MANAGE_MESSAGES')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande.")
				let idSalon = client.channels.cache.get(splitCommand[1].substring(1, (splitCommand[1].length - 1))) // id salon	
				message.channel.fetchMessages({ around: thirdCommand, limit: 1 })
					.then(message => {
						const fetchedMsg = message.first();
						fetchedMsg.edit(args[3]);
					});
			}

			else if (command === "mute") { // A REFAIRE 
				if (!message.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) return message.channel.send("Invalid Permissions")
				const targetUser = interaction.options.getMember(secondCommand);
				targetUser.edit({ mute: true })
			}
			else if (command === "unmute") { // A REFAIRE 
				if (!message.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) return message.channel.send("Invalid Permissions")
				const targetUser = interaction.options.getMember(secondCommand);
				targetUser.edit({ mute: false })
			}
			else if (command === "infractions") { // A REFAIRE 
				if (!message.member.permissions.has('MANAGE_MESSAGES')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande")
				let member = message.mentions.members.first()
				if (!member) return message.channel.send("Veuillez mentionner un membre")
				let embeds = new Discord.MessageEmbed()
					.setAuthor(member.user.username, member.user.displayAvatarURL)
					.addField('10 derniers warns', ((warns[member.id] && warns[member.id].length) ? warns[member.id].slice(0, 10).map(e => e.reason) : "Ce membre n'a aucun warns"))
					.setTimestamp()
				message.channel.send(embeds)
			}
			else if (command === "warn") { // A REFAIRE 
				if (!message.member.permissions.has('MANAGE_MESSAGES')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande")
				let member = message.mentions.members.first()
				if (!member) return message.channel.send("Veuillez mentionner un membre")
				if (member.highestRole.comparePositionTo(message.member.highestRole) < 1 && message.author.id !== message.guild.ownerID) return message.channel.send("Vous ne pouvez pas warn ce membre")
				let reason = args.slice(2).join(' ')
				if (!reason) return message.channel.send("Veuillez indiquer une raison")
				if (!warns[member.id]) {
					warns[member.id] = []
				}
				warns[member.id].unshift({
					reason: reason,
					date: Date.now(),
					mod: message.author.id
				})
				fs.writeFileSync('./warns.json', JSON.stringify(warns))
				message.channel.send(member + " a été warn pour " + reason + " :white_check_mark:")
			}
			else if (command === "unwarn") { // A REFAIRE 
				let member = message.mentions.members.first()
				if (!message.member.permissions.has('MANAGE_MESSAGES')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande.")
				if (!member) return message.channel.send("Membre introuvable")
				if (member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.ownerID) return message.channel.send("Vous ne pouvez pas unwarn ce membre.")
				if (member.highestRole.calculatedPosition >= message.guild.me.highestRole.calculatedPosition || member.id === message.guild.ownerID) return message.channel.send("Je ne pas unwarn ce membre.")
				if (!warns[member.id] || !warns[member.id].length) return message.channel.send("Ce membre n'a actuellement aucun warns.")
				warns[member.id].shift()
				fs.writeFileSync('./warns.json', JSON.stringify(warns))
				message.channel.send("Le dernier warn de " + member + " a été retiré :white_check_mark:")
			}

			else if (['banish', 'ban', 'bn'].includes(command)) {
				if (!message.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) return message.channel.send("Invalid Permissions")
				let user = message.mentions.members.first();
				if (!user) return message.channel.send("Utilisateur invalide.")
				let banReason = args.join(" ").slice(22);
				if (banReason == '') banReason = "None"
				user.ban();
			}
			else if (['lepen', 'kick', 'k'].includes(command)) {
				if (!message.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) return message.channel.send("Invalid Permissions")
				let user = message.mentions.members.first();
				if (!user) return message.channel.send("Utilisateur invalide.")
				let banReason = args.join(" ").slice(22);
				if (banReason == '') banReason = "None"
				user.kick();
			}

			else if (['movevocal', 'move', 'mv'].includes(command)) {	 // ?move [user] [idSalon]
				if (!message.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) return message.channel.send("Invalid Permissions")
				let user = message.mentions.members.first();
				if (!user) return message.channel.send("Utilisateur invalide.")
				// if (!user.voiceChannel) return message.channel.send('Il n\'est pas dans un salon vocal');
				user.voice.setChannel(thirdCommand);
			}
			else if (['kickvoice', 'disconnect', 'kv'].includes(command)) {
				if (!message.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) return message.channel.send("Invalid Permissions")
				let user = message.mentions.members.first();
				if (!user) return message.channel.send("Utilisateur invalide.")
				// if (!user.voiceChannel) return message.channel.send('Il n\'est pas dans un salon vocal');
				message.guild.channels.create('tmp_vocal', { type: 'GUILD_VOICE' });
				user.voice.setChannel(await message.guild.channels.cache.find(r => r.name.startsWith('tmp_vocal')))
				message.guild.channels.cache.find(r => r.name.startsWith('tmp_vocal')).delete()
			}

			// Information bot, serveur, créateur
			else if (['invitbot', 'bot', 'b'].includes(command)) {
				if (message.member.permissions.has('ADMINISTRATOR')) {
					client.users.cache.get(msgauthor).send("Lien me donnant tous les droits sur un serveur, indispensable pour les commandes comportant des '/'\nIl est conseillé de me retirer du serveur et de me ré-inviter, ensuite de donner les pleins pouvoirs, ne vous en faites pas, je ne fait que très peu de coups d'état.\nhttps://discord.com/api/oauth2/authorize?client_id=648596161510506506&permissions=8&redirect_uri=https%3A%2F%2Fdiscordapp.com%2Foauth2%2Fauthorize%3F%26client_id%3D648596161510506506%26scope%3Dbot&response_type=code&scope=applications.commands%20bot%20applications.builds.read%20applications.store.update%20applications.entitlements%20applications.builds.upload");
				}
				else {
					message.channel.send("https://discordapp.com/oauth2/authorize?&client_id=648596161510506506&scope=bot")
				}
				console.log("invitation du bot demmandé!");
			}
			else if (['botmaster', 'master', 'bm'].includes(command)) {
				message.channel.send("Le créateur est <@336191617910177793> !")
				console.log("commande créateur réussi")
			}
			else if (['serveurmaster', 'serv', 'sc'].includes(command)) {
				message.channel.send("Tien le serveur du créateur https://discord.gg/bwKEuZB ")
				console.log("commande serveur créateur réussi!")
			}
			else if (['nombremembre', 'membre', 'mb'].includes(command)) {
				message.channel.send("Il y a " + message.guild.memberCount + " personnes dans le serveur !");
			}

			// Utilitaires 
			else if (['setup'].includes(command)) {
				if (!message.member.permissions.has('ADMINISTRATOR')) return
				configStart.listen = true
				client.user.setActivity("Ke koi", { type: 'PLAYING' })
				message.guild.members.fetch().then(membersList => {
					console.log(`Nombre de membres dans ce serveur : ${membersList.size}`);
				});


			}
			else if (['statut'].includes(command)) {
				if (!message.member.permissions.has('ADMINISTRATOR')) return
				client.user.setActivity(args, { type: 'PLAYING' })
			}
			else if (['aide', 'help', 'h'].includes(command)) {
				var help_embed = new MessageEmbed()
					.setColor(0xc0c0c0)
					.setThumbnail("https://tse3.mm.bing.net/th?id=OIP.qyj6x0DxpjcMim3F0TGTxwHaEo&pid=Api&P=0&w=281&h=177")
					.setTitle("Voici comment je fonctionne : ")
					.setDescription("Vous pouvez utilisez mes commandes avec le préfixe ``" + configStart.prefix + "``")
					.addField("Si vous voulez plus de détails sur les commandes disponible écrivez les juste en dessous!", "##########")
					.addField("**CALCULATRICE**", "+, -, *, /, ², sqrt, cos, sin, tan, pi, mod, e, rand")
					.addField("**UTILE**", "purge, membre, ping")
					.addField("**FUN**", "8ball, spam")
					.addField("**SUPPORT**", "rep, createur, serveurcrea, bot")
					.addField("**ADMIN MODERATION**", "kick, kickvoice, ban, warn, unwarn, mute, unmute")
					.addField("**ADMIN MODERATION**", "infractions, delchan, del, delone, delchan, edit, pin, unpin")
					.addField("**ADMIN AUTRES**", "mail")
					.setTimestamp()
					.setFooter("pour signaler un bug faites '?rep'")
				client.users.cache.get(msgauthor).send({ embeds: [help_embed] })
				message.channel.send("Les commandes vous ont été envoyés en messages privés")
			}
			else if (['reboot', 'crash', 'reboot'].includes(command)) {
				if (message.member.permissions.has('ADMINISTRATOR')) process.exit()
			}
			else if (['mode', 'set', 'm'].includes(command)) { // ?mode [off, on, null]
				if (!message.member.permissions.has('ADMINISTRATOR')) return
				if (['off', 'f', '0'].includes(secondCommand)) {
					configStart.listen = false
					client.user.setActivity("Je Ronpish", { type: 'PLAYING' })
				}
				else if (['on', 't', '1'].includes(secondCommand)) {
					configStart.listen = true
					client.user.setActivity("Ke koi", { type: 'PLAYING' })
				}
				else if (['null', 'n', '2'].includes(secondCommand)) {
					configStart.listen = null
					client.user.setActivity(":flushed:", { type: 'PLAYING' })
				}
			}
			else if (['mail', 'say', 'ml'].includes(command)) { //mail [idSalon] [message]
				if (!message.member.permissions.has('MANAGE_MESSAGES')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande")
				if (!thirdCommand) return message.channel.send("Je ne peux pas envoyer de messages vide")
				if (secondCommand == 0) message.channel.send(message.content.substring(3 + command.length, message.content.length))
				else if (secondCommand.length == 21) {
					client.channels.cache.get(secondCommand.substring(2, (secondCommand.length - 1))).send(message.content.substring(24 + command.length, message.content.length));
				}
				else if (secondCommand.length == 18) client.channels.cache.get(secondCommand).send(message.content.substring(21 + command.length, message.content.length));
			}
			else if (['say2', 's2'].includes(command)) { // ?commande [identifiant ou mention] [texte]
				if (!message.member.permissions.has('MANAGE_MESSAGES')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande")
				if (!thirdCommand) return message.channel.send("Je ne peux pas envoyer de messages vide")
				let user = message.mentions.members.first();
				if (!secondCommand) message.channel.send(message.content.substring(7, message.content.length))
				else if (secondCommand.length == 22) message.channel.send(secondCommand + " " + message.content.substring(24 + command.length, message.content.length));
				else if (secondCommand.length == 18) message.channel.send(" <@!" + secondCommand + "> " + message.content.substring(21 + command.length, message.content.length));
			}
			else if (['cache'].includes(command)) { //
				message.guild.members.fetch().then(membersList => {
					console.log(`Nombre de membres dans ce serveur : ${membersList.size}`);
				});
			}
			else if (['privatemessage', 'pm', 'mp'].includes(command)) { //
				client.users.cache.get(msgauthor).send("Messages privés activés.")
			}
			else if (['prefix', 'pref', 'px'].includes(command)) { //
				if (!message.member.permissions.has('MANAGE_MESSAGES')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande")
				if (!secondCommand) return message.channel.send("Prefix actuel : " + prefix)
				if (['/', ' '].includes(secondCommand)) return message.channel.send("Prefix interdit")
				if (['reset', '-r', 'r'].includes(secondCommand)) secondCommand = "?"
				configStart.prefix = secondCommand;
				prefix = configStart.prefix
				message.channel.send("Prefix changé pour " + configStart.prefix)
			}
			else if (['push', 'admin'].includes(command)) {
				if (!idAdmins.includes(message.author.id)) return message.channel.send("Commande interdite")
				if (!secondCommand) return message.channel.send("Un argument est nécessaire")
				idAdmins.push(secondCommand);
				console.log(idAdmins)
			}
			else if (['depush', 'unadmin'].includes(command)) {
				if (!idAdmins.includes(message.author.id)) return message.channel.send("Commande interdite")
				if (!secondCommand) return message.channel.send("Un argument est nécessaire")
				idAdmins.filter(function (f) { return f !== secondCommand })
				console.log(idAdmins)
			}

			else if (['deleteslash', 'delslash', 'dslash'].includes(command)) {
				if (!idAdmins.includes(message.author.id)) return message.channel.send("Commande interdite")
				rest.get(Routes.applicationGuildCommands(clientId, guildId))
					.then(data => {
						const promises = [];
						for (const command of data) {
							const deleteUrl = `${Routes.applicationGuildCommands(clientId, guildId)}/${command.id}`;
							promises.push(rest.delete(deleteUrl));
						}
						return Promise.all(promises);
					});
			}
			else if (['delglobcom', 'dglcom', 'dglc'].includes(command)) {
				if (!idAdmins.includes(message.author.id)) return message.channel.send("Commande interdite")
				if (!secondCommand) return message.channel.send("Argument nécessaire")
				try {
					client.application.commands.cache.find(c => c.name === secondCommand).delete()
				} catch (error) {
					console.error(error);
				}
			}
			else if (['delguildcom', 'dgicom', 'dgic'].includes(command)) {
				if (!idAdmins.includes(message.author.id)) return message.channel.send("Commande interdite")
				if (!secondCommand) return message.channel.send("Argument nécessaire")
				try {
					guild.commands.cache.find(c => c.name === secondCommand).delete()
				} catch (error) {
					console.error(error);
				}
			}


			// Fun
			else if (['8ball', 'trucdemerde', '8b'].includes(command)) {
				if (!secondCommand) return message.channel.send("Veuillez **poser une question** :x:")
				let rep = [
					'It is certain.',
					'It is decidedly so.',
					'Without a doubt.',
					'Yes definitely.',
					'You may rely on it.',
					'As I see it, yes.',
					'Most likely.',
					'Outlook good.',
					'Yes.',
					'Signs point to yes.',
					'Reply hazy try again.',
					'Ask again later.',
					'Better not tell you now.',
					'Cannot predict now.',
					'Concentrate and ask again.',
					'Don\'t count on it.',
					'My reply is no.',
					'My sources say no.',
					'Outlook not so good.',
					'Very doubtful.',
					'No way.',
					'Maybe',
					'The answer is hiding inside you',
					'No.',
					'Depends on the mood of the CS god',
					'||No||',
					'||Yes||',
					'Hang on',
					'It\'s over',
					'It\'s just the beginning',
					'Good Luck',
				];

				let index = (Math.floor(Math.random() * Math.floor(rep.length)));
				let question = args.slice(0).join(" ");
				message.channel.send(index);
				var ball_embed = new MessageEmbed()
					.setColor(0xc0c0c0)
					.addField("Question:", String(question))
					.addField("Réponse:", String(rep[index]));
				message.channel.send({ embeds: [ball_embed] })
			}
			else if (['insulte', 'ins', 'ins'].includes(command)) {
				if (!secondCommand) return message.channel.send("Veuillez **poser une question** :x:")
				let rep = [
					'Pas gentil.',
					'Postière.',
					'Péripapéticienne.',
					'Président.',
				];
				let index = (Math.floor(Math.random() * Math.floor(rep.length)));
				message.channel.send(rep[index])
			}

			else {

			}
		}
		if (prefixUsed === prefix && command) message.delete();
	}

	else {// commande message privé	
		let msg = message.content.substring(29, message.content.lenght);
		if (msg == '') msg = 'vide';
		if (['message', 'send', 'msg'].includes(commandPM)) {
			if (msgauthor != "336191617910177793") {
				// rapport, auteur + son message avec la personne "pinggé" 
			}
			for (let i = 0; i < idAdmins.length; i++) { // sert a vérifier si c'est un admin
				if (idAdmins[i] == msgauthor) {
					n++;
					verif = true;
				}
			}
			if (n != 1) { // Si non-admin
				verif = false;
			}
			else if (codeAuteur == secondCommand) { // Vérification mdp
				verif = true;
				client.users.cache.get(thirdCommand).send(msg); // mdp id_Destinataire  texte
			}
			else { // Admin mais mauvais mot de passe
				client.users.cache.get(masterId).send("<@" + msgauthor + "> à oublié son mot de passe! ");
			}
		}
		else verif = null;

		if (commandPM === '+') client.users.cache.get(msgauthor).send("?+ [nombre d'args[1] a calculer] [nombre a calculer séparés d'un espace]\nCette commande permet d'additionner un nombre infini d'argument!")
		else if (commandPM === '-') client.users.cache.get(msgauthor).send("?- [nombre d'args[1] a calculer] [nombre a calculer séparés d'un espace]\nCette commande permet de soustraire un nombre infini d'argument!")
		else if (commandPM === '*') client.users.cache.get(msgauthor).send("?* [nombre d'args[1] a calculer] [nombre a calculer séparés d'un espace]\nCette commande permet de multiplier un nombre infini d'argument!")
		else if (commandPM === '/') client.users.cache.get(msgauthor).send("?/ [nombre d'args[1] a calculer] [nombre a calculer séparés d'un espace]\nCette commande permet de diviser un nombre infini d'argument!")
		else if (commandPM === '²') client.users.cache.get(msgauthor).send("?² [nombre] [puissance]\nCette commande permet de calculer la puissance d'un nombre!")
		else if (commandPM === 'sqrt') client.users.cache.get(msgauthor).send("?sqrt [nombre]\nCette commande permet de calculer la racine carré d'un nombre!")
		else if (commandPM === 'cos') client.users.cache.get(msgauthor).send("?cos [nombre]\nCette commande permet de calculer le cosinus d'un nombre!")
		else if (commandPM === 'sin') client.users.cache.get(msgauthor).send("?sin [nombre]\nCette commande permet de calculer le sinus d'un nombre!")
		else if (commandPM === 'tan') client.users.cache.get(msgauthor).send("?tan [nombre]\nCette commande permet de calculer la tangeante d'un nombre!")
		else if (commandPM === 'mod') client.users.cache.get(msgauthor).send("?mod [nombre1] [nombre2]\nCette commande permet de calculer le module d'un nombre complexe sous la forme x+y!")
		else if (commandPM === 'e') client.users.cache.get(msgauthor).send("?e [nombre]\nCette commande permet de calculer l'exponentielle d'un nombre!")
		else if (commandPM === 'pi') client.users.cache.get(msgauthor).send("?pi [nombre]\nCette commande permet de calculer pi*nombre!")
		else if (commandPM === 'rand') client.users.cache.get(msgauthor).send("?rand [borne inférieure] [borne supérieure]\nCette commande permet de donner un nombre aléatoire entre les deux bornes entrées!")
		else if (commandPM === 'rep') client.users.cache.get(msgauthor).send("?rep [texte]\nUtilisez cette commande pour reporter un bug, je rapporterais tout à mon créateur pour qu'il puisse corriger ça au plus vite!")
		else if (commandPM === '8ball') client.users.cache.get(msgauthor).send("?8ball [question]\nAvec cette commande j'essayerais de répondre à votre question, enfin j'essayerais.")
		else if (commandPM === 'del') client.users.cache.get(msgauthor).send("?del [nombre en dessous de 100]\nRéservé aux admins\nSupprime un certain nombre de message dans le salon où la commande est entrée.")
		else if (commandPM === 'delone') client.users.cache.get(msgauthor).send("?delone [id_message]\nRéservé aux admins\nSupprime un message dans le salon où la commande est entrée.")
		else if (commandPM === 'delchan') client.users.cache.get(msgauthor).send("?delchan [idSalon1] ... [idSalonX]\nPermet de supprimer un ou plusieurs salons via ID.")
		else if (commandPM === 'chan') client.users.cache.get(msgauthor).send("?chan [Vox, voice, vocal, Text, write] [nom]\nPermet de créer un salon vocal ou écrit, placé tout en haut.")
		else if (commandPM === 'membre') client.users.cache.get(msgauthor).send("?membre\nPermet de savoir diverses informations sur le nombre de membres.")
		else if (commandPM === 'ping') client.users.cache.get(msgauthor).send("?ping\nPermet de savoir en combien de temps je peux répondre à vos demandes.")
		else if (commandPM === 'edit') client.users.cache.get(msgauthor).send("?edit\nRéservé aux admins\nPermet d'éditer le dernier message que j'ai envoyé.")
		else if (commandPM === 'pin') client.users.cache.get(msgauthor).send("?pin [id_message]\nRéservé aux admins\nPermet d'épingler un message.")
		else if (commandPM === 'unpin') client.users.cache.get(msgauthor).send("?unpin [id_message]\nRéservé aux admins\nPermet de désépingler un message.")
		else if (commandPM === 'mute') client.users.cache.get(msgauthor).send("?mute [@mention]\nRéservé aux admins\nPermet de mute une personne.")
		else if (commandPM === 'unmute') client.users.cache.get(msgauthor).send("?unmute [@mention]\nRéservé aux admins\nPermet de retirer le 'mute' sur une personne.")
		else if (commandPM === 'warn') client.users.cache.get(msgauthor).send("?warn [@mention]\nRéservé aux admins\nPermet de mettre un avertissement sur une personne.")
		else if (commandPM === 'unwarn') client.users.cache.get(msgauthor).send("?unwarn [@mention]\nRéservé aux admins\nPermet de retirer un avertissement d'une personne.")
		else if (commandPM === 'infractions') client.users.cache.get(msgauthor).send("?infractions [@mention]\nRéservé aux admins\nPermet de voir l'historique des avertissements d'une personne.")
		else if (commandPM === 'ban') client.users.cache.get(msgauthor).send("?ban [@mention]\nRéservé aux admins\nPermet de bannir une personne.")
		else if (commandPM === 'kick') client.users.cache.get(msgauthor).send("?kick [@mention]\nRéservé aux admins\nPermet de kick une personne.")
		else if (commandPM === 'kickvoice') client.users.cache.get(msgauthor).send("?kickvoice [@mention]\nRéservé aux admins\nPermet de virer une personne d'un salon vocal.")
		else if (commandPM === 'createur') client.users.cache.get(msgauthor).send("?createur\nPermet de voir qui est mon créateur.")
		else if (commandPM === 'serveurcrea') client.users.cache.get(msgauthor).send("?serveurcrea\nPermet de voir le serveur du créateur.")
		else if (commandPM === 'reboot') client.users.cache.get(msgauthor).send("?reboot\nRéservé à mon créateur\nPermet de m'arrêter en cas d'urgence.")
		else if (commandPM === 'mail') client.users.cache.get(msgauthor).send("?mail [id_salon] [texte]\nRéservé aux admins\nPermet d'envoyer un message en mon nom sur un salon.\nSi [#salon] est à zéro, le message sera envoyé sur le salon actuel.")
		else if (msgauthor !== "336191617910177793") { // rapport
			client.users.cache.get(masterId).send("Auteur du message : <@" + msgauthor + ">\nID de l'auteur : " + msgauthor + "\nAdmin : " + verif + "\nContenue du message : " + message.content);
		}
	}
})

client.on("ready", () => {
	if (!configStart) configStart = {
		listen: false,
		prefix: 0
	};
	configStart.listen = false
	configStart.prefix = "?"
	client.user.setActivity(":flushed:", { type: 'PLAYING' })

	//for (const file of commandFiles) {
	//	const command = require(`./commands/${file}`);
	//	client.commands.set(command.data.name, command);
	//}

	client.users.cache.get(masterId).send("Connecté !\n[set on] ; [pm] ; [cache]")
	console.log(`Logged in as ${client.user.tag}; caching all recent messages...`);
});

client.on('messageReactionAdd', () => {
	const message = react.message;
	const channel = message.channel;
	const guild = message.guild;

	// Ignore if this happened in the target channel
	if (channel.name.toLowerCase() === config.pinner.channel.toLowerCase())
		return;

	// Ignore if it's not the superpin emoji
	if (react.emoji.name.toLowerCase() !== config.pinner.emoji.toLowerCase())
		return;

	// Finally, go ahead and pin it to the channel
	pinMessage(guild, message, user);
});

client.on('guildMemberAdd', async member => {
	const channel = member.guild.channels.find('name', 'shitpost-mignon');
	if (!channel) return;
	channel.send(`Bienvenue ${member}!`);
}
);

client.on("guildCreate", guild => {

	// This event triggers when the bot joins a guild.

	console.log(`Nouveau groupe rejoin! son nom est : ${guild.name} (id: ${guild.id}). Et il y a ${guild.memberCount} membres!`);

	client.user.setActivity(`Je suis présent dans ${client.guilds.size} serveurs`);

});

client.on('guildMemberRemove', member => {
	let embeds = new Discord.MessageEmbed()
		.setDescription('**' + member.user.username + '** à quitté les ' + member.guild.name)
		.setFooter('Nous sommes actuellement ' + member.guild.memberCount)
	member.guild.channels.cache.get('595771594849386507').send(embeds)

});

client.on('interactionCreate', async interaction => {

	/* If it isn't a command, return. */
	if (!interaction.isCommand()) return;

	/* Getting all the setted client's commands that has been set in deploy-commands.js. */
	const command = client.commands.get(interaction.commandName);

	/* If there are no commands, return. */
	if (!command) return;

	/* Try executing the command. If this doesn't work, throw a error. */
	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	};
});

function moderation(message) {
	const banWords = ["aulok", "queezie", "yprien", "pute", "lafarge", "encul", "merde", "connard", "salope", "fdp", "sale chienne", "pétasse", "prostitué"];
	const debanWords = ["enshi", "cute", "'adore mon bot", "ésolé tenshi", "ésolé Tenshi", "je m'excuse Tenshi", "je m'excuse tenshi"];
	let arr = 0;

	/*	Banwords
		for(let i = 0; i < banWords.length; i++){
			if(message.content.toLowerCase().includes(banWords[i])) {
				arr=1;
				guildMember.addRole('650460529655283732');
				guildMember.removeRole('649663549030924298');
				guildMember.removeRole('650397355249762321');
				message.channel.send("è_é");
			}
			if(arr==1) return;
		}
	*/

	/*	DéBanwords
		for(let i = 0; i < debanWords.length; i++){
			if(message.content.toLowerCase().includes(debanWords[i])) {
				arr=1;
				guildMember.addRole('649663549030924298');
				guildMember.removeRole('650460529655283732');
				message.channel.send("^_^");
			}
			if(arr==1) return;
		}	
	*/
}

client.login(config.token);