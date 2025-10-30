import Link from 'next/link';
import { AuthForm } from '@/components/AuthForm';

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Welcome Back
        </h1>
        <p className="text-gray-600">Login to continue discovering amazing links</p>
      </div>
      <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-gray-200">
        <AuthForm mode="login" />
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/register" className="font-semibold text-blue-600 hover:text-purple-600 transition-colors">
              Register here →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

