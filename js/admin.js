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
    tbody.innerHTML = `<tr><td colspan="9" class="empty-row">Cargando invitados...</td></tr>`;

    const { data, error } = await supabaseClient
        .from('vw_invitados_rsvp')
        .select('*')
        .order('nombre_apellido', { ascending: true });

    if (error) {
        console.error(error);
        tbody.innerHTML = `<tr><td colspan="9" class="empty-row">Error cargando invitados</td></tr>`;
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
            matchStatus = guest.estado_rsvp === 'confirmado';
        } else if (status === 'pending') {
            matchStatus = guest.estado_rsvp === 'pendiente' || guest.estado_rsvp === null;
        }

        return matchName && matchStatus;
    });

    renderStats(filtered);
    renderTable(filtered);
}

function renderStats(guests) {
    const total = guests.length;
    const confirmed = guests.filter(g => g.estado_rsvp === 'confirmado').length;
    const pending = guests.filter(g => g.estado_rsvp === 'pendiente' || !g.estado_rsvp).length;
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
        tbody.innerHTML = `<tr><td colspan="9" class="empty-row">No hay invitados para mostrar</td></tr>`;
        return;
    }

    tbody.innerHTML = guests.map(guest => {
        const statusBadge = guest.estado_rsvp === 'confirmado'
            ? `<span class="badge badge-confirmed">Sí</span>`
            : guest.estado_rsvp === 'rechazado'
            ? `<span class="badge badge-rejected">No</span>`
            : `<span class="badge badge-pending">Pendiente</span>`;

        const link = PUBLIC_INVITATION_BASE_URL + '?token=' + guest.token;

        return `
            <tr>
                <td>${escapeHtml(guest.nombre_apellido)}</td>
                <td>${guest.cupos_reservados ?? ''}</td>
                <td>${statusBadge}</td>
                <td>${guest.cantidad_confirmada ?? ''}</td>
                <td class="token-cell">${guest.token}</td>
                <td class="link-cell">
                    <a href="${link}" target="_blank">${link}</a>
                </td>
                <td class="message-cell">${escapeHtml(guest.mensaje || '')}</td>
                <td>${formatDate(guest.confirmado_en)}</td>
                <td>
                    <div class="row-actions">
                        <button class="action-btn" onclick="copyText('${guest.token}')">Copiar token</button>
                        <button class="action-btn primary" onclick="copyText('${escapeForJs(link)}')">Copiar link</button>
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
        const link = PUBLIC_INVITATION_BASE_URL + '?token=' + guest.token;
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
        'cupos_reservados',
        'estado_rsvp',
        'cantidad_confirmada',
        'token',
        'link_invitacion',
        'mensaje',
        'confirmado_en'
    ];

    const rows = allGuests.map(guest => {
        const link = PUBLIC_INVITATION_BASE_URL + '?token=' + guest.token;
        return [
            csvValue(guest.nombre_apellido),
            csvValue(guest.cupos_reservados),
            csvValue(guest.estado_rsvp || 'pendiente'),
            csvValue(guest.cantidad_confirmada ?? ''),
            csvValue(guest.token),
            csvValue(link),
            csvValue(guest.mensaje || ''),
            csvValue(formatDate(guest.confirmado_en))
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
