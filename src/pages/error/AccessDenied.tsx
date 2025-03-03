import React from 'react';
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react';

function AccessDenied() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-red-600 p-6 flex justify-center">
                    <Lock className="text-white h-16 w-16" />
                </div>

                <div className="p-6 sm:p-8">
                    <div className="flex items-center gap-3 mb-4">
                        <ShieldAlert className="h-6 w-6 text-red-600" />
                        <h1 className="text-2xl font-bold text-gray-800">Access Denied</h1>
                    </div>

                    <p className="text-gray-600 mb-6">
                        You don't have permission to access this page. Please contact your administrator if you believe this is an error.
                    </p>
                    <div className="space-y-4">
                        <button
                            className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors duration-200 flex items-center justify-center gap-2"
                            onClick={() => window.history.back()}
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Go Back
                        </button>

                    </div>
                </div>

                <div className="bg-gray-50 p-4 border-t border-gray-100">
                    <p className="text-sm text-gray-500 text-center">
                        If you need assistance, please contact
                        <a href="mailto:support@example.com" className="text-blue-600 hover:underline">support@example.com</a>
                    </p>
                </div>
            </div>

            <p className="mt-8 text-sm text-gray-500">
                &copy; {new Date().getFullYear()} Your Company. All rights reserved.
            </p>
        </div>
    );
}

export default AccessDenied;