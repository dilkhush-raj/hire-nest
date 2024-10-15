import {CookieOptions, Request, Response} from 'express';
import {isValidEmail, isValidPassword} from '../utils';
import {User} from '../models';
import {sendEmail} from '../services/index';

const generateAccessAndRefreshToken = async (userId: string) => {
  try {
    const user = await User.findById(userId);
    // @ts-ignore
    const accessToken = await user.generateAccessToken();
    // @ts-ignore
    const refreshToken = await user.generateRefreshToken();
    // @ts-ignore
    user.refreshToken = refreshToken;
    // @ts-ignore
    await user.save({validateBeforeSave: false});

    return {accessToken, refreshToken};
  } catch (error) {
    console.error('Failed to generate access and refresh token:', error);
    return {accessToken: null, refreshToken: null};
  }
};

const registerUser = async (req: Request, res: Response) => {
  const {name, email, password, phoneNumber, companyName, employeeCount} =
    req.body;

  const validateRequest = async (
    email: string,
    name: string,
    password: string,
    phoneNumber: string,
    companyName: string,
    employeeCount: number
  ) => {
    if (
      [name, email, password, phoneNumber, companyName].some(
        (field) => !field?.trim()
      )
    ) {
      return res.status(400).json({error: 'Missing required fields'});
    }

    if (employeeCount < 0) {
      return res.status(400).json({error: 'Invalid employee count'});
    }

    const formattedEmail = email.toLowerCase().trim();

    if (!isValidEmail(formattedEmail)) {
      return res.status(400).json({error: 'Invalid email format'});
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({error: 'Invalid password format'});
    }

    return formattedEmail;
  };

  const formattedEmail = await validateRequest(
    email,
    name,
    password,
    phoneNumber,
    companyName,
    employeeCount
  );

  // Check if user already exists
  const existingUser = await User.findOne({email: formattedEmail});

  if (existingUser) {
    return res.status(409).json({error: 'User already exists'});
  }

  // Create new user
  const newUser = await User.create({
    name: name,
    email: formattedEmail,
    password: password,
    phoneNumber: phoneNumber,
    companyName: companyName,
    employeeCount: employeeCount,
  });

  // Retrieve created user
  const user = await User.findById(newUser._id).select('-password');

  if (!user) {
    return res.status(500).json({error: 'Failed to retrieve created user'});
  }

  // Send welcome email
  try {
    await sendEmail({
      from: `PSQUARE <${process.env.EMAIL}>`,
      to: email,
      subject: 'Welcome to PSQUARE — let’s get you started!',
      html: `Welcome to PSQUARE, ${name}! 🎉`,
    });
  } catch (error) {
    console.error('Failed to send welcome email:', error);
  }

  const {accessToken, refreshToken} = await generateAccessAndRefreshToken(
    user._id.toString()
  );

  const options: CookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  };

  return res
    .status(200)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .json({
      status: 'success',
      user,
    });
};

export {registerUser};
