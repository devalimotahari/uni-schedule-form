import { z } from 'zod';

export const professorSchema = z.object({
    name: z.string().min(1, "لطفا نام را وارد کنید."),
    nationalCode: z.string().optional(),
    mobile: z.string().optional(),
    preferDays: z.array(z.number()).min(1, "حداقل یک روز به عنوان روز ترجیحی انتخاب کنید."),
    courses: z.array(z.string()).min(1, "حداقل یک درس انتخاب کنید."),
    days: z.array(
        z.object({
            day: z.number().min(0).max(6, "روز باید بین ۰ (شنبه) تا ۶ (جمعه) باشد."),
            startTime: z.string().regex(/^\d{2}:\d{2}$/, "فرمت ساعت صحیح نمی‌باشد."),
            endTime: z.string().regex(/^\d{2}:\d{2}$/, "فرمت ساعت صحیح نمی‌باشد.")
        })
    ).min(1, "At least one day schedule is required")
}).refine((data) => data.nationalCode || data.mobile, {
    message: "لطفا کدملی یا موبایل را وارد نمایید (وارد کردن حداقل یکی از آنها اجباریست)",
    path: ["nationalCode", "mobile"],
});