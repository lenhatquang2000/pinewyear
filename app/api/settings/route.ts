import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const settingsPath = path.join(process.cwd(), 'data', 'settings.json');

// Ensure data directory exists
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

export async function GET() {
    try {
        if (!fs.existsSync(settingsPath)) {
            return NextResponse.json({
                countdownStart: 10,
                familyWish: "Chúc bạn một năm mới đong đầy hạnh phúc, trọn vẹn bình an và luôn tỏa sáng với những đam mê của chính mình!",
                familyImage: "https://images.unsplash.com/photo-1546271027-3367f08df1e5?q=80&w=1000&auto=format&fit=crop"
            });
        }
        const data = fs.readFileSync(settingsPath, 'utf8');
        return NextResponse.json(JSON.parse(data));
    } catch (error) {
        return NextResponse.json({ error: 'Failed to read settings' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        fs.writeFileSync(settingsPath, JSON.stringify(body, null, 2), 'utf8');
        return NextResponse.json({ message: 'Settings saved successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
    }
}
