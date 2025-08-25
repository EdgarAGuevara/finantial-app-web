'use client';

import React from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../_configs/firebase/config';

export const LoginScreen = () => {
    const handleGoogleSignIn = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            console.error("Error al iniciar sesión con Google:", error);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <img src="https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png" alt="Google Logo" className="google-logo" />
                <button onClick={handleGoogleSignIn} className="google-signin-button">
                    Sign in with Google
                </button>
            </div>
        </div>
    );
};

