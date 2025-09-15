"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export function ConfigDebug() {
  const [status, setStatus] = useState<{ url: string | null; anon: string | null; client: boolean }>({ url: null, anon: null, client: false });
  useEffect(() => {
    // Values are only exposed if prefixed with NEXT_PUBLIC_
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || null;
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '•••present•••' : null;
    setStatus({ url, anon, client: !!supabase });
  }, []);

  if (process.env.NODE_ENV === 'production') return null;

  if (status.client) return null; // hide when configured

  return (
    <div className="mt-4 rounded-md border border-amber-500/40 bg-amber-900/20 p-4 text-[11px] leading-relaxed text-amber-200">
      <strong className="block mb-1">Supabase Config Missing ( Supabase कन्फिग छैन )</strong>
      <ul className="list-disc ml-4 space-y-1">
        <li>.env.local file at project root required.</li>
        <li>Add: NEXT_PUBLIC_SUPABASE_URL= https://YOUR-PROJECT.supabase.co</li>
        <li>Add: NEXT_PUBLIC_SUPABASE_ANON_KEY= YOUR_ANON_PUBLIC_KEY</li>
        <li>Restart: stop dev server then run npm run dev again.</li>
      </ul>
      <div className="mt-2 font-mono">
        url: {status.url || 'null'}<br />
        anon key present: {status.anon ? 'yes' : 'no'}<br />
        client created: {status.client ? 'yes' : 'no'}
      </div>
    </div>
  );
}
