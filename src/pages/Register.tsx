import { Button } from '../components/ui/button';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import AuthLayout from '../layouts/AuthLayout';
import { Skeleton } from '../components/ui/skeleton';
import { register } from '../services/auth';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const Register = () => {
  const [loading, setLoading] = useState(false);
  
  const [pageLoading, setPageLoading] = useState(true);
  const navigate = useNavigate();

  const registerSchema = z
    .object({
      firstName: z.string().min(1, 'First name is required'),
      lastName: z.string().min(1, 'Last name is required'),
      email: z.string().email('Invalid email'),
      password: z.string().min(6, 'Password must be at least 6 characters'),
      confirmPassword: z.string().min(6, 'Please confirm your password'),
      terms: z.boolean().refine((v) => v === true, { message: 'You must accept the terms' }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ['confirmPassword'],
      message: "Passwords don't match",
    });

  type RegisterForm = z.infer<typeof registerSchema>;

  const { register: formRegister, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { firstName: '', lastName: '', email: '', password: '', confirmPassword: '', terms: false },
  });

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/dashboard');
      return;
    }
    setPageLoading(false);
  }, [navigate]);

  const onSubmit = async (values: RegisterForm) => {
    setLoading(true);
    // messages are handled via sonner toasts
    try {
      await register({ email: values.email, password: values.password });
      toast.success('Registration successful!');
    } catch (err: unknown) {
      interface ErrorResponse {
        response?: {
          data?: {
            message?: string;
          };
        };
      }
      const errorObj = err as ErrorResponse;
      const message = errorObj && errorObj.response && errorObj.response.data && typeof errorObj.response.data.message === 'string'
        ? errorObj.response.data.message
        : 'Registration failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const onBackToLogin = () => {
    navigate('/signin');
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
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md mx-4" >
        <div className="text-center mb-8">
          <h2 className="text-2xl mb-2">Sign up</h2>
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <button onClick={onBackToLogin} className="text-blue-600 hover:underline">
              Sign in
            </button>
          </p>
        </div>

        {/* Notifications are shown via sonner toasts */}

        <Button
          variant="outline"
          className="w-full mb-6 flex items-center justify-center gap-2 h-11"
          type="button"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Sign up with Google
        </Button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">OR</span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="text-gray-700">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  className="mt-2 h-11"
                  {...formRegister('firstName')}
                  required
                />
                {errors.firstName ? (<div className="text-sm text-red-600 mt-1">{errors.firstName.message}</div>) : null}
              </div>
              <div>
                <Label htmlFor="lastName" className="text-gray-700">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  className="mt-2 h-11"
                  {...formRegister('lastName')}
                  required
                />
                {errors.lastName ? (<div className="text-sm text-red-600 mt-1">{errors.lastName.message}</div>) : null}
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="text-gray-700">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@company.com"
                className="mt-2 h-11"
                {...formRegister('email')}
                required
              />
              {errors.email ? (<div className="text-sm text-red-600 mt-1">{errors.email.message}</div>) : null}
            </div>

            <div>
              <Label htmlFor="password" className="text-gray-700">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter Password"
                className="mt-2 h-11"
                {...formRegister('password')}
                required
              />
              {errors.password ? (<div className="text-sm text-red-600 mt-1">{errors.password.message}</div>) : null}
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-gray-700">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                className="mt-2 h-11"
                {...formRegister('confirmPassword')}
                required
              />
              {errors.confirmPassword ? (<div className="text-sm text-red-600 mt-1">{errors.confirmPassword.message}</div>) : null}
            </div>

            <div className="flex items-center space-x-2">
              <Controller
                control={control}
                name="terms"
                render={({ field }) => (
                  <Checkbox id="terms" checked={Boolean(field.value)} onCheckedChange={(v) => field.onChange(Boolean(v))} />
                )}
              />
              <label
                htmlFor="terms"
                className="text-sm cursor-pointer text-gray-700"
              >
                I agree to the{' '}
                <a href="#" className="text-blue-600 hover:underline">
                  Terms and Conditions
                </a>
              </label>
              {errors.terms ? (<div className="text-sm text-red-600 mt-1">{errors.terms.message}</div>) : null}
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-blue-600 hover:bg-blue-700"
              disabled={loading || isSubmitting}
            >
              {loading ? 'Signing up...' : 'Sign Up'}
            </Button>
          </div>
        </form>

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

export default Register;
