import React from 'react';
import { Navbar } from './Navbar';

export function PageWrapper({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow flex flex-col pt-6 pb-12 px-4 sm:px-6">
                <div className="max-w-7xl mx-auto w-full flex-grow flex flex-col">
                    {children}
                </div>
            </main>
        </div>
    );
}
