'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, LockKeyhole } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function AdminLogin() {
  const router = useRouter(); const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [error,setError]=useState(''); const [loading,setLoading]=useState(false)
  async function submit(e:FormEvent) { e.preventDefault(); setLoading(true); setError(''); const result=await supabase?.auth.signInWithPassword({email,password}); if (result?.error) setError('Invalid email or password.'); else router.replace('/admin'); setLoading(false) }
  return <main className="admin-login-page"><div className="admin-login-card"><div className="admin-login-mark">✦</div><p className="admin-kicker">GARUDA / PRIVATE ACCESS</p><h1>Welcome back.</h1><p className="admin-login-copy">Sign in to manage reservations, rooms and tables.</p><form onSubmit={submit}><label>Email<input required type="email" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email" /></label><label>Password<input required type="password" value={password} onChange={e=>setPassword(e.target.value)} autoComplete="current-password" /></label>{error&&<p className="form-error" role="alert">{error}</p>}<button className="button button-dark full-button" disabled={loading}>{loading?'Signing in…':<>Sign in <ArrowRight data-icon="inline-end"/></>}</button></form><a href="/" className="admin-back-link"><LockKeyhole/> Return to public website</a></div></main>
}
