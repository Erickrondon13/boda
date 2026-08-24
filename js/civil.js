setupInvitacion({
    confirmedField: 'civil_confirmado',
    welcome: function (g) {
        return 'Te invitamos a nuestra boda civil, ' + g.nombre_apellido;
    },
    save: function (guest, asiste, cantidad, message) {
        var base = guest.mensaje || '';
        var finalMsg = message ? (base ? base + '\n' + message : message) : base;

        return supabaseClient
            .from('invitados')
            .update({
                civil_confirmado: asiste,
                civil_cantidad_confirmada: cantidad,
                civil_fecha_confirmacion: new Date().toISOString(),
                mensaje: finalMsg || null
            })
            .eq('id', guest.id)
            .then(function (res) {
                if (res.error) throw res.error;
            });
    }
});
