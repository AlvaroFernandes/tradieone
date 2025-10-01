import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import GoogleIcon from "@mui/icons-material/Google";
import { useState } from 'react';
import AuthLayout from '../layouts/AuthLayout';
import { register } from '../services/auth';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    try {
      await register({ email, password });
      setSuccess(true);
      // Redirect or show success message
    } catch (err: unknown) {
      interface ErrorResponse {
        response?: {
          data?: {
            message?: string;
          };
        };
      }
      const errorObj = err as ErrorResponse;
      if (
        errorObj &&
        errorObj.response &&
        errorObj.response.data &&
        typeof errorObj.response.data.message === 'string'
      ) {
        setError(errorObj.response.data.message);
      } else {
        setError('Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div>
        <Card className="bg-white w- p-8 rounded-2xl shadow-soft border border-gray-100">
          <CardHeader>
            <div className="mt-12 flex flex-col items-center">
              <h3 className="text-2xl font-bold mb-4 justify-center">
                Register
              </h3>
              <p className="leading-0">
                Already have an account?{' '}
                <a href="/signin" className="text-primary">
                  Sign in
                </a>
              </p>
            </div>
            <div className="relative mt-2 flex items-center">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink mx-4 text-gray-400">OR</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>
            <div className="mt-4 flex flex-col gap-3">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                    <GoogleIcon className="mr-2 h-4 w-4 text-primary" />
                  Use Google
                </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary focus:ring-opacity-50"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary focus:ring-opacity-50"
                />
              </div>
              {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
              {success && <div className="text-green-600 text-sm mb-2">Registration successful!</div>}
              <div className="mb-4"></div>
              <Button type="submit" className="w-full bg-primary text-white" disabled={loading}>
                {loading ? 'Registering...' : 'Register'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AuthLayout>
  );
};

export default Register;
