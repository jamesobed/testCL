import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import {
  signUpSchema,
  updateUserSchema,
  options,
  generateToken,
  loginSchema,
  resetPasswordSchema,
  fogotPasswordSchema,
} from '../utils/utils';
import { userInstance } from '../model/userModel';
import bcrypt from 'bcryptjs';
import sendMails from './FILE/email/sendMails';
import { OrderInstance } from '../model/orderModel';

export async function registerUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, address, email, phoneNumber, password, avatar } = req.body;
    const validationResult = signUpSchema.validate(req.body, options);
    if (validationResult.error) {
      return res.status(400).json({
        Error: validationResult.error.details[0].message,
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const token = uuidv4();
    const document = new userInstance({
      name,
      address,
      email,
      phoneNumber,
      password: passwordHash,
      avatar:
        avatar || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7nG8OgXmMOXXiwbNOc-PPXUcilcIhCkS9BQ&usqp=CAU',
      isVerified: req.body.isVerified || false,
      token,
      role: req.body.role || 'user',
    });

    document.save((error: any) => {
      if (error) {
        if (error.code === 11000) {
          return res.status(401).json({ message: 'Email or phoneNumber is used, please take note and change them' });
        } else {
          return res.send(error.message);
        }
      } else {
        sendMails.verifyUserEmail(document.email, token);

        return res.status(201).send(document);
      }
    });
    // const record = await userInstance.create({
    //   name,
    //   address,
    //   email,
    //   phoneNumber,
    //   password: passwordHash,
    //   avatar:
    //     avatar || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7nG8OgXmMOXXiwbNOc-PPXUcilcIhCkS9BQ&usqp=CAU',
    //   isVerified: req.body.isVerified || false,
    //   token,
    //   role: req.body.role || 'user',
    // });
    // const link = `${process.env.BACKEND_URL}/user/verify/${token}`;

    // sendMails.verifyUserEmail(record.email, token);

    // return res.status(201).json({
    //   message: 'you have successfully registered',
    //   record,
    // });
  } catch (err) {
    return res.status(500).json({
      message: 'failed to register',
      route: '/register',
    });
  }
}

export async function verifyUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { token } = req.params;
    const user = await userInstance.findOne({ token });
    if (!user) {
      return res
        .status(404)
        .json({
          message: 'User not found',
        })
        .redirect(`${process.env.FRONTEND_URL}/${token}`);
    }

    if (user) {
      user.isVerified = true;
      user.token = 'null';
      await user.save();
      const id = user.id;
      return res.status(200).redirect(`${process.env.FRONTEND_URL}/login`);
    }
  } catch (err) {
    return res.status(500).json({
      message: 'failed to verify user',
      route: '/verify/:id',
    });
  }
}
export async function resendVerificationLink(req: Request, res: Response, next: NextFunction) {
  try {
    const validationResult = fogotPasswordSchema.validate(req.body, options);
    if (validationResult.error) {
      return res.status(400).json({
        Error: validationResult.error.details[0].message,
      });
    }
    const { email } = req.body;
    const user = await userInstance.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }
    if (user.isVerified) {
      return res.status(409).json({
        message: 'Email already verified',
      });
    }

    if (user) {
      const token = uuidv4();
      user.token = token ? token : user.token;

      await user.save();
      const email_response = await sendMails
        .resendVerificationLink(user.email, token)
        .then((email_response) => {
          return res.status(200).json({
            message: 'Verification link sent successfully',
            // token,
          });
        })
        .catch((err) => {
          res.status(500).json({
            message: 'Server error',
            err,
          });
        });
    }
  } catch (err) {
    return res.status(500).json({
      message: 'failed to resend verification link',
      route: '/resend-verification-link',
    });
  }
}
export async function updateUser(req: Request | any, res: Response, next: NextFunction) {
  try {
    const id = req.user.id;

    const record = await userInstance.findById(id);

    const { name, address, phoneNumber, avatar } = req.body;
    const validationResult = updateUserSchema.validate(req.body, options);

    if (validationResult.error) {
      return res.status(400).json({
        Error: validationResult.error.details[0].message,
      });
    }
    if (!record) {
      return res.status(404).json({
        message: 'cannot find user',
      });
    }

    record.name = name ? name : record.name;
    // record.address = address ? address : record.address;
    record.phoneNumber = phoneNumber ? phoneNumber : record.phoneNumber;
    record.phoneNumber = phoneNumber ? phoneNumber : record.phoneNumber;
    record.avatar = avatar ? avatar : record.avatar;
    record.role = req.body.role || 'user';

    await record.save();

    return res.status(202).json({
      message: 'successfully updated user details',
      update: record,
    });
  } catch (err) {
    return res.status(500).json({ message: 'failed to update user details, check image format', err });
  }
}
export async function userLogin(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    const validate = loginSchema.validate(req.body, options);
    if (validate.error) {
      return res.status(401).json({ Error: validate.error.details[0].message });
    }

    let validUser = (await userInstance.findOne({ email: email.toLowerCase() })) as unknown as {
      [key: string]: string;
    };

    if (!validUser) {
      return res.status(401).json({ message: 'User is not registered' });
    }
    const { id } = validUser;
    const token = generateToken({ id });
    const validatedUser = await bcrypt.compare(password, validUser.password);
    if (!validatedUser) {
      return res.status(401).json({ message: 'failed to login, wrong user email/password inputed' });
    }
    if (validUser.isVerified && validatedUser) {
      return res
        .cookie('jwt', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
        })
        .status(200)
        .json({
          message: 'Successfully logged in',
          id,
          token,
          user_info: {
            name: `${validUser.name} `,
            occupation: `${validUser.occupation}`,
            email: `${validUser.email}`,
            avatar: `${validUser.avatar}`,
          },
        });
    }
    return res.status(401).json({ message: 'Please verify your email' });
  } catch (error) {
    return res.status(500).json({ message: 'failed to login', route: '/login' });
  }
}
export async function forgetPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const validationResult = fogotPasswordSchema.validate(req.body, options);
    if (validationResult.error) {
      return res.status(400).json({
        Error: validationResult.error.details[0].message,
      });
    }
    const { email } = req.body;
    const user = await userInstance.findOne({ email });
    if (!user) {
      return res.status(409).json({
        message: 'User not found',
      });
    }
    const token = uuidv4();
    // const resetPasswordToken = await userInstance.({ token }, { where: { email } });
    user.token = token;
    await user.save();

    const email_response = await sendMails
      .forgotPassword(email, token)
      .then((email_response) => {
        return res.status(200).json({
          message: 'Reset password token sent to your email',
          token,
          email_response,
        });
      })
      .catch((err) => {
        res.status(500).json({
          message: 'Server error',
          err,
        });
      });
  } catch (err) {
    res.status(500).json({
      message: 'failed to send reset password token',
      route: '/forgetPassword',
    });
  }
}
export async function resetPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const validate = resetPasswordSchema.validate(req.body, options);
    if (validate.error) {
      return res.status(400).json({ Error: validate.error.details[0].message });
    }
    const user = await userInstance.findOne({ token });
    if (!user) {
      return res.status(404).json({
        message: 'Invalid Token',
      });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    user.password = passwordHash;
    user.token = 'null';
    await user.save();
    return res.status(202).json({
      message: 'Password reset successfully',
      user,
    });
  } catch (err) {
    return res.status(500).json({
      message: 'failed to reset password',
      route: '/resetPassword',
    });
  }
}
export async function userLogout(req: Request, res: Response, next: NextFunction) {
  try {
    return res.status(200).json({ message: 'successfully logged out' });

    if (req.cookies.jwt) {
      res.clearCookie('jwt');
      return res.status(200).json({ message: 'successfully logged out' });
    }
    return res.status(200).json({ message: 'successfully logged out' });
  } catch (err) {
    return res.status(500).json({ message: 'failed to logout' });
  }
}
export async function singleUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const user = await userInstance.findById(id).populate('tickets');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({ message: 'User found', user });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'failed to get user' });
  }
}

export async function allUsers(req: Request | any, res: Response, next: NextFunction) {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const page = parseInt(req.query.page) || 1;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const users = await userInstance
      .find({
        where: {
          role: 'user',
        },
      })
      .populate('tickets')
      .sort({ date: -1 })
      .skip(startIndex)
      .limit(limit)
      .exec();
    if (!users) {
      return res.status(404).json({ message: 'No users found' });
    }
    return res.status(200).json({
      message: 'Users found',
      users,
      currentPage: page,
      hasPreviousPage: startIndex > 0,
      hasNextPage: endIndex < (await userInstance.countDocuments().exec()),
      nextPage: page + 1,
      previousPage: page - 1,
      limit,
    });
  } catch (err) {
    return res.status(500).json({ message: 'failed to get users' });
  }
}
export async function deleteUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const user = await userInstance.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const deletedUser = await userInstance.findByIdAndDelete(id);
    return res.status(200).json({ message: 'User deleted', deletedUser });
  } catch (err) {
    return res.status(500).json({ message: 'failed to delete user' });
  }
}
