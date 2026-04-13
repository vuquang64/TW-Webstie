import { supabaseAdmin } from '../../../lib/supabase';

function jsonResponse(data, status = 200, origin = '*') {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

function getAllowedOrigin(request) {
  const allowedOrigin = process.env.ALLOWED_ORIGIN;
  if (!allowedOrigin || allowedOrigin === '*') return '*';

  const requestOrigin = request.headers.get('origin');
  if (requestOrigin && requestOrigin === allowedOrigin) {
    return requestOrigin;
  }
  return allowedOrigin;
}

export async function OPTIONS(request) {
  const origin = getAllowedOrigin(request);
  return jsonResponse({ ok: true }, 200, origin);
}

export async function POST(request) {
  const origin = getAllowedOrigin(request);

  try {
    const payload = await request.json();

    const submission = {
      name: (payload.name || '').trim(),
      email: (payload.email || '').trim(),
      company: (payload.company || '').trim(),
      use_case: (payload.useCase || '').trim(),
      budget: (payload.budget || '').trim(),
      workflow: (payload.workflow || '').trim(),
      source_page: (payload.sourcePage || '').trim(),
      submitted_at: new Date().toISOString(),
    };

    if (!submission.name || !submission.email) {
      return jsonResponse({ error: 'name and email are required' }, 400, origin);
    }

    const { error } = await supabaseAdmin
      .from('contact_submissions')
      .insert(submission);

    if (error) {
      console.error(error);
      return jsonResponse({ error: 'failed to save submission' }, 500, origin);
    }

    return jsonResponse({ ok: true }, 200, origin);
  } catch (error) {
    console.error(error);
    return jsonResponse({ error: 'invalid request' }, 400, origin);
  }
}
