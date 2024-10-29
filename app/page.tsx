import ProfessorForm from '@/components/ProfessorForm';
import { sql } from '@vercel/postgres';

export const runtime = 'edge';
export const preferredRegion = 'home';
export const dynamic = 'force-dynamic';

export default async function Home() {

    const courses = await sql`
        SELECT * FROM courses
    `;

    return (
        <main className='relative flex min-h-screen flex-col items-center justify-center'>
            <ProfessorForm courses={courses.rows as { id: string, name: string }[]} />
        </main>
    );
}
