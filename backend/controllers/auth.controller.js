import bcryptjs from "bcryptjs";
import crypto from "crypto";

import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import {
	sendPasswordResetEmail,
	sendResetSuccessEmail,
	sendVerificationEmail,
	sendWelcomeEmail,
} from "../mailtrap/emails.js";

import { sql } from "../config/db.js";

export const signup = async (req, res) => {
	const { email, password, name } = req.body;

	try {
		if (!email || !password || !name) {
			throw new Error("All fields are required");
		}
		const userAlreadyExists = await sql`
		SELECT * FROM users WHERE email=${email}
	   `;
		//const userAlreadyExists = await User.findOne({ email });
		//console.log("email: ", email);
		//console.log("userAlreadyExists", userAlreadyExists);

		if (userAlreadyExists.length > 0) {
			return res.status(400).json({ success: false, message: "User already exists" });
		}

		const hashedPassword = await bcryptjs.hash(password, 10);
		const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

		//const user = new User({
		//	email,
		//	password: hashedPassword,
		//	name,
		//	verificationToken,
		//	verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
		//});

		//await user.save();
		//console.log("timestamp ", Date.now());
		const user = await sql`
		INSERT INTO users (email, password, name, verificationtoken, verificationtokenexpiresat)
		VALUES (${email},${hashedPassword},${name},${verificationToken}, now()+ '24 hours'::interval)
		RETURNING *
	    `;
		//console.log("user created ", user);
		//console.log("user[0].id ", user[0].id);
		//console.log("user[0].email ", user[0].email);
		//console.log("user[0]._doc ", user[0]._doc);
		// jwt
		generateTokenAndSetCookie(res, user[0].id);

		await sendVerificationEmail(user[0].email, verificationToken);

		res.status(201).json({
			success: true,
			message: "User created successfully",
			user: {
				...user[0]._doc,
				password: undefined,
			},
		});
	} catch (error) {
		res.status(400).json({ success: false, message: error.message });
	}
};

export const verifyEmail = async (req, res) => {
	const { code } = req.body;
	try {
//		const user = await User.findOne({
//			verificationToken: code,
//			verificationTokenExpiresAt: { $gt: Date.now() },
//		});
		const user = await sql`
		SELECT * FROM users WHERE verificationToken=${code} AND verificationTokenExpiresAt > now()
		`;

		if (user.length === 0) {
			// User not found or token expired
			return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
		}

		user[0].isVerified = true;
		user[0].verificationToken = undefined;
		user[0].verificationTokenExpiresAt = undefined;
		//await user.save();
		const updateUsers = await sql`
		UPDATE users
		SET name=${user[0].name}, isVerified=${user[0].isVerified}, verificationtoken=NULL, verificationtokenexpiresat=NULL
		WHERE id=${user[0].id}
		RETURNING *
	  `;
		if (updateUsers.length === 0) {
			return res.status(400).json({ success: false, message: "User not found" });
		}
		//console.log("updateUsers ", updateUsers);
		// send welcome email

		await sendWelcomeEmail(user[0].email, user[0].name);

		res.status(200).json({
			success: true,
			message: "Email verified successfully",
			user: { isVerified: user[0].isVerified, id: user[0].id, email: user[0].email, name: user[0].name },
			//user: {
			//	...user[0]._doc,
			//	password: undefined,
			//},

		});
	} catch (error) {
		console.log("error in verifyEmail ", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

export const login = async (req, res) => {
	const { email, password } = req.body;
	try {
		//const user = await User.findOne({ email });
		const user = await sql`
				SELECT * FROM users WHERE email=${email}
		`;
		if (user.length === 0) {
			return res.status(400).json({ success: false, message: "Invalid credentials" });
		}
		const isPasswordValid = await bcryptjs.compare(password, user[0].password);
		if (!isPasswordValid) {
			return res.status(400).json({ success: false, message: "Invalid credentials" });
		}

		generateTokenAndSetCookie(res, user[0].id);

//		user.lastLogin = new Date();
//		await user.save();
		const updateUsers = await sql`
		UPDATE users
		SET lastlogin = now()
		WHERE id=${user[0].id}
		RETURNING *
	  `;
		if (updateUsers.length === 0) {
			return res.status(400).json({ success: false, message: "User not found" });
		}
		//console.log("updateUsers ", updateUsers);
		//console.log("User data:", user[0]);

		res.status(200).json({
			success: true,
			message: "Logged in successfully",
			user: {
				...user[0]._doc,
				password: undefined,
			},
		});
	} catch (error) {
		console.log("Error in login ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

export const logout = async (req, res) => {
	res.clearCookie("token");
	res.status(200).json({ success: true, message: "Logged out successfully" });
};

export const forgotPassword = async (req, res) => {
	const { email } = req.body;
	try {
		//const user = await User.findOne({ email });
		const user = await sql`
				SELECT * FROM users WHERE email=${email}
		`;
		if (user.length === 0) {
			return res.status(400).json({ success: false, message: "User not found" });
		}

		// Generate reset token
		const resetToken = crypto.randomBytes(20).toString("hex");
		const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

		//user.resetPasswordToken = resetToken;
		//user.resetPasswordExpiresAt = resetTokenExpiresAt;

		//await user.save();
		const updateUsers = await sql`
		UPDATE users
		SET resetpasswordtoken=${resetToken}, resetpasswordexpiresat=now() + '1 hour'::interval
		WHERE id=${user[0].id}
		RETURNING *
	  `;
		if (updateUsers.length === 0) {
			return res.status(400).json({ success: false, message: "User not found" });
		}
		//console.log("updateUsers ", updateUsers);

		// send email
		await sendPasswordResetEmail(user[0].email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

		res.status(200).json({ success: true, message: "Password reset link sent to your email" });
	} catch (error) {
		console.log("Error in forgotPassword ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

export const resetPassword = async (req, res) => {
	try {
		const { token } = req.params;
		const { password } = req.body;

		//const user = await User.findOne({
		//	resetPasswordToken: token,
		//	resetPasswordExpiresAt: { $gt: Date.now() },
		//});
		const user = await sql`
				SELECT * FROM users 
				WHERE resetPasswordToken =  ${token}
				AND resetPasswordExpiresAt > now()
		`;
		if (user.length === 0) {
			return res.status(400).json({ success: false, message: "User not found" });
		}


		//if (!user) {
		//	return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
		//}

		// update password
		const hashedPassword = await bcryptjs.hash(password, 10);

		//user.password = hashedPassword;
		//user.resetPasswordToken = undefined;
		//user.resetPasswordExpiresAt = undefined;
		//await user.save();


		const updateUsers = await sql`
		UPDATE users
		SET 
			password = ${hashedPassword},
			resetpasswordtoken= null,
		    resetpasswordexpiresat=null
		WHERE id=${user[0].id}
		RETURNING *
	  `;
		if (updateUsers.length === 0) {
			return res.status(400).json({ success: false, message: "User not found" });
		}
		console.log("updateUsers ", updateUsers);


		await sendResetSuccessEmail(user[0].email);

		res.status(200).json({ success: true, message: "Password reset successful" });
	} catch (error) {
		console.log("Error in resetPassword ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

export const checkAuth = async (req, res) => {
	try {
		//const user = await User.findById(req.userId).select("-password");
		console.log('checkAuth ');
		const user = await sql`SELECT * FROM users WHERE id = ${req.userId}`;		
		//const user = null
		if (!user) {
			return res.status(400).json({ success: false, message: "User not found" });
		}

		res.status(200).json({ success: true, user });
	} catch (error) {
		console.log("Error in checkAuth ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};
