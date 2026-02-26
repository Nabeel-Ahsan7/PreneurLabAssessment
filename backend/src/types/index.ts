import { Request } from 'express';

export interface AuthPayload {
    userId: string;
    role: 'user' | 'admin';
}

export interface AuthRequest extends Request {
    user?: AuthPayload;
}
