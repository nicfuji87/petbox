import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../components/Logo';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate login - in a real app this would call an API
        if (email && password) {
            navigate('/admin');
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background-light p-4 dark:bg-background-dark">
            <div className="w-full max-w-md rounded-2xl bg-surface-light p-8 shadow-xl dark:bg-surface-dark border border-border-light dark:border-border-dark">
                <div className="mb-8 flex justify-center">
                    <Logo />
                </div>

                <h1 className="mb-6 text-center text-2xl font-bold text-text-main dark:text-text-dark-main">
                    Acesso Administrativo
                </h1>

                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <div>
                        <label
                            htmlFor="email"
                            className="mb-1 block text-sm font-medium text-text-secondary dark:text-text-dark-secondary"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-lg border border-border-light bg-background-light px-4 py-2 text-text-main outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:border-border-dark dark:bg-background-dark dark:text-text-dark-main"
                            placeholder="admin@petbox.com.br"
                            required
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="mb-1 block text-sm font-medium text-text-secondary dark:text-text-dark-secondary"
                        >
                            Senha
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-lg border border-border-light bg-background-light px-4 py-2 text-text-main outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:border-border-dark dark:bg-background-dark dark:text-text-dark-main"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="mt-4 w-full rounded-xl bg-primary py-3 font-bold text-white shadow-lg shadow-primary/30 transition-all hover:bg-primary-hover hover:shadow-primary/40 active:scale-95"
                    >
                        Entrar
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <a href="/" className="text-sm text-text-secondary hover:text-primary dark:text-text-dark-secondary">
                        ← Voltar para o site
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Login;
