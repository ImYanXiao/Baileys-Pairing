const makeWASocket = require("@whiskeysockets/baileys").default
const readline = require("readline")
const { delay , useMultiFileAuthState } = require("@whiskeysockets/baileys")


var question = function(text) {
            return new Promise(function(resolve) {
                rl.question(text, resolve);
            });
        };
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

async function connect() {
const { state, saveCreds } = await useMultiFileAuthState('./sessions')

async function qr() {

	const P = !process.argv.includes('--use-pairing-code')
	let conn = makeWASocket({
		auth: state,
		printQRInTerminal: !P,
		browser: ['Mac OS', 'safari', '5.1.10'], 
	})
	if (P && !conn.authState.creds.registered) {
			const phoneNumber = await question('Please enter your mobile phone number:\n')
			const code = await conn.requestPairingCode(phoneNumber)
			console.log(`Pairing code: ${code}`)

	}
	conn.ev.on("connection.update", async (s) => {
		const { connection, lastDisconnect } = s
		if (connection == "open") {
			await delay(1000 * 10)
			process.exit(0)
		}
		if (
			connection === "close" &&
			lastDisconnect &&
			lastDisconnect.error &&
			lastDisconnect.error.output.statusCode != 401
			) {
			qr()
		}
	})
	conn.ev.on('creds.update', saveCreds)
	conn.ev.on('messages.upsert', () => { })
}
qr()
}
connect() 
