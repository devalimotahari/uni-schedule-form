import { sql } from '@vercel/postgres';
import { timeAgo } from '@/lib/utils';
import { notFound } from 'next/navigation';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export default async function Table({ params }: { params: Promise<{ secret: string }> }) {
    const { secret } = await params;
    if (secret !== process.env.LIST_SECRET) {
        return notFound();
    }

    const startTime = Date.now();

    const data = await sql`SELECT * FROM professors`;

    const { rows: professors } = data;

    for (let professor of professors) {
        const coursesQuery = await sql.query(
            `SELECT * FROM courses WHERE id = ANY($1)`,
            [professor.courses],
        );
        professor['coursesItems'] = coursesQuery.rows;
    }

    const duration = Date.now() - startTime;

    return (
        <div
            style={{ direction: 'ltr' }}
            className='bg-white/30 p-12 shadow-xl ring-1 ring-gray-900/5 rounded-lg backdrop-blur-lg max-w-xl mx-auto w-full'>
            <div className='flex justify-between items-center mb-4'>
                <div className='space-y-1'>
                    <h2 className='text-xl font-semibold'>Professors</h2>
                    <p className='text-sm text-gray-500'>
                        Fetched {professors.length} professors in {duration}ms
                    </p>
                </div>
            </div>
            <div className='divide-y divide-gray-900/5'>
                {professors.map((professor) => (
                    <div
                        key={professor.id}
                        className='flex items-center justify-between py-3'
                    >
                        <div className='flex items-center space-x-4'>
                            <div className='space-y-1'>
                                <p className='font-medium leading-none'>{professor.name}</p>
                                <p className='text-sm text-gray-500'>{professor.mobile ?? professor.national_code}</p>
                                <p className='font-bold'>days:</p>
                                <p>
                                    {JSON.stringify(professor.days)}
                                </p>
                                <p className='font-bold'>courses</p>
                                {professor.coursesItems?.map((c: any) =>
                                    <p key={c.id}>
                                        {c.name}
                                    </p>,
                                )}
                            </div>
                        </div>
                        <p className='text-sm text-gray-500'>{timeAgo(professor.createdAt)}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
