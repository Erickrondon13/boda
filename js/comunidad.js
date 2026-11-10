/* =========================================================
   comunidad.js — Lógica de la página "Comunidad" (QR general)
   Opción 1: Consejos y más (muro de mensajes + datos del regalo)
   Opción 2: Galería (subida de fotos/videos a Supabase Storage)
   ========================================================= */

const COMUNIDAD_BUCKET = 'boda-media';
const MAX_FILE_MB = 50;

document.addEventListener('DOMContentLoaded', initComunidad);

function initComunidad() {
    setupOpciones();
    setupConsejos();
    setupGaleria();
    setupCompartir();
}

/* ───── Cambio entre las dos opciones ───── */
function setupOpciones() {
    const btnConsejos = document.getElementById('btnConsejos');
    const btnGaleria = document.getElementById('btnGaleria');
    const panelConsejos = document.getElementById('consejosPanel');
    const panelGaleria = document.getElementById('galeriaPanel');

    btnConsejos.addEventListener('click', function () {
        panelConsejos.classList.remove('hidden');
        panelGaleria.classList.add('hidden');
        btnConsejos.classList.add('active');
        btnGaleria.classList.remove('active');
        cargarConsejos();
    });

    btnGaleria.addEventListener('click', function () {
        panelGaleria.classList.remove('hidden');
        panelConsejos.classList.add('hidden');
        btnGaleria.classList.add('active');
        btnConsejos.classList.remove('active');
        cargarGaleria();
    });
}

/* ───── Utilidades ───── */
function show(id) {
    var el = document.getElementById(id);
    if (el) el.classList.remove('hidden');
}

function hide(id) {
    var el = document.getElementById(id);
    if (el) el.classList.add('hidden');
}

function escapeHtml(text) {
    return String(text).replace(/[&<>"']/g, function (c) {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[c];
    });
}

/* ───── Opción 1: Consejos y más ───── */
function setupConsejos() {
    const form = document.getElementById('consejoForm');
    if (!form) return;

    form.addEventListener('submit', async function (event) {
        event.preventDefault();
        hide('consejoError');
        hide('consejoSuccess');

        const nombre = document.getElementById('consejoNombre').value.trim() || 'Anónimo';
        const tipo = document.getElementById('consejoTipo').value;
        const mensaje = document.getElementById('consejoMensaje').value.trim();

        if (!mensaje) {
            showError('consejoError', 'Escribe un mensaje antes de enviar.');
            return;
        }

        try {
            const { error } = await supabaseClient
                .from('consejos')
                .insert({ nombre: nombre, tipo: tipo, mensaje: mensaje });

            if (error) throw error;

            form.reset();
            show('consejoSuccess');
            cargarConsejos();
        } catch (err) {
            console.error(err);
            showError('consejoError', 'No se pudo enviar tu mensaje.' + errorDetail(err));
        }
    });
}

async function cargarConsejos() {
    const lista = document.getElementById('listaConsejos');
    if (!lista || lista.dataset.loaded === '1') return;
    lista.dataset.loaded = '1';
    lista.innerHTML = '<p class="guest-loading">Cargando...</p>';

    try {
        const { data, error } = await supabaseClient
            .from('consejos')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        if (!data || data.length === 0) {
            lista.innerHTML = '<p class="guest-loading">Aún no hay mensajes. ¡Sé el primero!</p>';
            return;
        }

        lista.innerHTML = '';
        const icons = {
            mensaje: '💌',
            consejo: '💡',
            anecdota: '📖',
            deseo: '🌟',
            cancion: '🎵',
            lugar: '📍'
        };

        data.forEach(function (c) {
            const item = document.createElement('div');
            item.className = 'consejo-item';
            const icon = icons[c.tipo] || '💬';
            item.innerHTML =
                '<div class="consejo-icon">' + icon + '</div>' +
                '<p class="consejo-text">' + escapeHtml(c.mensaje) + '</p>' +
                '<p class="consejo-autor">— ' + escapeHtml(c.nombre) + '</p>';
            lista.appendChild(item);
        });
    } catch (err) {
        console.error(err);
        lista.dataset.loaded = '0';
        lista.innerHTML = '<p class="guest-loading">No se pudieron cargar los mensajes.</p>';
    }
}

/* ───── Opción 2: Galería de fotos/videos ───── */
function setupGaleria() {
    const form = document.getElementById('galeriaForm');
    if (!form) return;

    form.addEventListener('submit', async function (event) {
        event.preventDefault();
        hide('galeriaError');
        hide('galeriaSuccess');

        const fileInput = document.getElementById('galeriaFile');
        const file = fileInput.files && fileInput.files[0];

        if (!file) {
            showError('galeriaError', 'Selecciona una foto o video.');
            return;
        }

        if (file.size > MAX_FILE_MB * 1024 * 1024) {
            showError('galeriaError', 'El archivo es muy grande (máximo ' + MAX_FILE_MB + ' MB).');
            return;
        }

        const autor = document.getElementById('galeriaAutor').value.trim() || 'Anónimo';
        const btn = document.getElementById('btnSubir');
        show('galeriaLoading');
        if (btn) btn.disabled = true;

        try {
            const extension = (file.name.split('.').pop() || 'bin').toLowerCase().replace(/[^a-z0-9]/g, '');
            const path = 'media/' + Date.now() + '-' + Math.random().toString(36).slice(2) + '.' + extension;

            const { error: uploadError } = await supabaseClient.storage
                .from(COMUNIDAD_BUCKET)
                .upload(path, file, { cacheControl: '3600', upsert: false });

            if (uploadError) throw uploadError;

            const { data: urlData } = supabaseClient.storage
                .from(COMUNIDAD_BUCKET)
                .getPublicUrl(path);

            const url = urlData.publicUrl;
            const tipo = file.type.indexOf('video') === 0 ? 'video' : 'imagen';

            const { error: insertError } = await supabaseClient
                .from('galeria')
                .insert({ autor: autor, url: url, tipo: tipo });

            if (insertError) throw insertError;

            form.reset();
            show('galeriaSuccess');
            cargarGaleria(true);
        } catch (err) {
            console.error(err);
            showError('galeriaError', 'No se pudo subir' + errorDetail(err) + '. Intenta con otro archivo o más tarde.');
        } finally {
            hide('galeriaLoading');
            if (btn) btn.disabled = false;
        }
    });
}

async function cargarGaleria(force) {
    const grid = document.getElementById('galeriaGrid');
    if (!grid) return;
    if (grid.dataset.loaded === '1' && !force) return;
    grid.dataset.loaded = '1';
    grid.innerHTML = '<p class="guest-loading">Cargando recuerdos...</p>';

    try {
        const { data, error } = await supabaseClient
            .from('galeria')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        if (!data || data.length === 0) {
            grid.innerHTML = '<p class="guest-loading">Aún no hay recuerdos. ¡Sube el primero!</p>';
            return;
        }

        grid.innerHTML = '';
        data.forEach(function (item) {
            const div = document.createElement('div');
            div.className = 'galeria-item';
            const media = item.tipo === 'video'
                ? '<video src="' + item.url + '" controls playsinline></video>'
                : '<img src="' + item.url + '" alt="Recuerdo de ' + escapeHtml(item.autor) + '" loading="lazy" />';
            div.innerHTML = media + '<p class="galeria-autor">📷 ' + escapeHtml(item.autor) + '</p>';
            grid.appendChild(div);
        });
    } catch (err) {
        console.error(err);
        grid.dataset.loaded = '0';
        grid.innerHTML = '<p class="guest-loading">No se pudieron cargar los recuerdos.</p>';
    }
}

/* ───── Compartir / QR ───── */
function setupCompartir() {
    const url = window.location.href;
    const urlEl = document.getElementById('compartirUrl');
    if (urlEl) urlEl.textContent = url;

    const qrBox = document.getElementById('qrBox');
    const fallback = document.getElementById('qrFallback');

    if (typeof QRCode !== 'undefined' && qrBox) {
        new QRCode(qrBox, {
            text: url,
            width: 200,
            height: 200,
            colorDark: '#1a2744',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
        });
    } else if (fallback) {
        fallback.classList.remove('hidden');
    }

    const btn = document.getElementById('btnCopiarUrl');
    if (btn) {
        btn.addEventListener('click', async function () {
            try {
                await navigator.clipboard.writeText(url);
                btn.textContent = '¡Copiado!';
                setTimeout(function () { btn.textContent = 'Copiar enlace'; }, 1500);
            } catch (e) {
                /* El navegador no permitió copiar; el enlace ya es visible */
            }
        });
    }
}

function showError(id, message) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = message;
    el.classList.remove('hidden');
}

function errorDetail(err) {
    if (!err) return '';
    const parts = [];
    if (err.code) parts.push(err.code);
    if (err.message) parts.push(err.message);
    if (err.statusCode) parts.push('HTTP ' + err.statusCode);
    return parts.length ? ' (' + parts.join(' · ') + ')' : '';
}
