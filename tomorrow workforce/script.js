const siteContent = {
  features: [
    { title: 'Slow delivery', description: 'Operations teams need fast execution, not long consulting cycles.' },
    { title: 'Poor fit', description: 'Generic tools miss the specific needs of workflow-driven systems.' },
    { title: 'Integration gaps', description: 'Systems must connect to existing software, data platforms, and APIs.' }
  ],
  solutions: [
    { title: 'Intelligent Document Automation', description: 'Extract, classify, and route unstructured documents automatically.', href: 'solutions.html#document-automation' },
    { title: 'Internal AI Operations Assistants', description: 'Secure, context-aware agents that augment your team\'s operational capabilities.', href: 'solutions.html#ai-assistants' },
    { title: 'AI Decision Support Tools', description: 'Predictive models and analytics to drive smarter operational choices.', href: 'solutions.html#decision-support' },
    { title: 'Workflow Orchestration Systems', description: 'Automate complex, multi-step processes across your existing toolchain.', href: 'solutions.html#workflow-orchestration' }
  ],
  benefits: [
    { title: 'Custom Systems', description: 'We design AI systems tailored to your operational workflows.' },
    { title: 'Fast Delivery', description: 'First production systems typically delivered in 4–8 weeks.' },
    { title: 'Built for Integration', description: 'Designed to plug into existing enterprise systems and APIs.' },
    { title: 'Designed to Scale', description: 'Architecture supports expansion across departments and use cases.' }
  ],
  process: [
    { step: 1, title: 'Discover', description: 'Identify highest-ROI opportunity' },
    { step: 2, title: 'Build', description: 'Rapid delivery of v1' },
    { step: 3, title: 'Deploy', description: 'Integrate into workflows' },
    { step: 4, title: 'Scale', description: 'Expand to new functions/use cases' }
  ],
  industries: [
    { title: 'Manufacturing', description: 'QC reports, supplier docs, maintenance logs.' },
    { title: 'Logistics', description: 'Exception handling, dispatch operations, claims processing.' },
    { title: 'Financial Services', description: 'Reporting workflows, operational documentation, internal knowledge.' },
    { title: 'Professional Services', description: 'Delivery automation, proposal workflows, knowledge retrieval.' },
    { title: 'Private Equity Portfolio Companies', description: 'Cross-company reporting and operational automation.' }
  ],
  integrations: [
    { title: 'ERP / CRM', items: 'SAP\nSALESFORCE' },
    { title: 'DATA', items: 'SNOWFLAKE\nPOSTGRESQL' },
    { title: 'CLOUD', items: 'AWS\nGCP\nMICROSOFT AZURE\nOCI' },
    { title: 'ENTERPRISE / OTHER', items: 'INTERNAL APIS\nDOCUMENT SYSTEMS' }
  ]
};

function createCard(elementType, className, contentHtml) {
  const element = document.createElement(elementType);
  element.className = className;
  element.innerHTML = contentHtml;
  return element;
}

function renderCards(containerId, items, renderItem) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';
  items.forEach(item => container.appendChild(renderItem(item)));
}

function renderFeatureCard(feature) {
  return createCard('article', 'feature-card', `<h3>${feature.title}</h3><p>${feature.description}</p>`);
}

function renderSolutionCard(solution) {
  return createCard('article', 'solution-item', `<div class="solution-item-image"></div><div class="solution-item-copy"><h3>${solution.title}</h3><p>${solution.description}</p></div><a class="solution-item-link" href="${solution.href}">Explore</a>`);
}

function renderBenefitCard(benefit) {
  return createCard('div', 'benefit-item', `<h3>${benefit.title}</h3><p>${benefit.description}</p>`);
}

function renderProcessStep(step) {
  return createCard('article', 'process-step', `<span>${step.step}</span><h3>${step.title}</h3><p>${step.description}</p>`);
}

function renderIndustryCard(industry) {
  return createCard('div', 'industry-card', `<h3>${industry.title}</h3><p>${industry.description}</p>`);
}

function renderIntegrationItem(integration) {
  const content = `<strong>${integration.title}</strong><p>${integration.items.replace(/\n/g, '<br>')}</p>`;
  return createCard('div', 'integration-item', content);
}

function initializeSite() {
  renderCards('feature-cards', siteContent.features, renderFeatureCard);
  renderCards('solution-grid', siteContent.solutions, renderSolutionCard);
  renderCards('benefit-grid', siteContent.benefits, renderBenefitCard);
  renderCards('process-grid', siteContent.process, renderProcessStep);
  renderCards('industry-grid', siteContent.industries, renderIndustryCard);
  renderCards('integration-grid', siteContent.integrations, renderIntegrationItem);
}

function initializeContactForm() {
  const contactForm = document.querySelector('.contact-form') || document.getElementById('form');
  const successMessage = document.getElementById('contact-success');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = contactForm.querySelector('#name').value.trim();
    const email = contactForm.querySelector('#email').value.trim();
    const company = contactForm.querySelector('#company').value.trim();
    const useCase = contactForm.querySelector('#useCase').value.trim();

    if (!name || !email) {
      successMessage.textContent = 'Please provide at least your name and email.';
      return;
    }

    const subject = encodeURIComponent('Tomorrow Workforce AI Opportunity');
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nCompany: ${company}\nUse case: ${useCase}`);
    window.location.href = `mailto:hello@tomorrowworkforce.com?subject=${subject}&body=${body}`;
    successMessage.textContent = 'Opening your mail client with a pre-filled message...';
    contactForm.reset();
  });
}

window.addEventListener('DOMContentLoaded', () => {
  initializeSite();
  initializeContactForm();
});

window.SiteEditor = {
  updateHeroText(header, description) {
    const heroTitle = document.querySelector('.hero-copy h1');
    const heroDesc = document.querySelector('.hero-copy p');
    if (heroTitle) heroTitle.textContent = header;
    if (heroDesc) heroDesc.textContent = description;
  },
  setContactEmail(email) {
    const contactButton = document.querySelector('.contact-form button');
    const footerLink = document.querySelector('.footer-inner a');
    if (footerLink) footerLink.href = `mailto:${email}`;
    if (footerLink) footerLink.textContent = email;
    if (contactButton) contactButton.closest('form').setAttribute('action', `mailto:${email}`);
  }
};
