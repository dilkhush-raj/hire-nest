import {CookieOptions, Request, Response} from 'express';
import {isValidEmail, isValidPassword} from '../utils';
import {User} from '../models';
import {sendEmail} from '../services/index';
interface EmailPayload {
  from: string;
  to: string;
  subject: string;
  html: string;
  text: string;
}

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

  const employeeCounts = parseInt(req.body.employeeCount);

  if (employeeCounts < 0) {
    return res.status(400).json({error: 'Invalid employee count'});
  }

  // Create new user
  const newUser = await User.create({
    name: name,
    email: formattedEmail,
    password: password,
    phoneNumber: phoneNumber,
    companyName: companyName,
    employeeCount: employeeCounts,
  });

  // Retrieve created user
  const user = await User.findById(newUser._id).select('-password');

  if (!user) {
    return res.status(500).json({error: 'Failed to retrieve created user'});
  }

  // Send welcome email
  try {
    await sendEmail({
      from: `Hire Nest <${process.env.EMAIL}>`,
      to: email,
      subject: 'Welcome to Hire Nest — let’s get you started!',
      html: `Welcome to Hire Nest, ${name}! 🎉`,
      text: `Welcome to Hire Nest, ${name}! 🎉`,
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

const loginUser = async (req: Request, res: Response) => {
  const {email, password} = req.body;

  const validateEmailAndPassword = async (email: string, password: string) => {
    if (!email?.trim()) {
      return res.status(400).json({error: 'Missing email'});
    }

    if (!password?.trim()) {
      return res.status(400).json({error: 'Missing password'});
    }

    const formattedEmail = email.toLowerCase().trim();

    if (!isValidEmail(formattedEmail)) {
      return res.status(400).json({error: 'Invalid email format'});
    }

    return formattedEmail;
  };

  const formattedEmail = await validateEmailAndPassword(email, password);

  // Find user by email
  const user = await User.findOne({email: formattedEmail});

  if (!user) {
    return res.status(401).json({error: 'Invalid email or password'});
  }

  // @ts-ignore
  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    return res.status(401).json({error: 'Invalid email or password'});
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
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        companyName: user.companyName,
        employeeCount: user.employeeCount,
        phoneNumberVerified: user.phoneNumberVerified,
        emailVerified: user.emailVerified,
        blocked: user.blocked,
      },
    });
};

const logOutUser = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const {_id} = req.user;
    const user = await User.findByIdAndUpdate(
      _id,
      {
        $unset: {refreshToken: 1},
      },
      {new: true}
    );

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .clearCookie('accessToken', options)
      .clearCookie('refreshToken', options)
      .json({
        status: 'success',
        user: null,
      });
  } catch (error) {
    return res.status(500).json({error: 'Failed to log out user'});
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const {email} = req.body;
    // @ts-ignore
    const currentUser = req.user;

    const isAdmin = currentUser.role === 'admin' || currentUser.role === 'hr';
    const isDeletingSelf = email === currentUser.email;

    if (!isAdmin && !isDeletingSelf) {
      return res
        .status(403)
        .json({error: 'You are not authorized to delete this user'});
    }

    const formattedEmail = email.toLowerCase().trim();

    if (!isValidEmail(formattedEmail)) {
      return res.status(400).json({error: 'Invalid email format'});
    }

    const user = await User.findOne({email: formattedEmail});

    if (!user) {
      return res.status(404).json({error: 'User not found'});
    }

    await User.deleteOne({email: formattedEmail});

    return res
      .status(200)
      .json({success: true, message: 'User deleted successfully'});
  } catch (error) {
    return res.status(500).json({error: 'Failed to delete user'});
  }
};

const changePassword = async (req: Request, res: Response) => {
  // @ts-ignore
  const email = req.user.email;
  const {password} = req.body;

  const formattedEmail = email.toLowerCase().trim();

  if (!isValidEmail(formattedEmail)) {
    return res.status(400).json({error: 'Invalid email format'});
  }

  const user = await User.findOne({email: formattedEmail});

  if (!user) {
    return res.status(404).json({error: 'User not found'});
  }

  if (!isValidPassword(password)) {
    return res.status(400).json({error: 'Invalid password format'});
  }

  user.password = password;
  await user.save();

  return res
    .status(200)
    .json({success: true, message: 'Password changed successfully'});
};

const isLoggedIn = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const {_id} = req.user;

    if (!_id) {
      return res.status(200).json({success: false, message: 'User not found'});
    }

    const user = await User.findById(_id).select('-password');

    if (!user) {
      return res.status(200).json({success: false, message: 'User not found'});
    }

    return res.status(200).json({success: true, user});
  } catch (error) {
    return res
      .status(500)
      .json({error: 'Failed to check if user is logged in'});
  }
};
interface JobDetails {
  jobTitle: string;
  jobDescription: string;
  experienceLevel: string;
  candidates: string[]; // Array of email strings
  endDate: string;
}

const sendEmailToCandidates = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      jobTitle,
      jobDescription,
      experienceLevel,
      candidates,
      endDate,
    }: JobDetails = req.body;

    // @ts-ignore
    const {email, name} = req?.user;

    if (
      !jobTitle ||
      !jobDescription ||
      !experienceLevel ||
      !candidates ||
      !endDate
    ) {
      res.status(400).json({error: 'Missing required fields'});
      return;
    }

    const emailPromises = candidates.map(async (email: string) => {
      const emailPayload: EmailPayload = {
        from: `Hire Nest <${process.env.EMAIL}>`,
        to: email,
        subject: `Job Opportunity: ${jobTitle} at Hire Nest`,
        html: `
          <h1>Job Opportunity: ${jobTitle}</h1>
          <p><strong>Description:</strong> ${jobDescription}</p>
          <p><strong>Experience Level:</strong> ${experienceLevel}</p>
          <p><strong>Last Date to Apply:</strong> ${new Date(endDate).toLocaleDateString()}</p>
          <p>If you're interested, please apply before the deadline.</p>
          <p>This job posting is brought to you by ${name}, for further inquiries, please contact at ${email}.</p>
        `,
        text: `
          Job Opportunity: ${jobTitle}
          Description: ${jobDescription}
          Experience Level: ${experienceLevel}
          Last Date to Apply: ${new Date(endDate).toLocaleDateString()}
          
          If you're interested, please apply before the deadline.

          This job posting is brought to you by ${name}, for further inquiries, please contact at ${email}.
        `,
      };

      try {
        await sendEmail(emailPayload);
        return {email, status: 'sent'};
      } catch (error) {
        console.error(`Failed to send email to ${email}:`, error);
        return {email, status: 'failed'};
      }
    });

    const results = await Promise.all(emailPromises);

    const successfulEmails = results.filter(
      (result) => result.status === 'sent'
    );
    const failedEmails = results.filter((result) => result.status === 'failed');

    res.status(200).json({
      message: 'Email sending process completed',
      successful: successfulEmails.length,
      failed: failedEmails.length,
      failedEmails: failedEmails.map((result) => result.email),
    });
  } catch (error) {
    console.error('Error in sendEmailToCandidates:', error);
    res.status(500).json({error: 'Internal server error while sending emails'});
  }
};

export {
  registerUser,
  loginUser,
  logOutUser,
  deleteUser,
  changePassword,
  isLoggedIn,
  sendEmailToCandidates,
};
