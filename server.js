const path = require('path');
const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;
const websiteDir = path.join(__dirname, 'tomorrow workforce');

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabaseAdmin = null;
if (supabaseUrl && serviceRoleKey) {
  supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

app.use(express.json());
app.use(express.static(websiteDir));

app.get('/health', (req, res) => {
  res.json({ ok: true, service: 'website-and-contact-api' });
});

app.post('/api/contact', async (req, res) => {
  try {
    const payload = req.body || {};
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
      return res.status(400).json({ error: 'name and email are required' });
    }

    if (!supabaseAdmin) {
      return res.status(500).json({ error: 'backend env is not configured' });
    }

    const { error } = await supabaseAdmin
      .from('contact_submissions')
      .insert(submission);

    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'failed to save submission' });
    }

    return res.json({ ok: true });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: 'invalid request' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(websiteDir, 'index.html'));
});

app.use((req, res) => {
  const fallbackPath = path.join(websiteDir, req.path);
  res.sendFile(fallbackPath, (err) => {
    if (err) {
      res.status(404).send('Not found');
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
