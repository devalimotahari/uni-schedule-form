import { z } from 'zod';

const required = { required_error: 'لطفا این فیلد را وارد نمایید.' };

export const professorSchema = z.object({
    name: z.string(required).min(1, 'لطفا نام را وارد کنید.'),
    nationalCode: z.string(required).optional(),
    mobile: z.string(required).optional(),
    preferDays: z.array(z.string(required)).min(1, 'حداقل یک روز به عنوان روز ترجیحی انتخاب کنید.'),
    courses: z.array(z.string(required)).min(1, 'حداقل یک درس انتخاب کنید.'),
    days: z.array(
        z.object({
            day: z.string(required),
            startTime: z.string(required).regex(/^\d{2}:\d{2}$/, 'فرمت ساعت صحیح نمی‌باشد.'),
            endTime: z.string(required).regex(/^\d{2}:\d{2}$/, 'فرمت ساعت صحیح نمی‌باشد.'),
        }),
    ).min(1, 'حداقل یک روز وارد نمایید'),
})
    .refine((data) => data.nationalCode || data.mobile, {
        message: 'لطفا کدملی یا موبایل را وارد نمایید (وارد کردن حداقل یکی از آنها اجباریست)',
        path: ['mobile'],
    })
    .refine((data) => !data.nationalCode || data.nationalCode.length === 10, {
        message: 'لطفا کدملی را به درستی وارد نمایید',
        path: ['nationalCode'],
    })
    .refine((data) => !data.mobile || data.mobile.length === 11, {
        message: 'لطفا شماره موبایل را به درستی وارد نمایید.',
        path: ['mobile'],
    });
