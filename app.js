document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('launch-data.json');
    const data = await response.json();
    renderDashboard(data);
  } catch (error) {
    document.getElementById('app').innerHTML = `
      <div class="container">
        <p style="color: var(--color-danger); text-align: center;">
          Failed to load launch data. Make sure launch-data.json is available.
        </p>
      </div>`;
  }
});

function renderDashboard(data) {
  const app = document.getElementById('app');

  const statusLabel = data.overallStatus.replace('-', ' ');
  const daysUntilLaunch = getDaysUntil(data.targetLaunchDate);
  const completedMilestones = data.milestones.filter(m => m.status === 'complete').length;
  const totalMilestones = data.milestones.length;

  app.innerHTML = `
    <div class="container">
      <!-- Header -->
      <header class="header">
        <h1>${data.pageTitle}</h1>
        <p class="subtitle">${data.description}</p>
        <span class="status-badge ${data.overallStatus}">${statusLabel}</span>
        <p class="last-updated">Last updated: ${formatDate(data.lastUpdated)}</p>
      </header>

      <!-- Summary Cards -->
      <div class="summary-grid">
        <div class="summary-item">
          <div class="label">Target Launch</div>
          <div class="value">${formatShortDate(data.targetLaunchDate)}</div>
        </div>
        <div class="summary-item">
          <div class="label">Days to Launch</div>
          <div class="value">${daysUntilLaunch >= 0 ? daysUntilLaunch : 'Launched!'}</div>
        </div>
        <div class="summary-item">
          <div class="label">Milestones</div>
          <div class="value">${completedMilestones} / ${totalMilestones}</div>
        </div>
        <div class="summary-item">
          <div class="label">Owner</div>
          <div class="value" style="font-size: 0.9rem;">${data.owner}</div>
        </div>
      </div>

      <!-- Milestones -->
      <div class="card">
        <h2>Milestones</h2>
        <ul class="milestone-list">
          ${data.milestones.map(m => `
            <li class="milestone-item ${m.status}">
              <div class="milestone-name">${m.name}</div>
              <div class="milestone-date">${formatShortDate(m.targetDate)}</div>
              ${m.notes ? `<div class="milestone-notes">${m.notes}</div>` : ''}
            </li>
          `).join('')}
        </ul>
      </div>

      <!-- Sites -->
      ${(data.siteGroups || []).map(group => `
        <div class="card">
          <h2>${group.feature} — Launch Sites</h2>
          <table class="sites-table">
            <thead>
              <tr>
                <th>Site</th>
                <th>Region</th>
                <th>Status</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              ${group.sites.map(s => `
                <tr>
                  <td><strong>${s.name}</strong></td>
                  <td>${s.region}</td>
                  <td><span class="site-status ${s.status}">${s.status}</span></td>
                  <td style="color: var(--color-text-muted); font-size: 0.85rem;">${s.notes || '—'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `).join('')}

      <!-- Blockers -->
      <div class="card">
        <h2>Blockers & Risks</h2>
        ${data.blockers.length === 0
          ? '<p class="no-blockers">✓ No active blockers</p>'
          : data.blockers.map(b => `<div class="blocker-item">${b}</div>`).join('')
        }
      </div>

      <!-- Links -->
      ${data.links.length > 0 ? `
        <div class="card">
          <h2>Key Links</h2>
          <ul class="links-list">
            ${data.links.map(l => `<li><a href="${l.url}" target="_blank">${l.label}</a></li>`).join('')}
          </ul>
        </div>
      ` : ''}

      <!-- Footer -->
      <footer class="footer">
        ${data.owner} · Updated ${formatDate(data.lastUpdated)}
      </footer>
    </div>
  `;
}

function getDaysUntil(dateStr) {
  const target = new Date(dateStr + 'T00:00:00');
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.ceil((target - now) / (1000 * 60 * 60 * 24));
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function formatShortDate(dateStr) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}
