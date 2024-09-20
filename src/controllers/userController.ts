import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import UserModel from '../models/userModel';
import { User } from '../types/types';
import { CustomError } from '../utils/customError';
dotenv.config();

export const createUser = async (req: Request, res: Response) => {
  try {
    const user = req.body;
    const strongPassword = await bcrypt.hash(user?.password, 13);

    const newUser = new UserModel({
      ...user,
      password: strongPassword,
    });

    const result = await newUser.save();

    res.status(201).send({
      success: true,
      message: 'Successfully Registered!',
      data: result,
    });
  } catch (error) {
    if ((error as CustomError).status === 11000) {
      return res.status(400).send({
        success: false,
        message: 'Registration Failed! Email Already Exists!',
      });
    } else {
      console.log(
        `This error happened during registration: ${(error as Error).message}`
      );
      return res.status(500).send({
        success: false,
        message: (error as Error).message || 'Registration Error',
      });
    }
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await UserModel.findOne({ email });
    if (!result) {
      return res
        .status(400)
        .send({ success: false, message: 'User not found!' });
    }
    const isMatch = await bcrypt.compare(password, (result as User).password);
    if (!isMatch) {
      return res
        .status(400)
        .send({ success: false, message: 'Invalid credentials', error: true });
    }

    const token = jwt.sign({ email }, process.env.ACCESS_TOKEN as string, {
      expiresIn: '1h',
    });

    res.status(200).send({
      data: result,
      token,
      success: true,
      message: 'Successfully Logged In',
    });
  } catch (error) {
    console.log('Getting login error:', (error as Error).message);
    res.status(500).send({
      status: false,
      message: (error as Error).message || 'Something went wrong',
    });
  }
};

export const getAllUser = async (req: Request, res: Response) => {
  try {
    const users = await UserModel.find({});
    res.status(200).send({
      success: true,
      data: users,
    });
  } catch (error) {
    console.log('Getting user error:', (error as Error).message);
    res.status(500).send({
      status: false,
      message: (error as Error).message || 'Something went wrong',
    });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await UserModel.findOne({ email: req.params.email });
    if (!user)
      return res.status(404).send({
        success: false,
        message: 'User not found!',
      });
    res.status(200).send({
      success: true,
      data: user,
    });
  } catch (error) {
    console.log('Getting single user error', (error as Error).message);
    res.status(400).send({
      success: false,
      message: (error as Error).message || 'Something went wrong',
    });
  }
};

export const editUser = async (req: Request, res: Response) => {
  try {
    const user = req.body;
    const result = await UserModel.findOneAndUpdate(
      { email: req.params.email },
      {
        ...user,
        updated_at: Date.now(),
      },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!result)
      return res.status(404).send({
        success: false,
        message: 'User modification failed, User not found',
      });
    res.status(200).send({
      success: true,
      message: 'Successfully User Updated!',
      data: result,
    });
  } catch (error) {
    console.log('Getting error while updating', (error as Error).message);
    res.status(400).send({
      success: false,
      message: (error as Error).message || 'Something went wrong',
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const result = await UserModel.findOneAndDelete({
      email: req.params.email,
    });

    if (!result)
      return res.status(404).send({
        success: false,
        message: 'User delete failed, User not found',
      });
    res.status(200).send({
      success: true,
      message: 'Successfully User Deleted!',
    });
  } catch (error) {
    console.log('Getting error while deleting', (error as Error).message);
    res.status(400).send({
      success: false,
      message: (error as Error).message || 'Something went wrong',
    });
  }
};
