let allGuests = [];

document.addEventListener('DOMContentLoaded', () => {
    bindAdminEvents();
    loadGuests();
});

function bindAdminEvents() {
    const btnRefresh = document.getElementById('btnRefresh');
    const btnCopyAllLinks = document.getElementById('btnCopyAllLinks');
    const btnExportCsv = document.getElementById('btnExportCsv');
    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter');

    btnRefresh?.addEventListener('click', loadGuests);
    btnCopyAllLinks?.addEventListener('click', copyAllLinks);
    btnExportCsv?.addEventListener('click', exportGuestsCsv);
    searchInput?.addEventListener('input', applyFilters);
    statusFilter?.addEventListener('change', applyFilters);
}

async function loadGuests() {
    const tbody = document.getElementById('adminTableBody');
    tbody.innerHTML = `<tr><td colspan="12" class="empty-row">Cargando invitados...</td></tr>`;

    const { data, error } = await supabaseClient
        .from('v_invitados_admin')
        .select('*')
        .order('nombre_apellido', { ascending: true });

    if (error) {
        console.error(error);
        tbody.innerHTML = `<tr><td colspan="12" class="empty-row">Error cargando invitados</td></tr>`;
        return;
    }

    allGuests = data || [];
    renderStats(allGuests);
    renderTable(allGuests);
}

function applyFilters() {
    const search = (document.getElementById('searchInput')?.value || '').trim().toLowerCase();
    const status = document.getElementById('statusFilter')?.value || 'all';

    const filtered = allGuests.filter(guest => {
        const matchName = guest.nombre_apellido.toLowerCase().includes(search);

        let matchStatus = true;
        if (status === 'confirmed') {
            matchStatus = guest.confirmado === true;
        } else if (status === 'pending') {
            matchStatus = guest.confirmado === false || guest.confirmado === null;
        }

        return matchName && matchStatus;
    });

    renderStats(filtered);
    renderTable(filtered);
}

function renderStats(guests) {
    const total = guests.length;
    const confirmed = guests.filter(g => g.confirmado === true).length;
    const pending = guests.filter(g => g.confirmado === false || g.confirmado === null).length;
    const confirmedPeople = guests.reduce((acc, guest) => {
        return acc + Number(guest.cantidad_confirmada || 0);
    }, 0);

    document.getElementById('statTotal').textContent = total;
    document.getElementById('statConfirmed').textContent = confirmed;
    document.getElementById('statPending').textContent = pending;
    document.getElementById('statConfirmedPeople').textContent = confirmedPeople;
}

function renderTable(guests) {
    const tbody = document.getElementById('adminTableBody');

    if (!guests.length) {
        tbody.innerHTML = `<tr><td colspan="12" class="empty-row">No hay invitados para mostrar</td></tr>`;
        return;
    }

    tbody.innerHTML = guests.map(guest => {
        const statusBadge = guest.confirmado === true
            ? `<span class="badge badge-confirmed">Sí</span>`
            : guest.confirmado === false
            ? `<span class="badge badge-rejected">No</span>`
            : `<span class="badge badge-pending">Pendiente</span>`;

        const link = guest.link_invitacion || (PUBLIC_INVITATION_BASE_URL + '?token=' + guest.token);

        const especialBadge = guest.tipo_invitacion_especial
            ? `<span class="badge badge-especial">${escapeHtml(guest.tipo_invitacion_especial)}</span>`
            : `<span class="badge badge-pending">—</span>`;

        const especialAceptadaBadge = guest.tipo_invitacion_especial
            ? (guest.invitacion_especial_aceptada === true
                ? `<span class="badge badge-confirmed">Sí</span>`
                : guest.invitacion_especial_aceptada === false
                ? `<span class="badge badge-rejected">No</span>`
                : `<span class="badge badge-pending">Pendiente</span>`)
            : `<span class="badge badge-pending">—</span>`;

        const especialLink = guest.link_invitacion_especial || (PUBLIC_INVITATION_BASE_URL.replace('index.html', 'especial.html') + '?token=' + guest.token);

        return `
            <tr>
                <td>${escapeHtml(guest.nombre_apellido)}</td>
                <td>${guest.cupos ?? ''}</td>
                <td>${statusBadge}</td>
                <td>${guest.cantidad_confirmada ?? ''}</td>
                <td>${especialBadge}</td>
                <td>${especialAceptadaBadge}</td>
                <td class="token-cell">${guest.token}</td>
                <td class="link-cell">
                    <a href="${link}" target="_blank">${link}</a>
                </td>
                <td class="link-cell">
                    ${guest.tipo_invitacion_especial ? `<a href="${especialLink}" target="_blank">${especialLink}</a>` : '—'}
                </td>
                <td class="message-cell">${escapeHtml(guest.mensaje || '')}</td>
                <td>${formatDate(guest.fecha_confirmacion)}</td>
                <td>
                    <div class="row-actions">
                        <button class="action-btn" onclick="copyText('${guest.token}')">Copiar token</button>
                        <button class="action-btn primary" onclick="copyText('${escapeForJs(link)}')">Copiar link</button>
                        <button class="action-btn" onclick="copyText('${escapeForJs(especialLink)}')">Copiar esp.</button>
                        <button class="action-btn" onclick="window.open('${escapeForJs(link)}', '_blank')">Abrir</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

async function copyText(text) {
    try {
        await navigator.clipboard.writeText(text);
        alert('Copiado al portapapeles');
    } catch (error) {
        console.error(error);
        alert('No se pudo copiar');
    }
}

async function copyAllLinks() {
    if (!allGuests.length) {
        alert('No hay invitados cargados');
        return;
    }

    const lines = allGuests.map(guest => {
        const link = guest.link_invitacion || (PUBLIC_INVITATION_BASE_URL + '?token=' + guest.token);
        return `${guest.nombre_apellido}: ${link}`;
    });
    const text = lines.join('\n');

    try {
        await navigator.clipboard.writeText(text);
        alert('Todos los links fueron copiados');
    } catch (error) {
        console.error(error);
        alert('No se pudo copiar la lista de links');
    }
}

function exportGuestsCsv() {
    if (!allGuests.length) {
        alert('No hay invitados para exportar');
        return;
    }

    const headers = [
        'nombre_apellido',
        'cupos',
        'confirmado',
        'cantidad_confirmada',
        'token',
        'link_invitacion',
        'mensaje',
        'fecha_confirmacion'
    ];

    const rows = allGuests.map(guest => {
        const link = guest.link_invitacion || (PUBLIC_INVITATION_BASE_URL + '?token=' + guest.token);
        return [
            csvValue(guest.nombre_apellido),
            csvValue(guest.cupos),
            csvValue(guest.confirmado === true ? 'Sí' : guest.confirmado === false ? 'No' : 'Pendiente'),
            csvValue(guest.cantidad_confirmada ?? ''),
            csvValue(guest.token),
            csvValue(link),
            csvValue(guest.mensaje || ''),
            csvValue(formatDate(guest.fecha_confirmacion))
        ];
    });

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'invitados_boda.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(url);
}

function csvValue(value) {
    const stringValue = String(value ?? '');
    return `"${stringValue.replace(/"/g, '""')}"`;
}

function formatDate(dateString) {
    if (!dateString) return '';

    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return '';

    return date.toLocaleString('es-CO', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function escapeHtml(text) {
    return String(text || '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

function escapeForJs(text) {
    return String(text || '')
        .replaceAll('\\', '\\\\')
        .replaceAll("'", "\\'");
}
