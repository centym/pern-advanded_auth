import {
	PASSWORD_RESET_REQUEST_TEMPLATE,
	PASSWORD_RESET_SUCCESS_TEMPLATE,
	VERIFICATION_EMAIL_TEMPLATE,
	WELCOME_EMAIL
} from "./emailTemplates.js";
//import { mailtrapClient, sender } from "./mailtrap.config.js";
import { sendEmail } from '../services/gmailApiServices.js';

export const sendVerificationEmail = async (email, verificationToken) => {
	const recipient = [{ email }];

	try {
		const messageParts = [
			'From: "Yves" <yves.centym@gmail.com>',
			'To: ' + recipient.map(r => r.email).join(', '),
			'Subject: Vérifier votre courriel',
			'MIME-Version: 1.0',
			'Content-Type: text/html; charset=UTF-8',
			VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
		  ];
		  const response = await sendEmail(messageParts.join('\n'));
		  //console.log("response: ", response);
  
//		  const response_google = await sendEmail(messageParts.join('\n'));
//		console.log("response_google: ", response_google);
//		const response = await mailtrapClient.send({
//			from: sender,
//			to: recipient,
//			subject: "Verify your email",
//			html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
//			category: "Email Verification",
//		});

		//console.log("Email sent successfully", response);
	} catch (error) {
		console.error(`Error sending verification`, error);

		throw new Error(`Error sending verification email: ${error}`);
	}
};

export const sendWelcomeEmail = async (email, name) => {
	const recipient = [{ email }];
//	template_uuid: "e65925d1-a9d1-4a40-ae7c-d92b37d593df",

	try {
		const messageParts = [
			'From: "Yves" <yves.centym@gmail.com>',
			'To: ' + recipient.map(r => r.email).join(', '),
			'Subject: Bienvenue dans notre application',
			'MIME-Version: 1.0',
			'Content-Type: text/html; charset=UTF-8',
			WELCOME_EMAIL.replace("{name}", name),
			  ];
			  const response = await sendEmail(messageParts.join('\n'));
			  //console.log("response: ", response);

//			  const response = await mailtrapClient.send({
//			from: sender,
//			to: recipient,
//			template_uuid: "4921f1f3-0c1c-4056-9169-fa7a5ec11f31",
//			template_variables: {
//				company_info_name: "Auth Company",
//				name: name,
//			},
//		});

		//console.log("Welcome email sent successfully", response);
	} catch (error) {
		console.error(`Error sending welcome email`, error);

		throw new Error(`Error sending welcome email: ${error}`);
	}
};

export const sendPasswordResetEmail = async (email, resetURL) => {
	const recipient = [{ email }];

	try {
		const messageParts = [
			'From: "Yves" <yves.centym@gmail.com>',
			'To: ' + recipient.map(r => r.email).join(', '),
			'Subject: Initialiser le mot de passe',
			'MIME-Version: 1.0',
			'Content-Type: text/html; charset=UTF-8',
			PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
		  ];
		const response = await sendEmail(messageParts.join('\n'));
		//console.log("response: ", response);
		
	//	const response = await mailtrapClient.send({
	//		from: sender,
	//		to: recipient,
	//		subject: "Reset your password",
	//		html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
	//		category: "Password Reset",
	//	});

	} catch (error) {
		console.error(`Error sending password reset email`, error);

		throw new Error(`Error sending password reset email: ${error}`);
	}
};

export const sendResetSuccessEmail = async (email) => {
	const recipient = [{ email }];

	try {

		const messageParts = [
			'From: "Yves" <yves.centym@gmail.com>',
			'To: ' + recipient.map(r => r.email).join(', '),
			'Subject: Initialisation du mot de passe réussie',
			'MIME-Version: 1.0',
			'Content-Type: text/html; charset=UTF-8',
			PASSWORD_RESET_SUCCESS_TEMPLATE,
		  ];
		const response = await sendEmail(messageParts.join('\n'));
		//console.log("response: ", response);

		
//		const response = await mailtrapClient.send({
//			from: sender,
//			to: recipient,
//			subject: "Password Reset Successful",
//			html: PASSWORD_RESET_SUCCESS_TEMPLATE,
//			category: "Password Reset",
//		});

		//console.log("Password reset email sent successfully", response);
	} catch (error) {
		console.error(`Error sending password reset success email`, error);

		throw new Error(`Error sending password reset success email: ${error}`);
	}
};
