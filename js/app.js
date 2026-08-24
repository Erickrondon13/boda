setupInvitacion({
    confirmedField: 'confirmado',
    welcome: function (g) {
        return 'Te invitamos, ' + g.nombre_apellido;
    },
    save: function (guest, asiste, cantidad, message) {
        var base = guest.mensaje || '';
        var finalMsg = message ? (base ? base + '\n' + message : message) : base;

        return supabaseClient
            .from('invitados')
            .update({
                confirmado: asiste,
                cantidad_confirmada: cantidad,
                mensaje: finalMsg || null,
                fecha_confirmacion: new Date().toISOString()
            })
            .eq('id', guest.id)
            .then(function (res) {
                if (res.error) throw res.error;
            });
    }
});
