const functions = require('firebase-functions/v1');
const admin = require('firebase-admin');
admin.initializeApp();

// HÄR ÄR APP-ID FÖR ADRIANS SCHEMA
const APP_ID = 'gaming-schema-app-light';
const db = admin.firestore();

// 🛠️ HJÄLPFUNKTION: Skickar notis direkt till Adrians padda/telefon
async function sendToAdrian(title, body) {
    const tokenDoc = await db.doc(`artifacts/${APP_ID}/public/data/device_tokens/adrians_telefon`).get();
    
    // ESLint-säker kontroll (utan frågetecken)
    if (tokenDoc.exists && tokenDoc.data().token) {
        const token = tokenDoc.data().token;
        return admin.messaging().send({ 
            token: token, 
            notification: { 
                title: title, 
                body: body 
            },
            webpush: {
                notification: {
                    icon: '/icon-270.png' 
                }
            }
        });
    }
    
    console.log("Kunde inte skicka notis. Hittade ingen Token för Adrian.");
    return null;
}

// 1. DOPAMIN: Notis när ett NYTT UPPDRAG läggs till
exports.onNewTask = functions.firestore
    .document(`artifacts/${APP_ID}/public/data/schedule_items/{itemId}`)
    .onCreate(async (snap, context) => {
        const task = snap.data();
        
        let title = "📅 Nytt uppdrag!";
        let body = `Du har ett nytt uppdrag: ${task.title}. In och kika!`;

        if (task.isLiveEvent) {
            title = "🚨 LIVE EVENT ALERT!";
            body = "Ett Steal a brainroth-event har dykt upp! Skynda dig in i appen!";
        }

        return sendToAdrian(title, body);
    });

// 2. KA-CHING: Notis när banken uppdateras ELLER Dagens meddelande byts
exports.onBankUpdate = functions.firestore
    .document(`artifacts/${APP_ID}/public/data/bank/adrian`)
    .onUpdate(async (change, context) => {
        const oldData = change.before.data();
        const newData = change.after.data();

        // Pengar in!
        if (newData.balance > oldData.balance) {
            const diff = newData.balance - oldData.balance;
            return sendToAdrian(
                "💰 Ka-ching! Ny insättning!", 
                `Du fick precis +${diff} kr! Ditt nya saldo är ${newData.balance} kr.`
            );
        }

        // Meddelande ändrat!
        if (newData.dailyMessage && newData.dailyMessage !== oldData.dailyMessage) {
            const adminName = newData.adminName || "Din kompis";
            return sendToAdrian(
                `💬 Meddelande från ${adminName}`, 
                newData.dailyMessage
            );
        }

        return null;
    });

// 3. INBOX: Notis när Admin skickar vanligt meddelande
exports.onNewMessage = functions.firestore
    .document(`artifacts/${APP_ID}/public/data/messages/{msgId}`)
    .onCreate(async (snap, context) => {
        const msg = snap.data();
        
        // Strunta i system-meddelanden när han köpt nåt i butiken
        if (msg.text && msg.text.includes("har köpt:")) {
            return null; 
        }

        return sendToAdrian("📬 Nytt meddelande!", msg.text);
    });