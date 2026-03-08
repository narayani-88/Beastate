import { createContext, useContext, useState, useCallback } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        try {
            const stored = localStorage.getItem('beastate_user')
            return stored ? JSON.parse(stored) : null
        } catch { return null }
    })

    const [token, setToken] = useState(() => localStorage.getItem('beastate_token') || null)

    const login = useCallback(async (email, password) => {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        })
        if (!res.ok) {
            const err = await res.json().catch(() => ({}))
            throw new Error(err.message || 'Login failed')
        }
        const data = await res.json()
        // data should have { token, username/email, ... }
        const userData = { email: data.email || email, username: data.username || email.split('@')[0] }
        setToken(data.token)
        setUser(userData)
        localStorage.setItem('beastate_token', data.token)
        localStorage.setItem('beastate_user', JSON.stringify(userData))
        return userData
    }, [])

    const register = useCallback(async (username, email, password) => {
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password }),
        })
        if (!res.ok) {
            const err = await res.json().catch(() => ({}))
            throw new Error(err.message || 'Registration failed')
        }
        const data = await res.json()
        const userData = { email: data.email || email, username: data.username || username }
        setToken(data.token)
        setUser(userData)
        localStorage.setItem('beastate_token', data.token)
        localStorage.setItem('beastate_user', JSON.stringify(userData))
        return userData
    }, [])

    const logout = useCallback(() => {
        setUser(null)
        setToken(null)
        localStorage.removeItem('beastate_token')
        localStorage.removeItem('beastate_user')
    }, [])

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, isLoggedIn: !!user }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}
