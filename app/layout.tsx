import './globals.css';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';

export const metadata = {
    title: 'ثبت استاد (پروژه تحقیقاتی دانشگاه شهید مهاجر)',
};

const inter = Inter({
    variable: '--font-inter',
    subsets: ['latin'],
    display: 'swap',
});

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang='fa' dir='rtl'>
        <body className={inter.variable}>
        {children}
        <Toaster />
        </body>
        </html>
    );
}
