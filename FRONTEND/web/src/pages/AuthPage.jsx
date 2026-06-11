import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSignIn, useSignUp } from '@clerk/clerk-react';

export default function AuthPage() {
  const [isSignIn, setIsSignIn] = useState(true);

  useEffect(() => {
    document.documentElement.style.fontSize = '14px';
    return () => {
      document.documentElement.style.fontSize = '';
    };
  }, []);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // OTP state for Clerk Sign Up verification
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");

  // Password Reset state: 'none', 'email', 'code'
  const [resetState, setResetState] = useState('none');

  const navigate = useNavigate();

  const { isLoaded: isSignInLoaded, signIn, setActive: setSignInActive } = useSignIn();
  const { isLoaded: isSignUpLoaded, signUp, setActive: setSignUpActive } = useSignUp();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (resetState === 'email') {
        if (!email) {
          setError("Please enter your email address.");
          setLoading(false);
          return;
        }
        await signIn.create({
          strategy: "reset_password_email_code",
          identifier: email,
        });
        setResetState('code');
      } else if (resetState === 'code') {
        if (!code || !password) {
          setError("Please enter the code and your new password.");
          setLoading(false);
          return;
        }
        const result = await signIn.attemptFirstFactor({
          strategy: "reset_password_email_code",
          code,
          password,
        });

        if (result.status === 'complete') {
          await setSignInActive({ session: result.createdSessionId });
          navigate('/dashboard');
        } else {
          setError("Invalid code or password.");
        }
      }
    } catch (err) {
      console.error(err);
      let errorMessage = "An unexpected error occurred. Please try again.";
      if (err.errors && err.errors.length > 0) {
        errorMessage = err.errors[0].longMessage || err.errors[0].message;
      } else if (err.message) {
        if (err.message.includes("Network error") || err.message.includes("Failed to fetch")) {
          errorMessage = "Unable to connect to the server. Please check your internet connection and try again.";
        } else {
          errorMessage = err.message;
        }
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    if (resetState !== 'none') {
      return handleResetPassword(e);
    }

    if (!email || (!password && !pendingVerification)) {
      setError("Please fill in all fields.");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      if (isSignIn) {
        if (!isSignInLoaded) return;
        
        if (!pendingVerification) {
          const result = await signIn.create({
            identifier: email,
            password,
          });

          if (result.status === 'complete') {
            await setSignInActive({ session: result.createdSessionId });
            navigate('/dashboard');
          } else if (result.status === 'needs_client_trust' || result.status === 'needs_second_factor') {
            // The user is suspicious or has 2FA enabled. Clerk requires an email/phone code.
            const emailFactor = result.supportedFirstFactors?.find(f => f.strategy === 'email_code') || 
                                result.supportedSecondFactors?.find(f => f.strategy === 'email_code');
            
            if (emailFactor) {
              await signIn.prepareFirstFactor({ strategy: 'email_code' }).catch(() => {
                return signIn.prepareSecondFactor({ strategy: 'email_code' });
              });
              setPendingVerification(true);
            } else {
              setError("Additional verification needed, but no email factor available.");
            }
          } else {
            console.log("Incomplete sign in result:", result);
            if (result.status === "needs_first_factor") {
              setError("Password incorrect or additional verification needed.");
            } else {
               setError(`Verification incomplete. Status: ${result.status}`);
            }
          }
        } else {
          // Attempt verification
          const completeSignIn = await signIn.attemptFirstFactor({ strategy: 'email_code', code }).catch(() => {
            return signIn.attemptSecondFactor({ strategy: 'email_code', code });
          });

          if (completeSignIn.status === 'complete') {
            await setSignInActive({ session: completeSignIn.createdSessionId });
            navigate('/dashboard');
          } else {
            setError("Invalid verification code.");
          }
        }
      } else {
        if (!isSignUpLoaded) return;
        
        if (!pendingVerification) {
          // Step 1: Start the sign up
          await signUp.create({
            emailAddress: email,
            password,
          });

          // Step 2: Send verification email
          await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
          setPendingVerification(true);
        } else {
          // Step 3: Verify the code
          const completeSignUp = await signUp.attemptEmailAddressVerification({
            code,
          });

          if (completeSignUp.status === 'complete') {
            await setSignUpActive({ session: completeSignUp.createdSessionId });
            navigate('/dashboard');
          } else {
            setError("Invalid verification code.");
          }
        }
      }
    } catch (err) {
      console.error(err);
      let errorMessage = "An unexpected error occurred. Please try again.";
      if (err.errors && err.errors.length > 0) {
        errorMessage = err.errors[0].longMessage || err.errors[0].message;
      } else if (err.message) {
        if (err.message.includes("Network error") || err.message.includes("Failed to fetch")) {
          errorMessage = "Unable to connect to the server. Please check your internet connection and try again.";
        } else {
          errorMessage = err.message;
        }
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError(null);
    setLoading(true);
    try {
      if (isSignIn) {
        await signIn.authenticateWithRedirect({
          strategy: "oauth_google",
          redirectUrl: "/sso-callback",
          redirectUrlComplete: "/dashboard"
        });
      } else {
        await signUp.authenticateWithRedirect({
          strategy: "oauth_google",
          redirectUrl: "/sso-callback",
          redirectUrlComplete: "/dashboard"
        });
      }
    } catch (err) {
      console.error(err);
      let errorMessage = "An unexpected error occurred. Please try again.";
      if (err.errors && err.errors.length > 0) {
        errorMessage = err.errors[0].longMessage || err.errors[0].message;
      } else if (err.message) {
        if (err.message.includes("Network error") || err.message.includes("Failed to fetch")) {
          errorMessage = "Unable to connect to the server. Please check your internet connection and try again.";
        } else {
          errorMessage = err.message;
        }
      }
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a] flex flex-col items-center justify-center py-12 px-4 relative overflow-hidden font-sans">
      {/* Background radial effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-slate-200/30 dark:bg-slate-800/10 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-0 right-1/4 w-[800px] h-[800px] bg-slate-300/20 dark:bg-slate-700/10 blur-[150px] rounded-full"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8 h-[76px]">
          <Link to="/" className="inline-block hover:opacity-80 transition-opacity">
            <h1 className="font-display font-bold text-4xl tracking-tight text-slate-900 dark:text-white mb-2">jexy</h1>
          </Link>
          <div className="h-5 flex justify-center items-center">
            <AnimatePresence mode="wait">
              <motion.p 
                key={resetState !== 'none' ? 'reset' : isSignIn ? 'signin' : 'signup'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="text-slate-500 dark:text-slate-400 font-light text-sm"
              >
                {resetState !== 'none' ? 'Reset your password' : isSignIn ? 'Welcome Back' : 'The weightless audio processing platform'}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-none p-8 sm:p-10 border border-slate-100 dark:border-zinc-800">
          
          {!pendingVerification && resetState === 'none' && (
            <div className="relative flex bg-slate-50 dark:bg-zinc-800/50 p-1.5 rounded-xl mb-8">
              <motion.div 
                className="absolute top-1.5 bottom-1.5 w-[calc(50%-0.375rem)] bg-white dark:bg-zinc-900 shadow-sm border border-slate-100 dark:border-zinc-700 rounded-lg"
                layout
                transition={{ type: "spring", stiffness: 300, damping: 35 }}
                initial={false}
                animate={{ x: isSignIn ? 0 : '100%' }}
              />
              <button 
                type="button"
                onClick={() => setIsSignIn(true)}
                className={`relative z-10 flex-1 py-2.5 text-sm font-medium transition-colors duration-500 ${isSignIn ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                Sign In
              </button>
              <button 
                type="button"
                onClick={() => setIsSignIn(false)}
                className={`relative z-10 flex-1 py-2.5 text-sm font-medium transition-colors duration-500 ${!isSignIn ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                Create Account
              </button>
            </div>
          )}

          <form onSubmit={handleEmailAuth}>
            <div className="space-y-5 mb-8">
              {pendingVerification ? (
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">
                    Verification Code
                  </label>
                  <p className="text-sm text-slate-500 mb-4 font-light">We sent a verification code to {email}.</p>
                  <input 
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Enter 6-digit code"
                    className="w-full px-5 py-3.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 dark:focus:ring-white/10 dark:focus:border-slate-500 transition-all font-light tracking-widest"
                  />
                </div>
              ) : resetState === 'email' ? (
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">
                    Email Address
                  </label>
                  <p className="text-sm text-slate-500 mb-4 font-light">Enter your email and we'll send a code to reset your password.</p>
                  <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full px-5 py-3.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 dark:focus:ring-white/10 dark:focus:border-slate-500 transition-all font-light"
                  />
                </div>
              ) : resetState === 'code' ? (
                <>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">
                      Reset Code
                    </label>
                    <p className="text-sm text-slate-500 mb-4 font-light">We sent a reset code to {email}.</p>
                    <input 
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="Enter 6-digit code"
                      className="w-full px-5 py-3.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 dark:focus:ring-white/10 dark:focus:border-slate-500 transition-all font-light tracking-widest"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input 
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-5 py-3.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 dark:focus:ring-white/10 dark:focus:border-slate-500 transition-all font-mono tracking-widest"
                      />
                      <button 
                        type="button"
                        title={showPassword ? "Hide password" : "Show password"}
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
                      >
                        <span className="material-symbols-outlined text-xl">{showPassword ? 'visibility_off' : 'visibility'}</span>
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">
                      Email Address
                    </label>
                    <input 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full px-5 py-3.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 dark:focus:ring-white/10 dark:focus:border-slate-500 transition-all font-light"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-end mb-2 h-[15px]">
                      <div className="flex-1 flex items-end">
                        <AnimatePresence mode="wait">
                          <motion.label
                            key={isSignIn ? 'signin' : 'signup'}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest whitespace-nowrap leading-none"
                          >
                            {isSignIn ? 'Password' : 'Create a password'}
                          </motion.label>
                        </AnimatePresence>
                      </div>
                      <div className="flex justify-end items-end">
                        <AnimatePresence>
                          {isSignIn && (
                            <button 
                              type="button"
                              onClick={() => setResetState('email')}
                              className="text-xs font-semibold text-sky-500 hover:text-sky-600 dark:text-sky-400 dark:hover:text-sky-300 transition-colors whitespace-nowrap leading-none"
                            >
                              Forgot password?
                            </button>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                    <div className="relative">
                      <input 
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-5 py-3.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 dark:focus:ring-white/10 dark:focus:border-slate-500 transition-all font-mono tracking-widest"
                      />
                      <button 
                        type="button"
                        title={showPassword ? "Hide password" : "Show password"}
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
                      >
                        <span className="material-symbols-outlined text-xl">{showPassword ? 'visibility_off' : 'visibility'}</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div id="clerk-captcha" className="mb-4 flex justify-center"></div>

            {error && (
              <div className="mb-6 p-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#0f172a] dark:bg-white text-white dark:text-[#0f172a] rounded-xl font-medium text-sm transition-all hover:bg-slate-800 dark:hover:bg-slate-200 mb-8 disabled:opacity-70 flex justify-center items-center"
            >
              {loading ? (
                <span className="material-symbols-outlined animate-spin-slow">loop</span>
              ) : pendingVerification ? (
                "Verify Email"
              ) : resetState === 'email' ? (
                "Send Reset Code"
              ) : resetState === 'code' ? (
                "Update Password"
              ) : (
                <AnimatePresence mode="wait">
                  <motion.span
                    key={isSignIn ? 'signin' : 'signup'}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {isSignIn ? 'Sign In' : 'Create Account'}
                  </motion.span>
                </AnimatePresence>
              )}
            </button>
            
            {resetState !== 'none' && (
              <button
                type="button"
                onClick={() => {
                  setResetState('none');
                  setError(null);
                }}
                className="w-full text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
              >
                Back to Sign In
              </button>
            )}
          </form>
          {!pendingVerification && (
            <>
              <div className="relative flex items-center justify-center mb-8">
                <div className="absolute w-full border-t border-slate-100 dark:border-zinc-800"></div>
                <span className="relative bg-white dark:bg-zinc-900 px-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  OR
                </span>
              </div>

              <button 
                type="button"
                onClick={handleGoogleAuth}
                disabled={loading}
                className="w-full py-4 bg-white dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-slate-300 rounded-xl font-medium text-sm transition-all hover:bg-slate-50 dark:hover:bg-zinc-700 flex items-center justify-center gap-3 disabled:opacity-70"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>
            </>
          )}
        </div>

        <div className="mt-8 text-center text-xs text-slate-500 dark:text-slate-400 font-light tracking-wide px-4">
          By continuing, you agree to Jexy's <a href="#" className="underline decoration-slate-300 hover:text-slate-700 dark:decoration-zinc-600 dark:hover:text-slate-300 transition-colors">Terms of Service</a> and <a href="#" className="underline decoration-slate-300 hover:text-slate-700 dark:decoration-zinc-600 dark:hover:text-slate-300 transition-colors">Privacy Policy</a>.
        </div>
      </div>
    </div>
  );
}
