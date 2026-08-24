setupInvitacion({
    confirmedField: 'civil_confirmado',
    welcome: function (g) {
        return 'Te invitamos a nuestra boda civil, ' + g.nombre_apellido;
    },
    save: function (guest, asiste, cantidad, message) {
        return supabaseClient
            .from('invitados')
            .update({
                civil_confirmado: asiste,
                civil_cantidad_confirmada: cantidad,
                civil_fecha_confirmacion: new Date().toISOString(),
                mensaje: message || null
            })
            .eq('id', guest.id)
            .then(function (res) {
                if (res.error) throw res.error;
            });
    }
});
