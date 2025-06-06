// src/hooks.server.ts
import {
	PUBLIC_SUPABASE_ANON_KEY,
	PUBLIC_SUPABASE_URL
} from '$env/static/public';
import { PRIVATE_SUPABASE_SERVICE_ROLE } from '$env/static/private';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

/* ───────────────────────────── Supabase helper ───────────────────────────── */
const supabase: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createServerClient(
		PUBLIC_SUPABASE_URL,
		PUBLIC_SUPABASE_ANON_KEY,
		{
			cookies: {
				getAll: () => event.cookies.getAll(),
				setAll: (arr) =>
					arr.forEach(({ name, value, options }) =>
						event.cookies.set(name, value, { ...options, path: '/' })
					)
			}
		}
	);

	event.locals.supabaseServiceRole = createClient(
		PUBLIC_SUPABASE_URL,
		PRIVATE_SUPABASE_SERVICE_ROLE,
		{ auth: { persistSession: false } }
	);

	// suppress deprecated warning (see GH-888)
	// Removed direct assignment to protected property 'suppressGetSessionWarning'

	event.locals.safeGetSession = async () => {
		const { data: sessionData } = await event.locals.supabase.auth.getSession();
		if (!sessionData.session) return { session: null, user: null, amr: null };

		const { data: userData, error: userErr } =
			await event.locals.supabase.auth.getUser();
		if (userErr) return { session: null, user: null, amr: null };

		const { data: aal, error: amrErr } =
			await event.locals.supabase.auth.mfa.getAuthenticatorAssuranceLevel();
		return {
			session: sessionData.session,
			user: userData.user,
			amr: amrErr ? null : aal.currentAuthenticationMethods
		};
	};

	return resolve(event, {
		filterSerializedResponseHeaders: (n) =>
			n === 'content-range' || n === 'x-supabase-api-version'
	});
};

/* ───────────────────────────── Auth guard ───────────────────────────── */
const authGuard: Handle = async ({ event, resolve }) => {
	const { session, user } = await event.locals.safeGetSession();
	event.locals.session = session;
	event.locals.user = user;

	if (event.url.pathname.startsWith('/.well-known')) {
		return resolve(event); // skip auth for PWA probes
	}
	return resolve(event);
};

/* ───────────────────────────── CSP header ───────────────────────────── */
// src/hooks.server.ts  (excerpt – keep your Supabase + auth parts)

const securityHeaders: Handle = async ({ event, resolve }) => {
	const res = await resolve(event);

	/* 1 — remove any CSP that might have been set earlier (e.g. by adapters) */
	res.headers.delete('content-security-policy');

	/* 2 — send ONE single-line CSP header */
	res.headers.set(
		'content-security-policy',
		[
			// everything else
			"default-src 'self'",
			// EventSource + HL REST
			"connect-src 'self' https://api.hyperliquid.xyz",
			// allow inline <style> tags DaisyUI inserts
			"style-src 'self' 'unsafe-inline'",
			// allow data: URIs for SVG noise / icons
			"img-src 'self' data:",
			// optional: fonts if Tailwind loads them
			"font-src 'self' data:"
		].join('; ')
	);

	return res;
};

/* ───────────────────────────── Combined handle ───────────────────────────── */
export const handle: Handle = sequence(supabase, authGuard, securityHeaders);
