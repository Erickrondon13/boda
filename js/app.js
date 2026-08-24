setupInvitacion({
    confirmedField: 'confirmado',
    welcome: function (g) {
        return 'Te invitamos, ' + g.nombre_apellido;
    },
    save: function (guest, asiste, cantidad, message) {
        return supabaseClient
            .from('invitados')
            .update({
                confirmado: asiste,
                cantidad_confirmada: cantidad,
                mensaje: message || null,
                fecha_confirmacion: new Date().toISOString()
            })
            .eq('id', guest.id)
            .then(function (res) {
                if (res.error) throw res.error;
            });
    }
});
