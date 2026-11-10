let allGuests = [];

// Construye los links usando el dominio REAL desde donde se abre el admin,
// en vez del dominio fijo que venía en la vista SQL.
function buildInvitationLink(token) {
    const base = window.location.origin + window.location.pathname.replace(/[^/]*$/, '');
    return base + '?id=' + token;
}

function buildEspecialLink(token) {
    const base = window.location.origin + window.location.pathname.replace(/[^/]*$/, '');
    return base + 'especial.html?id=' + token;
}

document.addEventListener('DOMContentLoaded', () => {
    bindAdminEvents();
    loadGuests();
    bindComunidadAdmin();
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
    tbody.innerHTML = `<tr><td colspan="11" class="empty-row">Cargando invitados...</td></tr>`;

    const { data, error } = await supabaseClient
        .from('v_invitados_admin')
        .select('*')
        .gt('cupos', 0)
        .order('nombre_apellido', { ascending: true });

    if (error) {
        console.error(error);
        tbody.innerHTML = `<tr><td colspan="11" class="empty-row">Error cargando invitados</td></tr>`;
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
        } else if (status === 'rejected') {
            matchStatus = guest.confirmado === false && guest.fecha_confirmacion != null;
        }

        return matchName && matchStatus;
    });

    renderStats(filtered);
    renderTable(filtered);
}

function renderStats(guests) {
    const total = guests.reduce((acc, guest) => {
        return acc + Number(guest.cupos || 0);
    }, 0);
    const confirmed = guests.filter(guest => guest.confirmado === true).length;
    const pending = guests.reduce((acc, guest) => {
        return acc + Number(guest.cupos || 0) - Number(guest.cantidad_confirmada || 0);
    }, 0);
    const rejected = guests.filter(guest => guest.confirmado === false && guest.fecha_confirmacion != null).length;
    const confirmedPeople = guests.reduce((acc, guest) => {
        return acc + Number(guest.cantidad_confirmada || 0);
    }, 0);

    document.getElementById('statTotal').textContent = total;
    document.getElementById('statConfirmed').textContent = confirmed;
    document.getElementById('statPending').textContent = pending;
    document.getElementById('statRejected').textContent = rejected;
    document.getElementById('statConfirmedPeople').textContent = confirmedPeople;
}

function renderTable(guests) {
    const tbody = document.getElementById('adminTableBody');

    if (!guests.length) {
        tbody.innerHTML = `<tr><td colspan="11" class="empty-row">No hay invitados para mostrar</td></tr>`;
        return;
    }

    tbody.innerHTML = guests.map(guest => {
        const link = buildInvitationLink(guest.token);

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

        const especialLink = buildEspecialLink(guest.token);

        return `
            <tr>
                <td>${escapeHtml(guest.nombre_apellido)}</td>
                <td>${(guest.confirmado === true)
                    ? `<span class="badge badge-confirmed">Sí</span>`
                    : (guest.fecha_confirmacion != null)
                    ? `<span class="badge badge-rejected">No</span>`
                    : `<span class="badge badge-pending">Pendiente</span>`}</td>
                <td>${guest.cupos ?? ''}</td>
                <td>${guest.cantidad_confirmada ?? ''}</td>
                <td>${especialBadge}</td>
                <td>${especialAceptadaBadge}</td>
                <td class="link-cell">
                    <button class="action-btn action-sm" onclick="copyText('${escapeForJs(link)}')">Copiar</button>
                    <button class="action-btn action-sm primary" onclick="window.open('${escapeForJs(link)}', '_blank')">Abrir</button>
                </td>
                <td class="link-cell">
                    ${guest.tipo_invitacion_especial
                        ? `<button class="action-btn action-sm" onclick="copyText('${escapeForJs(especialLink)}')">Copiar</button>
                           <button class="action-btn action-sm primary" onclick="window.open('${escapeForJs(especialLink)}', '_blank')">Abrir</button>`
                        : '—'}
                </td>
                <td class="message-cell">${escapeHtml(guest.mensaje || '')}</td>
                <td>${formatDate(guest.fecha_confirmacion)}</td>
                <td></td>
            </tr>
        `;
    }).join('');
}

async function copyText(text) {
    try {
        await navigator.clipboard.writeText(text);
        showToast('Copiado al portapapeles');
    } catch (error) {
        console.error(error);
        showToast('No se pudo copiar');
    }
}

async function copyAllLinks() {
    if (!allGuests.length) {
        showToast('No hay invitados cargados');
        return;
    }

    const lines = allGuests.map(guest => {
        const link = buildInvitationLink(guest.token);
        return `${guest.nombre_apellido}: ${link}`;
    });
    const text = lines.join('\n');

    try {
        await navigator.clipboard.writeText(text);
        showToast('Todos los links fueron copiados');
    } catch (error) {
        console.error(error);
        showToast('No se pudo copiar la lista de links');
    }
}

function exportGuestsCsv() {
    if (!allGuests.length) {
        showToast('No hay invitados para exportar');
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
        const link = buildInvitationLink(guest.token);
        return [
            csvValue(guest.nombre_apellido),
            csvValue(guest.cupos),
            csvValue(guest.estado === 'confirmado' ? 'Sí' : guest.estado === 'rechazado' ? 'No' : 'Pendiente'),
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

function showToast(message) {
    let toast = document.getElementById('adminToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'adminToast';
        toast.className = 'admin-toast';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), 2200);
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

/* ───── Vista de Comunidad (consejos + galería) en el admin ───── */
function bindComunidadAdmin() {
    const btnConsejos = document.getElementById('btnVerConsejos');
    const btnGaleria = document.getElementById('btnVerGaleria');
    const panel = document.getElementById('comunidadPanel');
    const tabConsejos = document.getElementById('tabConsejos');
    const tabGaleria = document.getElementById('tabGaleria');
    const wrapConsejos = document.getElementById('adminConsejosWrap');
    const wrapGaleria = document.getElementById('adminGaleriaWrap');

    function openTab(tab) {
        if (!panel) return;
        panel.classList.remove('hidden');
        panel.scrollIntoView({ behavior: 'smooth' });

        const showConsejos = tab === 'consejos';
        if (tabConsejos) tabConsejos.classList.toggle('active', showConsejos);
        if (tabGaleria) tabGaleria.classList.toggle('active', !showConsejos);
        if (wrapConsejos) wrapConsejos.classList.toggle('hidden', !showConsejos);
        if (wrapGaleria) wrapGaleria.classList.toggle('hidden', showConsejos);

        if (showConsejos) cargarConsejosAdmin();
        else cargarGaleriaAdmin();
    }

    if (btnConsejos) btnConsejos.addEventListener('click', () => openTab('consejos'));
    if (btnGaleria) btnGaleria.addEventListener('click', () => openTab('galeria'));
    if (tabConsejos) tabConsejos.addEventListener('click', () => openTab('consejos'));
    if (tabGaleria) tabGaleria.addEventListener('click', () => openTab('galeria'));
}

async function cargarConsejosAdmin() {
    const wrap = document.getElementById('adminConsejosWrap');
    if (!wrap || wrap.dataset.loaded === '1') return;
    wrap.dataset.loaded = '1';
    wrap.innerHTML = '<p class="guest-loading">Cargando mensajes...</p>';

    try {
        const { data, error } = await supabaseClient
            .from('consejos')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        if (!data || data.length === 0) {
            wrap.innerHTML = '<p class="guest-loading">Aún no hay mensajes.</p>';
            return;
        }

        const icons = { mensaje: '💌', consejo: '💡', anecdota: '📖', deseo: '🌟', cancion: '🎵', lugar: '📍' };
        wrap.innerHTML = '<div class="admin-consejos-grid">' + data.map(c => {
            const icon = icons[c.tipo] || '💬';
            return '<div class="admin-consejo-item">' +
                '<div class="consejo-icon">' + icon + '</div>' +
                '<p class="consejo-text">' + escapeHtml(c.mensaje) + '</p>' +
                '<p class="consejo-autor">— ' + escapeHtml(c.nombre) + '</p>' +
                '</div>';
        }).join('') + '</div>';
    } catch (err) {
        console.error(err);
        wrap.dataset.loaded = '0';
        wrap.innerHTML = '<p class="guest-loading">No se pudieron cargar los mensajes.</p>';
    }
}

async function cargarGaleriaAdmin() {
    const wrap = document.getElementById('adminGaleriaWrap');
    if (!wrap || wrap.dataset.loaded === '1') return;
    wrap.dataset.loaded = '1';
    wrap.innerHTML = '<p class="guest-loading">Cargando recuerdos...</p>';

    try {
        const { data, error } = await supabaseClient
            .from('galeria')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        if (!data || data.length === 0) {
            wrap.innerHTML = '<p class="guest-loading">Aún no hay recuerdos.</p>';
            return;
        }

        wrap.innerHTML = '<div class="admin-galeria-grid">' + data.map(item => {
            const media = item.tipo === 'video'
                ? '<video src="' + item.url + '" controls playsinline></video>'
                : '<img src="' + item.url + '" alt="Recuerdo de ' + escapeHtml(item.autor) + '" loading="lazy" />';
            return '<div class="admin-galeria-item">' + media +
                '<p class="galeria-autor">📷 ' + escapeHtml(item.autor) + '</p></div>';
        }).join('') + '</div>';
    } catch (err) {
        console.error(err);
        wrap.dataset.loaded = '0';
        wrap.innerHTML = '<p class="guest-loading">No se pudieron cargar los recuerdos.</p>';
    }
}
