import fs from 'fs';       
import path from 'path';
import process from 'process';
//import { authenticate } from '@google-cloud/local-auth';
import { google } from 'googleapis';

//import { auth, OAuth2Client } from 'google-auth-library';
import  http  from 'http';
import url from 'url';
import open from 'open';
import destroyer from 'server-destroy';
//import readline from 'readline';

const SCOPE = ['https://www.googleapis.com/auth/gmail.readonly'];
// This is the path to the token file that stores the user's access and refresh tokens
const TOKEN_PATH = path.join(process.cwd(), './backend/credentials/token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), './backend/credentials/credentials.json');

// Read the credentials file
export async function readCredentials() {
    const content = await fs.promises.readFile(CREDENTIALS_PATH, 'utf8');
    return JSON.parse(content);
}

// Load client secrets from a local file.
export  async function loadCredentials() {
    try {
        const credentials = await readCredentials();
        //console.log('Loaded credentials:', credentials);
        return credentials;
    } catch (error) {
        console.log('Error reading credentials file:', error);
        console.error('Error loading client secret file:', error);
        throw error;
    }
}

export  async function credentialsClient() {
    const credentials = await  loadCredentials();
    const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;

    const oAuth2Client = new google.auth.OAuth2(
        client_id,
        client_secret,
        redirect_uris[0]
      );
            // Check if we have previously stored a token.
    if (fs.existsSync(TOKEN_PATH)) {
        const token = await fs.readFileSync(TOKEN_PATH, 'utf8');
        oAuth2Client.setCredentials(token);
        oAuth2Client.setCredentials({ refresh_token: token });
        
    } else {
        // If we don't have a token, we'll need to get one.
        console.log('No token found. Please authorize the application.');
        await authorize(oAuth2Client);
    }
    return oAuth2Client;

}


export async function authorize() {
    try {
        let tokens_returned = null;
        const oAuth2Client = await credentialsClient()
        // Load client secrets from a local file.
        //const credentials = await readCredentials();
 //       const credentials = await  loadCredentials();
 //       const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;

 //       const oAuth2Client = new google.auth.OAuth2(
 //           client_id,
 //           client_secret,
 //           redirect_uris[0]
 //         );
                // Check if we have previously stored a token.
        if (fs.existsSync(TOKEN_PATH)) {
            let token = "";
            token = await fs.readFileSync(TOKEN_PATH, 'utf8');
  //          await oAuth2Client.setCredentials(JSON.parse(token));
            await oAuth2Client.setCredentials(token);
            return token; }
        else {

          // Génération de l'URL d'autorisation avec access_type=offline
        
        const SCOPES = ['https://mail.google.com/'];
        //const authUrl = oAuth2Client.generateAuthUrl({
        //    access_type: 'offline', // IMPORTANT pour obtenir un refresh_token
        //    scope: SCOPES,
        //    prompt: 'consent', // Pour forcer l'affichage du consentement (utile en dev)
        //});
        const authorizeUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: 'https://www.googleapis.com/auth/gmail.send',
            prompt: 'consent'
        });
 
        const server = await http
            .createServer(async (req, res) => {
                try {
                    if (req.url.indexOf('/oauth2callback') > -1) {
                        // acquire the code from the querystring, and close the web server.
                        const qs = new url.URL(req.url, 'http://localhost:3001')
                            .searchParams;
                        const code = qs.get('code');
                        //console.log(`Code is : [ ${code} ]`);
                        //console.log(code);
                        // Now that we have the code, use that to acquire tokens.
                        
                        const tokens = await oAuth2Client.getToken(code);
                        // Make sure to set the credentials on the OAuth2 client.
                        //oAuth2Client.setCredentials(tokens);
                        console.info('Tokens acquired.');
                        //console.log('tokens: ', tokens);
                        //console.log('Access Token:', tokens.tokens.access_token);
                        //console.log('Refresh Token:', tokens.tokens.refresh_token); // <--- ICI !
                        //console.log('Token Expiry integer:', tokens.tokens.expiry_date);
                        console.log('Token Expiry Date:', Date(tokens.tokens.expiry_date));
                        tokens_returned = tokens.tokens.refresh_token;


                        //const tokens = oAuth2Client.getToken(code);
                        // Now tokens contains an access_token and an optional refresh_token. Save them.
                        //oAuth2Client.setCredentials(tokens);
                        //  console.log('Tokens acquired:', tokens);
                        //console.log('---------------------------------');



                        res.end('Authentication successful! Please return to the console. Close this tab or Nagigateur');
                        await fs.promises.writeFile(TOKEN_PATH, tokens_returned);
                        console.log('Tokens stored to', TOKEN_PATH);
                
                        server.destroy();
                       // return tokens.tokens.access_token;

                    }
                } catch (e) {
                    console.log(e);
                    return null;
                }
            })
            .listen(3001, () => {
                // open the browser to the authorize url to start the workflow
                open(authorizeUrl, { wait: false }).then(cp => cp.unref());
            });
    destroyer(server);
    if (tokens_returned)  {
        // Save the tokens to a file for later use
        return tokens.tokens.refresh_token;
    } else
    return "null";
    
    }
}
    catch (error) {
        console.error('Error during authorization:', error);
        throw error;
    }

}


export default {
    credentialsClient

};