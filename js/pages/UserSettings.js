const { useState, useEffect } = React;
const Icons = window.Icons;
const client = window.client;

window.UserSettings = ({ user, onLogout }) => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [userProfile, setUserProfile] = useState(null);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [fetchingProfile, setFetchingProfile] = useState(true);

    // Fetch user profile
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                if (user) {
                    // Try to fetch from public profile table (you can modify this)
                    const { data, error } = await client
                        .from('user_profiles')
                        .select('*')
                        .eq('user_id', user.id)
                        .single();

                    if (!error && data) {
                        setUserProfile(data);
                    } else {
                        // If table doesn't exist, just use auth user data
                        setUserProfile({
                            user_id: user.id,
                            email: user.email,
                            created_at: user.created_at
                        });
                    }
                }
            } catch (err) {
                console.error('Error fetching profile:', err);
            } finally {
                setFetchingProfile(false);
            }
        };

        fetchProfile();
    }, [user]);

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!newPassword || !confirmPassword) {
            setError('Both password fields are required');
            return;
        }

        if (newPassword.length < 6) {
            setError('New password must be at least 6 characters');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            const { error } = await client.auth.updateUser({
                password: newPassword
            });

            if (error) throw error;

            setMessage('Password updated successfully!');
            setNewPassword('');
            setConfirmPassword('');
            setShowPasswordForm(false);
        } catch (err) {
            setError(err.message || 'Failed to update password');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await client.auth.signOut();
            onLogout();
        } catch (err) {
            setError('Failed to logout');
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2 flex items-center gap-3">
                    <Icons.Settings className="w-8 h-8 text-nothing-red" />
                    User Settings
                </h1>
                <p className="text-sm text-[var(--text-secondary)]">Manage your account and preferences</p>
            </div>

            {/* Loading State */}
            {fetchingProfile && (
                <div className="sensor-card p-8 text-center">
                    <div className="inline-block w-8 h-8 border-2 border-nothing-red border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-[var(--text-secondary)]">Loading profile...</p>
                </div>
            )}

            {!fetchingProfile && (
                <div className="grid grid-cols-1 gap-6">
                    {/* Error & Success Messages */}
                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
                            <Icons.AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-500">{error}</p>
                        </div>
                    )}

                    {message && (
                        <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-start gap-3">
                            <Icons.CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-green-500">{message}</p>
                        </div>
                    )}

                    {/* Account Information Card */}
                    <div className="sensor-card p-8">
                        <h2 className="text-lg font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
                            <Icons.User className="w-5 h-5 text-nothing-red" />
                            Account Information
                        </h2>

                        <div className="space-y-6">
                            {/* Email */}
                            <div>
                                <label className="block text-xs font-bold text-[var(--text-secondary)] mb-2 uppercase tracking-widest">
                                    Email Address
                                </label>
                                <div className="px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] text-sm flex items-center justify-between">
                                    <span>{user?.email}</span>
                                    <Icons.Mail className="w-4 h-4 text-nothing-red" />
                                </div>
                            </div>

                            {/* User ID */}
                            <div>
                                <label className="block text-xs font-bold text-[var(--text-secondary)] mb-2 uppercase tracking-widest">
                                    User ID
                                </label>
                                <div className="px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] text-xs font-mono truncate">
                                    {user?.id}
                                </div>
                            </div>

                            {/* Account Created */}
                            <div>
                                <label className="block text-xs font-bold text-[var(--text-secondary)] mb-2 uppercase tracking-widest">
                                    Account Created
                                </label>
                                <div className="px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] text-sm flex items-center gap-2">
                                    <Icons.Calendar className="w-4 h-4 text-nothing-red" />
                                    {new Date(user?.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Security Settings Card */}
                    <div className="sensor-card p-8">
                        <h2 className="text-lg font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
                            <Icons.Lock className="w-5 h-5 text-nothing-red" />
                            Security Settings
                        </h2>

                        {!showPasswordForm ? (
                            <button
                                onClick={() => setShowPasswordForm(true)}
                                className="w-full bg-nothing-red hover:bg-red-700 text-white font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                <Icons.Key className="w-4 h-4" />
                                Change Password
                            </button>
                        ) : (
                            <form onSubmit={handlePasswordChange} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-[var(--text-secondary)] mb-2 uppercase tracking-widest">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full px-4 py-2.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-nothing-red transition-colors text-sm"
                                    />
                                </div>

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

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 bg-nothing-red hover:bg-red-700 disabled:bg-gray-600 text-white font-bold py-2.5 rounded-lg transition-colors"
                                    >
                                        {loading ? 'Updating...' : 'Update Password'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowPasswordForm(false);
                                            setNewPassword('');
                                            setConfirmPassword('');
                                            setError('');
                                        }}
                                        className="flex-1 border border-[var(--border-color)] hover:border-nothing-red text-[var(--text-primary)] font-bold py-2.5 rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>

                    {/* Danger Zone */}
                    <div className="sensor-card p-8 border-red-500/30">
                        <h2 className="text-lg font-bold text-red-500 mb-6 flex items-center gap-2">
                            <Icons.AlertTriangle className="w-5 h-5" />
                            Danger Zone
                        </h2>

                        <button
                            onClick={handleLogout}
                            className="w-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500 text-red-500 font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            <Icons.LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                    </div>

                    {/* Info Card */}
                    <div className="sensor-card p-6 bg-[var(--bg-primary)]">
                        <div className="flex gap-4">
                            <Icons.InfoIcon className="w-5 h-5 text-nothing-red flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-bold text-[var(--text-primary)] mb-1">Privacy & Security</p>
                                <p className="text-xs text-[var(--text-secondary)]">
                                    Your data is encrypted and securely stored. You can change your password anytime to keep your account secure.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
