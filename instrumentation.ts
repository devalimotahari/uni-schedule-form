import { initialDB } from '@/lib/seed';

export async function register() {
    await initialDB();
}