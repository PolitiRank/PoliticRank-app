import { NextResponse } from 'next/server';
import axios from 'axios';

const APP_ID = process.env.APP_ID_META;
const APP_SECRET = process.env.APP_SECRET_META;
const REDIRECT_URI = 'http://localhost:3000/api/auth/facebook/callback';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const errorReason = searchParams.get('error_reason');
    const errorMessage = searchParams.get('error_message');
    const errorDescription = searchParams.get('error_description');

    if (error || errorReason || errorMessage) {
        return NextResponse.json({
            error: 'Facebook Login Failed',
            details: error || errorReason || errorMessage || errorDescription,
            debug: { error, errorReason, errorMessage, errorDescription }
        }, { status: 400 });
    }

    if (!code) {
        return NextResponse.json({ error: 'No code provided' }, { status: 400 });
    }

    try {
        // 1. Exchange Code for Short-Lived Token
        const tokenRes = await axios.get('https://graph.facebook.com/v19.0/oauth/access_token', {
            params: {
                client_id: APP_ID,
                client_secret: APP_SECRET,
                redirect_uri: REDIRECT_URI,
                code: code,
            },
        });

        const shortToken = tokenRes.data.access_token;

        // 2. Exchange for Long-Lived Token
        const longTokenRes = await axios.get('https://graph.facebook.com/v19.0/oauth/access_token', {
            params: {
                grant_type: 'fb_exchange_token',
                client_id: APP_ID,
                client_secret: APP_SECRET,
                fb_exchange_token: shortToken,
            },
        });

        const longToken = longTokenRes.data.access_token;

        // TODO: Save to database
        console.log('---------------------------------------------------');
        console.log('✅ LONG LIVED TOKEN RECEIVED:');
        console.log(longToken);
        console.log('---------------------------------------------------');

        return NextResponse.json({
            message: 'Authentication Successful!',
            longLivedToken: longToken
        });

    } catch (error: any) {
        console.error('Login Error:', error.response?.data || error.message);
        return NextResponse.json({
            error: 'Authentication failed',
            details: error.response?.data || error.message
        }, { status: 500 });
    }
}
