'use server';

import { v4 as uuidv4 } from 'uuid';
import { professorSchema } from '@/lib/schemas/professorSchema';
import { sql } from '@vercel/postgres';

export async function saveProfessor(formData: FormData) {
    try {
        const professorData = {
            name: formData.get('name') as string,
            nationalCode: formData.get('nationalCode') as string,
            mobile: formData.get('mobile') as string,
            preferDays: formData.getAll('preferDays').map(Number),
            days: JSON.parse(formData.get('days') as string),
            courses: formData.getAll('courses'),
        };

        const validatedData = professorSchema.parse(professorData);

        await sql.query(
            'INSERT INTO professors (id, name, national_code, mobile, prefer_days, days, courses) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [uuidv4(), validatedData.name, validatedData.nationalCode, validatedData.mobile, validatedData.preferDays, JSON.stringify(validatedData.days), validatedData.courses],
        );

        return { success: true, message: 'اطلاعات با موفقیت ثبت شد.' };
    } catch (error) {
        console.error('Error saving professor:', error);
        return { success: false, message: 'متاسفانه مشکلی در ذخیره اطلاعات پیش آمده است.' };
    }
}