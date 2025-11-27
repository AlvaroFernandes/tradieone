import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import AuthLayout from '../layouts/AuthLayout';
import { Skeleton } from '../components/ui/skeleton';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestPasswordReset, getRememberedEmail } from '../services/auth';
import { ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

const ForgotPassword = () => {
  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const navigate = useNavigate();

  const forgotSchema = z.object({
    email: z.string().email('Please enter a valid email'),
  });

  type ForgotForm = z.infer<typeof forgotSchema>;

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<ForgotForm>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: '' },
  });

  useEffect(() => {
    const remembered = getRememberedEmail();
    if (remembered) setValue('email', remembered);
    // If already logged in, redirect
    if (localStorage.getItem('token')) {
      navigate('/dashboard');
      return;
    }
    setPageLoading(false);
  }, [navigate, setValue]);

  const onBackToLogin = () => navigate('/signin');

  const onSubmit = async (values: ForgotForm) => {
    setLoading(true);
    setSubmittedEmail(values.email);
    try {
      await requestPasswordReset(values.email);
      toast.success('If that email exists we sent password reset instructions.');
      setSuccess(true);
    } catch {
      toast.error('Failed to request password reset.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      {pageLoading ? (
        <div className="flex items-center justify-center py-16 w-full">
          <div className="w-full max-w-md space-y-4">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      ) : (
        <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md mx-4">
          <button
            onClick={onBackToLogin}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft size={20} />
            Back to Login
          </button>

          {!success ? (
            <>
              <div className="text-center mb-8">
                <h2 className="text-2xl mb-2">Forgot Password?</h2>
                <p className="text-sm text-gray-600">
                  Enter your email address and we&apos;ll send you instructions
                  to reset your password.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} aria-busy={loading}>
                <div className="space-y-5">
                  <div>
                    <Label htmlFor="email" className="text-gray-700">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@company.com"
                      className="mt-2 h-11"
                      {...register('email')}
                      required
                    />
                    {errors.email ? (
                      <div className="text-sm text-red-600 mt-1">{errors.email.message}</div>
                    ) : null}
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 bg-blue-600 hover:bg-blue-700"
                    disabled={loading || isSubmitting}
                  >
                    {loading ? 'Sending...' : 'Send Reset Link'}
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-2xl mb-2">Check your email</h2>
              <p className="text-sm text-gray-600 mb-6">
                We&apos;ve sent password reset instructions to{' '}
                <strong>{submittedEmail}</strong>
              </p>
              <Button
                onClick={onBackToLogin}
                className="w-full h-11 bg-blue-600 hover:bg-blue-700"
              >
                Back to Login
              </Button>
            </div>
          )}

          <div className="mt-8 pt-6 border-t text-center">
            <div className="flex justify-center gap-4 text-sm">
              <a href="#" className="text-blue-600 hover:underline">
                Terms
              </a>
              <a href="#" className="text-blue-600 hover:underline">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      )}
    </AuthLayout>
  );
};

export default ForgotPassword;
