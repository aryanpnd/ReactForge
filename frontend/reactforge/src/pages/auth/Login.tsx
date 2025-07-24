import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useAuthStore, { type User } from "@/store/authStore";
import { initGoogleAuth } from "@/lib/auth/googleAuth";
import { loginWithEmail, signupWithEmail } from "@/lib/auth/emailAuth";
import logoIcon from "@/assets/logoIcon.png";
import { toast, Toaster } from "sonner";

export default function AuthPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        confirmPassword: ''
    });

    const { isAuthenticated, login } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    // Initialize Google Sign-In after component mounts
    useEffect(() => {
        const timer = setTimeout(() => {
            initGoogleAuth(
                (user: User) => {
                    login(user);
                    navigate('/');
                },
                (error: string) => {
                    setError(error);
                    toast.error(
                        `Google sign-in failed: ${error}`,
                        {
                            duration: 5000,
                            position: 'top-center',
                            style: {
                                background: '#f8d7da',
                                color: '#721c24',
                                border: '1px solid #f5c6cb',
                            },
                        }
                    );
                }
            );
        }, 500);

        return () => clearTimeout(timer);
    }, [login, navigate]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
        setError(''); // Clear error on input change
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const user = await loginWithEmail({
                email: formData.email,
                password: formData.password
            });

            login(user);
            navigate('/');
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Login failed');
            toast.error(
                `Login failed: ${error instanceof Error ? error.message : 'An error occurred'}`,
                {
                    duration: 5000,
                    position: 'top-center',
                    style: {
                        background: '#f8d7da',
                        color: '#721c24',
                        border: '1px solid #f5c6cb',
                    },
                }
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setIsLoading(false);
            return;
        }

        try {
            const user = await signupWithEmail({
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password
            });

            login(user);
            navigate('/');
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Signup failed');
            toast.error(
                `Signup failed: ${error instanceof Error ? error.message : 'An error occurred'}`,
                {
                    duration: 5000,
                    position: 'top-center',
                    style: {
                        background: '#f8d7da',
                        color: '#721c24',
                        border: '1px solid #f5c6cb',
                    },
                }
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
            <Toaster />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(139,92,246,0.1),transparent_50%)]" />

            <div className="relative w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                {/* Left Side - Branding */}
                <div className="flex flex-col justify-center space-y-8 lg:pr-8">
                    <div className="flex justify-center lg:justify-start">
                        <img
                            src={logoIcon}
                            alt="ReactForge Logo"
                            className="w-16 h-16 lg:w-20 lg:h-20 object-contain"
                        />
                    </div>

                    <div className="space-y-4 text-center lg:text-left">
                        <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-300 bg-clip-text text-transparent">
                            ReactForge
                        </h1>
                        <div className="space-y-3">
                            <p className="text-xl lg:text-2xl text-gray-300 font-medium">
                                Smelt Code. Shape UI. Build with ReactForge
                            </p>
                            <p className="text-base lg:text-lg text-gray-400 max-w-md mx-auto lg:mx-0">
                                AI-powered micro-frontend playground for React components
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Side - Auth Form */}
                <div className="flex justify-center lg:justify-end">
                    <div className="w-full max-w-md">
                        <Card className="border border-white/10 shadow-2xl bg-gray-900/80 backdrop-blur-xl">
                            <CardHeader className="space-y-1 pb-6">
                                <CardTitle className="text-2xl text-center text-white">Welcome back</CardTitle>
                                <CardDescription className="text-center text-gray-400">
                                    Sign in to your ReactForge workspace
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {error && (
                                    <div className="p-3 text-sm bg-red-500/10 border border-red-500/20 text-red-400 rounded">
                                        {error}
                                    </div>
                                )}

                                <Tabs defaultValue="login" className="space-y-6">
                                    <TabsList className="grid w-full grid-cols-2 bg-gray-800/50 border border-white/10">
                                        <TabsTrigger
                                            value="login"
                                            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-300"
                                        >
                                            Sign In
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="signup"
                                            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-300"
                                        >
                                            Sign Up
                                        </TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="login" className="space-y-4">
                                        <form onSubmit={handleLogin} className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="email" className="text-gray-200">Email</Label>
                                                <Input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    placeholder="developer@example.com"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="bg-gray-800/50 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="password" className="text-gray-200">Password</Label>
                                                <Input
                                                    id="password"
                                                    name="password"
                                                    type="password"
                                                    value={formData.password}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="bg-gray-800/50 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                                                />
                                            </div>
                                            <Button
                                                type="submit"
                                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2.5"
                                                disabled={isLoading}
                                            >
                                                {isLoading ? "Signing in..." : "Sign In"}
                                            </Button>
                                        </form>
                                    </TabsContent>

                                    <TabsContent value="signup" className="space-y-4">
                                        <form onSubmit={handleSignup} className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="firstName" className="text-gray-200">First name</Label>
                                                    <Input
                                                        id="firstName"
                                                        name="firstName"
                                                        placeholder="John"
                                                        value={formData.firstName}
                                                        onChange={handleInputChange}
                                                        required
                                                        className="bg-gray-800/50 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="lastName" className="text-gray-200">Last name</Label>
                                                    <Input
                                                        id="lastName"
                                                        name="lastName"
                                                        placeholder="Doe"
                                                        value={formData.lastName}
                                                        onChange={handleInputChange}
                                                        required
                                                        className="bg-gray-800/50 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="signupEmail" className="text-gray-200">Email</Label>
                                                <Input
                                                    id="signupEmail"
                                                    name="email"
                                                    type="email"
                                                    placeholder="developer@example.com"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="bg-gray-800/50 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="signupPassword" className="text-gray-200">Password</Label>
                                                <Input
                                                    id="signupPassword"
                                                    name="password"
                                                    type="password"
                                                    value={formData.password}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="bg-gray-800/50 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="confirmPassword" className="text-gray-200">Confirm password</Label>
                                                <Input
                                                    id="confirmPassword"
                                                    name="confirmPassword"
                                                    type="password"
                                                    value={formData.confirmPassword}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="bg-gray-800/50 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                                                />
                                            </div>
                                            <Button
                                                type="submit"
                                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2.5"
                                                disabled={isLoading}
                                            >
                                                {isLoading ? "Creating account..." : "Create Account"}
                                            </Button>
                                        </form>
                                    </TabsContent>
                                </Tabs>

                                <div className="space-y-3">
                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <Separator className="w-full border-white/10" />
                                        </div>
                                        <div className="relative flex justify-center text-xs uppercase">
                                            <span className="bg-gray-900 px-3 text-gray-400">Or continue with</span>
                                        </div>
                                    </div>

                                    {/* Google Sign-In Button */}
                                    <div id="google-signin-btn" className="w-full flex justify-center" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}