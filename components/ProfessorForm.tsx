'use client';

import { saveProfessor } from '@/app/actions/professorActions';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MultiSelect } from '@/components/ui/multi-select';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { professorSchema } from '@/lib/schemas/professorSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';


type ProfessorFormData = z.infer<typeof professorSchema>;

const daysOfWeek = [
    { value: '0', label: 'شنبه' },
    { value: '1', label: 'یک‌شنبه' },
    { value: '2', label: 'دوشنبه' },
    { value: '3', label: 'سه‌شنبه' },
    { value: '4', label: 'چهارشنبه' },
    { value: '5', label: 'پنج‌شنبه' },
    { value: '6', label: 'جمعه' },
];

const defaultValues: ProfessorFormData = {
    name: '',
    days: [],
    mobile: '',
    nationalCode: '',
    preferDays: [],
    courses: [],
};

interface IProps {
    courses: { id: string, name: string }[];
}

export default function ProfessorForm({ courses }: IProps) {
    const [schedule, setSchedule] = useState([{ day: '0', startTime: '', endTime: '' }]);
    const formHook = useForm<ProfessorFormData>({
        resolver: zodResolver(professorSchema),
        defaultValues: {
            ...defaultValues,
            days: schedule,
        },
    });
    const { handleSubmit, watch } = formHook;

    const { toast } = useToast();

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const addDay = () => setSchedule([...schedule, { day: '0', startTime: '', endTime: '' }]);

    const onSubmit = async (data: ProfessorFormData) => {
        setIsLoading(true);

        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('nationalCode', data.nationalCode ?? '');
        formData.append('mobile', data.mobile ?? '');
        formData.append('days', JSON.stringify(data.days));
        formData.append('preferDays', JSON.stringify(data.preferDays));
        formData.append('courses', JSON.stringify(data.courses));

        console.log({ data });

        const result = await saveProfessor(formData);

        toast({
            variant: result.success ? 'default' : 'destructive',
            description: result.message,
        });
        setIsLoading(false);

        if (result.success) {
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        }
    };

    const days = watch('days');

    const preferDaysOptions = Array.from(
        new Set(days?.map(s => s.day)),
    ).map(d => daysOfWeek.find(w => w.value === d)!);

    return (
        <Form {...formHook}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5 w-full max-w-lg p-4'>
                <FormField
                    control={formHook.control}
                    name='name'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>نام و نام خانوادگی استاد</FormLabel>
                            <FormControl>
                                <Input placeholder='نام و نام خانوادگی استاد' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className='flex flex-col gap-3'>

                    <div className='flex flex-col md:flex-row w-full gap-5 items-baseline'>
                        <FormField
                            control={formHook.control}
                            name='nationalCode'
                            render={({ field }) => (
                                <FormItem className='w-full'>
                                    <FormLabel>کد ملی</FormLabel>
                                    <FormControl>
                                        <Input placeholder='کد ملی' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={formHook.control}
                            name='mobile'
                            render={({ field }) => (
                                <FormItem className='w-full'>
                                    <FormLabel>شماره موبایل</FormLabel>
                                    <FormControl>
                                        <Input placeholder='شماره موبایل' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <p className='w-full text-gray-500 text-sm'>وارد کردن حداقل یکی از موارد شماره موبایل یا کد ملی
                        اجباری است.</p>
                </div>

                <FormField
                    control={formHook.control}
                    name='courses'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>درس های قابل ارائه استاد</FormLabel>
                            <FormControl>
                                <MultiSelect
                                    placeholder='درس های قابل ارائه استاد'
                                    options={courses.map(c => ({ value: c.id, label: c.name }))}
                                    onValueChange={(value) => field.onChange(value)}
                                    variant='inverted'
                                    selectAllOption={false}
                                    animation={2}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className='w-full flex flex-col gap-4'>
                    <FormLabel className='font-bold'>انتخاب روزهای حضور استاد</FormLabel>
                    <div className='w-full flex flex-col gap-5'>
                        {schedule.map((s, index) => (
                            <div key={index}
                                 className='w-full flex flex-col md:flex-row gap-x-3 gap-y-5 items-baseline'>
                                <FormField
                                    control={formHook.control}
                                    name={`days.${index}.day`}
                                    render={({ field }) => (
                                        <div className='w-full flex flex-col gap-3'>
                                            <FormLabel>انتخاب روز</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder='انتخاب روز' />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>انتخاب روز</SelectLabel>
                                                        {daysOfWeek.map(day => (
                                                            <SelectItem
                                                                key={day.value}
                                                                value={day.value}
                                                            >
                                                                {day.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </div>
                                    )}
                                />
                                <FormField
                                    control={formHook.control}
                                    name={`days.${index}.startTime`}
                                    render={({ field }) => (
                                        <FormItem className='w-full'>
                                            <FormLabel>ساعت شروع</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder='08:00'
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={formHook.control}
                                    name={`days.${index}.endTime`}
                                    render={({ field }) => (
                                        <FormItem className='w-full'>
                                            <FormLabel>ساعت پایان</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder='10:30'
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        ))}
                    </div>
                    <Button
                        className='self-end justify-self-end w-fit'
                        type='button'
                        variant='secondary'
                        onClick={addDay}
                    >
                        افزودن روز
                    </Button>
                </div>

                <FormField
                    control={formHook.control}
                    name='preferDays'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>روزهای ترجیحی استاد</FormLabel>
                            <FormControl>
                                <MultiSelect
                                    placeholder='روزهای ترجیحی استاد'
                                    options={preferDaysOptions}
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    variant='inverted'
                                    selectAllOption={false}
                                    animation={2}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button
                    disabled={isLoading}
                    type='submit'
                    variant='default'
                >
                    {isLoading && 'در حال بررسی اطلاعات ...'}
                    {!isLoading && 'ثبت اطلاعات'}
                </Button>
            </form>
        </Form>
    );
}
