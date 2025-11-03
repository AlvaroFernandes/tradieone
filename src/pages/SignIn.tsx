import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import AuthLayout from '../layouts/AuthLayout';
import { Skeleton } from '../components/ui/skeleton';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, rememberEmail, forgetRememberedEmail, getRememberedEmail } from '../services/auth';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [userType, setUserType] = useState<'admin' | 'employee'>('admin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [pageLoading, setPageLoading] = useState(true);

  const navigate = useNavigate();

  // Pre-fill email if remembered
  useEffect(() => {
    const rememberedEmail = getRememberedEmail();
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRemember(true);
    }
    if (localStorage.getItem('token')) {
      // If user already has a token, redirect immediately
      navigate('/dashboard');
      return;
    }

    // initial checks done
    setPageLoading(false);
  }, [navigate]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  setLoading(true);
  setError('');
  setSuccess('');
    try {
      const data = await login({ email, password });
  setSuccess('Sign in successful!');
      localStorage.setItem('token', data.token);
      if (remember) {
        rememberEmail(email);
      } else {
        forgetRememberedEmail();
      }
        navigate('/dashboard');
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
        setError('Sign in failed');
      }
    } finally {
      setLoading(false);
    }
  };

  // Navigation / handlers used in the UI
  const onSignUp = () => {
    navigate('/register');
  };

  const onForgotPassword = () => {
    navigate('/forgot-password');
  };

  return (
    <AuthLayout>
      {/* show skeleton while running initial page checks */}
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
          <div className="text-center mb-8">
            <h2 className="text-2xl mb-2">Sign in</h2>
            <p className="text-sm text-gray-600">
              Need an account?{" "}
              <button
                onClick={onSignUp}
                className="text-blue-600 hover:underline"
              >
                Sign up
              </button>
            </p>
          </div>

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
            Sign in with Google
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">OR</span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div>
                <Label className="text-gray-700">Login As</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => setUserType("admin")}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      userType === "admin"
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="text-center">
                      <p className="text-sm">Admin</p>
                      <p className="text-xs text-gray-500 mt-1">Full Access</p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserType("employee")}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      userType === "employee"
                        ? "border-green-600 bg-green-50 text-green-700"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="text-center">
                      <p className="text-sm">Employee</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Limited Access
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="text-gray-700">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 h-11"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-gray-700">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2 h-11"
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={remember}
                    onCheckedChange={(v) => setRemember(Boolean(v))}
                  />
                  <label
                    htmlFor="remember"
                    className="text-sm cursor-pointer text-gray-700"
                  >
                    Remember me
                  </label>
                </div>
                <button
                  type="button"
                  onClick={onForgotPassword}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              {error && <div className="text-red-500 text-sm">{error}</div>}
              {success && (
                <div className="text-green-600 text-sm">{success}</div>
              )}

              <Button
                type="submit"
                className="w-full h-11 bg-blue-600 hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
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

export default SignIn;