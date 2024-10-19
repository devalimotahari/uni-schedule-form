'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { saveProfessor } from '@/app/actions/professorActions';
import { professorSchema } from '@/lib/schemas/professorSchema';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
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

export default function ProfessorForm() {
    const formHook = useForm<ProfessorFormData>({
        resolver: zodResolver(professorSchema),
    });

    const { register, handleSubmit, formState: { errors }, setValue } = formHook;

    const [schedule, setSchedule] = useState([{ day: 0, startTime: '', endTime: '' }]);

    const addDay = () => setSchedule([...schedule, { day: 0, startTime: '', endTime: '' }]);

    const onSubmit = async (data: ProfessorFormData) => {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('nationalCode', data.nationalCode ?? '');
        formData.append('mobile', data.mobile ?? '');
        formData.append('preferDays', JSON.stringify(data.preferDays));
        formData.append('days', JSON.stringify(data.days));

        const result = await saveProfessor(formData);

        if (result.success) {
            alert(result.message);
        } else {
            alert(result.message);
        }
    };

    return (
        <Form {...formHook}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-8'>
                <FormField
                    control={formHook.control}
                    name='name'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>name</FormLabel>
                            <FormControl>
                                <Input placeholder='name' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={formHook.control}
                    name='nationalCode'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>nationalCode</FormLabel>
                            <FormControl>
                                <Input placeholder='nationalCode' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={formHook.control}
                    name='mobile'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>mobile</FormLabel>
                            <FormControl>
                                <Input placeholder='mobile' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={formHook.control}
                    name='preferDays'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>preferDays</FormLabel>
                            <FormControl>
                                <MultiSelect
                                    placeholder='Preferred Days'
                                    options={daysOfWeek}
                                    onValueChange={(value) => field.onChange(value?.map(v => +v))}
                                    variant='inverted'
                                    selectAllOption={false}
                                    animation={2}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={formHook.control}
                    name='courses'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>courses</FormLabel>
                            <FormControl>
                                <MultiSelect
                                    placeholder='courses'
                                    options={daysOfWeek}
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


                <FormItem>
                    <FormLabel>Teaching Days Schedule</FormLabel>
                    {schedule.map((s, index) => (
                        <div key={index} className='schedule-item'>
                            <Select>
                                <SelectTrigger className='w-[180px]'>
                                    <SelectValue placeholder='Select a day' />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>days</SelectLabel>
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
                            <Input {...register(`days.${index}.startTime`)} placeholder='Start Time (HH:mm)' />
                            <Input {...register(`days.${index}.endTime`)} placeholder='End Time (HH:mm)' />
                            {errors.days?.[index]?.startTime &&
                                <span>{errors.days[index]?.startTime?.message}</span>}
                            {errors.days?.[index]?.endTime &&
                                <span>{errors.days[index]?.endTime?.message}</span>}
                        </div>
                    ))}
                    <Button type='button' onClick={addDay}>Add Day</Button>
                    <FormMessage />
                </FormItem>

                <Button type='submit'>Submit</Button>
            </form>
        </Form>
    );
}