import Link from 'next/link';
import { AuthForm } from '@/components/AuthForm';

export default function RegisterPage() {
  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Join BookmarkHub
        </h1>
        <p className="text-gray-600">Create an account and start sharing amazing links</p>
      </div>
      <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-gray-200">
        <AuthForm mode="register" />
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-purple-600 hover:text-blue-600 transition-colors">
              Login here →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

