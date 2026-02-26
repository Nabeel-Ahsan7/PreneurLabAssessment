import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import config from '../config';
import { AuthPayload, AuthRequest } from '../types';

/** Generate JWT access token (short-lived) */
const generateAccessToken = (payload: AuthPayload): string => {
    return jwt.sign(payload, config.jwtAccessSecret, {
        expiresIn: config.jwtAccessExpiry as any,
    });
};

/** Generate JWT refresh token (long-lived) */
const generateRefreshToken = (payload: AuthPayload): string => {
    return jwt.sign(payload, config.jwtRefreshSecret, {
        expiresIn: config.jwtRefreshExpiry as any,
    });
};

/** POST /auth/register */
export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            res.status(400).json({ message: 'Name, email, and password are required.' });
            return;
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(409).json({ message: 'Email already registered.' });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role === 'admin' ? 'admin' : 'user',
        });

        const payload: AuthPayload = { userId: user._id.toString(), role: user.role };
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        user.refreshToken = refreshToken;
        await user.save();

        res.status(201).json({
            message: 'Registration successful.',
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
            accessToken,
            refreshToken,
        });
    } catch (error: any) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};

/** POST /auth/login */
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ message: 'Email and password are required.' });
            return;
        }

        const user = await User.findOne({ email });
        if (!user) {
            res.status(401).json({ message: 'Invalid email or password.' });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ message: 'Invalid email or password.' });
            return;
        }

        const payload: AuthPayload = { userId: user._id.toString(), role: user.role };
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        user.refreshToken = refreshToken;
        await user.save();

        res.json({
            message: 'Login successful.',
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
            accessToken,
            refreshToken,
        });
    } catch (error: any) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};

/** POST /auth/refresh-token */
export const refreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
        const { refreshToken: token } = req.body;

        if (!token) {
            res.status(400).json({ message: 'Refresh token is required.' });
            return;
        }

        let decoded: AuthPayload;
        try {
            decoded = jwt.verify(token, config.jwtRefreshSecret) as AuthPayload;
        } catch {
            res.status(401).json({ message: 'Invalid or expired refresh token.' });
            return;
        }

        const user = await User.findById(decoded.userId);
        if (!user || user.refreshToken !== token) {
            res.status(401).json({ message: 'Invalid refresh token.' });
            return;
        }

        const payload: AuthPayload = { userId: user._id.toString(), role: user.role };
        const newAccessToken = generateAccessToken(payload);
        const newRefreshToken = generateRefreshToken(payload);

        user.refreshToken = newRefreshToken;
        await user.save();

        res.json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        });
    } catch (error: any) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};

/** POST /auth/logout */
export const logout = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (req.user) {
            await User.findByIdAndUpdate(req.user.userId, { refreshToken: null });
        }
        res.json({ message: 'Logged out successfully.' });
    } catch (error: any) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};
