// src/pages/Login.jsx
import { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await api.post('/login', { email, password });
            
            // Simpan Token & Role
            localStorage.setItem('token', response.data.access_token);
            if (response.data.user) {
                localStorage.setItem('role', response.data.user.role);
            } else {
                localStorage.setItem('role', 'user');
            }
            
            navigate('/dashboard');
        } catch (error) {
            console.error(error);
            alert('Login Gagal! Periksa kembali email dan password Anda.');
        } finally {
            setIsLoading(false);
        }
    };

    // --- STYLES MODERN ---
    const styles = {
        container: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            backgroundColor: '#f0f2f5', // Abu-abu muda modern
            fontFamily: "'Segoe UI', sans-serif",
        },
        card: {
            width: '100%',
            maxWidth: '400px',
            backgroundColor: '#ffffff',
            padding: '40px',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)', // Efek bayangan lembut
            textAlign: 'center',
        },
        logo: {
            fontSize: '48px',
            marginBottom: '10px',
        },
        title: {
            color: '#2c3e50',
            fontSize: '24px',
            fontWeight: 'bold',
            marginBottom: '30px',
            marginTop: '0',
        },
        inputGroup: {
            marginBottom: '20px',
            textAlign: 'left',
        },
        label: {
            display: 'block',
            marginBottom: '8px',
            color: '#7f8c8d',
            fontSize: '14px',
            fontWeight: '600',
        },
        input: {
            width: '100%',
            padding: '12px 15px',
            fontSize: '16px',
            border: '1px solid #dfe6e9',
            borderRadius: '8px',
            boxSizing: 'border-box', // Agar padding tidak merusak lebar
            transition: 'border-color 0.3s',
            outline: 'none',
        },
        button: {
            width: '100%',
            padding: '14px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
            marginTop: '10px',
        },
        footer: {
            marginTop: '20px',
            fontSize: '13px',
            color: '#95a5a6',
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.logo}>📦</div>
                <h2 style={styles.title}>Masuk ke Inventora</h2>
                
                <form onSubmit={handleLogin}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Email</label>
                        <input 
                            type="email" 
                            placeholder="nama@perusahaan.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={styles.input}
                            onFocus={(e) => e.target.style.borderColor = '#3498db'}
                            onBlur={(e) => e.target.style.borderColor = '#dfe6e9'}
                        />
                    </div>
                    
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Password</label>
                        <input 
                            type="password" 
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={styles.input}
                            onFocus={(e) => e.target.style.borderColor = '#3498db'}
                            onBlur={(e) => e.target.style.borderColor = '#dfe6e9'}
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        style={styles.button}
                        disabled={isLoading}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#2980b9'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#3498db'}
                    >
                        {isLoading ? 'Memproses...' : 'Masuk Dashboard'}
                    </button>
                </form>

                <div style={styles.footer}>
                    <p>Sistem Manajemen Stok Gudang v1.0</p>
                </div>
            </div>
        </div>
    );
}