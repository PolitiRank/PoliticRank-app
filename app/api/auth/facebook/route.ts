import { NextResponse } from 'next/server';

const APP_ID = process.env.APP_ID_META;
const REDIRECT_URI = 'http://localhost:3000/api/auth/facebook/callback';
// const SCOPE = 'pages_show_list,instagram_basic,instagram_manage_insights,pages_read_engagement';
const SCOPE = 'public_profile'; // Absolute minimum to test connection

export async function GET() {
    if (!APP_ID) {
        return NextResponse.json({ error: 'Missing APP_ID_META env var' }, { status: 500 });
    }

    const url = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${APP_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPE}&response_type=code`;

    return NextResponse.redirect(url);
}
