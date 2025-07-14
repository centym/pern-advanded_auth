import { google } from "googleapis";
import { credentialsClient } from './googleApiAuthService.js';

export async function sendEmail(content) {

  const gmail = google.gmail({ version: "v1", auth: await credentialsClient() });
  // Create the email content   
  if (!content) {

  
  const message = 'TO: yves.centym@gmail.com\n' +
  'Subject: Test Email\n\n' +
  'Content-Type: text/plain; charset=UTF-8\n\n' +
  'This is a test email sent from the Gmail API using Node.js.\n';
  content = message;
}

  //console.log('content:',  content);
  const encodedMessage = Buffer.from(content).toString("base64").replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const res = await gmail.users.messages.send({
    userId: "me",
    requestBody: {
      raw: encodedMessage,
    }, 
    });

    //console.log("Email sent successfully:", res.data);
    return res.data;

  
}