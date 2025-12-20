const { useState } = React;
const Icons = window.Icons;
const client = window.client;

window.Login = ({ onLoginSuccess }) => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!email || !password || !confirmPassword) {
            setError('All fields are required');
            return;
        }

        if (!validateEmail(email)) {
            setError('Please enter a valid email');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            const { data, error } = await client.auth.signUp({
                email,
                password
            });

            if (error) throw error;

            setMessage('Account created! Please check your email to confirm your account.');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setTimeout(() => {
                setIsSignUp(false);
                setMessage('');
            }, 3000);
        } catch (err) {
            setError(err.message || 'Sign up failed');
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!email || !password) {
            setError('Email and password are required');
            return;
        }

        setLoading(true);
        try {
            const { data, error } = await client.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;
            setMessage('Login successful!');
            onLoginSuccess();
        } catch (err) {
            setError(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError('');
        setLoading(true);
        try {
            const { error } = await client.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin
                }
            });
            if (error) throw error;
        } catch (err) {
            setError(err.message || 'Google login failed');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-secondary)] flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo & Title */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-nothing-red rounded-xl mb-4">
                        <Icons.Cloud className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Weather Station</h1>
                    <p className="text-sm text-[var(--text-secondary)]">IoT Environmental Monitoring System</p>
                </div>

                {/* Auth Card */}
                <div className="sensor-card p-8">
                    <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6 text-center">
                        {isSignUp ? 'Create Account' : 'Welcome Back'}
                    </h2>

                    {error && (
                        <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
                            <Icons.AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-500">{error}</p>
                        </div>
                    )}

                    {message && (
                        <div className="mb-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-start gap-3">
                            <Icons.CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-green-500">{message}</p>
                        </div>
                    )}

                    <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="space-y-4">
                        {/* Email Input */}
                        <div>
                            <label className="block text-xs font-bold text-[var(--text-secondary)] mb-2 uppercase tracking-widest">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full px-4 py-2.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-nothing-red transition-colors text-sm"
                            />
                        </div>

                        {/* Password Input */}
                        <div>
                            <label className="block text-xs font-bold text-[var(--text-secondary)] mb-2 uppercase tracking-widest">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-4 py-2.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-nothing-red transition-colors text-sm"
                            />
                        </div>

                        {/* Confirm Password (Sign Up Only) */}
                        {isSignUp && (
                            <div>
                                <label className="block text-xs font-bold text-[var(--text-secondary)] mb-2 uppercase tracking-widest">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-2.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-nothing-red transition-colors text-sm"
                                />
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-nothing-red hover:bg-red-700 disabled:bg-gray-600 text-white font-bold py-2.5 rounded-lg transition-colors mt-6 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    {isSignUp ? 'Creating Account...' : 'Signing In...'}
                                </>
                            ) : (
                                <>
                                    {isSignUp ? <Icons.UserPlus className="w-4 h-4" /> : <Icons.LogIn className="w-4 h-4" />}
                                    {isSignUp ? 'Create Account' : 'Sign In'}
                                </>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-[var(--border-color)]"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-[var(--bg-secondary)] px-2 text-[var(--text-secondary)] font-bold">Or continue with</span>
                        </div>
                    </div>

                    {/* Social Login */}
                    <button
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full border border-[var(--border-color)] hover:border-nothing-red text-[var(--text-primary)] font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-3"
                    >
                        <Icons.Google className="w-5 h-5" />
                        Google
                    </button>

                    {/* Toggle Sign Up / Sign In */}
                    <div className="mt-6 text-center border-t border-[var(--border-color)] pt-6">
                        <p className="text-sm text-[var(--text-secondary)] mb-3">
                            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                        </p>
                        <button
                            onClick={() => {
                                setIsSignUp(!isSignUp);
                                setError('');
                                setMessage('');
                                setEmail('');
                                setPassword('');
                                setConfirmPassword('');
                            }}
                            className="text-nothing-red hover:text-red-700 font-bold text-sm transition-colors"
                        >
                            {isSignUp ? 'Sign In Instead' : 'Create New Account'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
