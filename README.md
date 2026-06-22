<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Erick & Telma | Invitación de Boda</title>
  <meta name="description" content="Invitación de boda de Erick & Telma" />

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Montserrat:wght@300;400;500;600&display=swap"
    rel="stylesheet"
  />

  <style>
    :root{
      --bg: #f7f1ea;
      --bg-soft: #fbf7f2;
      --card: rgba(255,255,255,0.78);
      --white: #ffffff;
      --text: #3f352d;
      --text-soft: #6b5c50;
      --gold: #b08a5a;
      --gold-soft: #d8c2a3;
      --line: rgba(176, 138, 90, 0.25);
      --shadow: 0 18px 50px rgba(84, 64, 43, 0.12);
      --radius-xl: 28px;
      --radius-lg: 22px;
      --radius-md: 16px;
      --container: 1160px;
      --danger: #9f4f4f;
      --success: #4f7a54;
    }

    *{ box-sizing: border-box; margin: 0; padding: 0; }
    html{ scroll-behavior: smooth; }
    body{
      font-family: 'Montserrat', sans-serif;
      background:
        radial-gradient(circle at top right, rgba(216, 194, 163, 0.18), transparent 25%),
        radial-gradient(circle at left bottom, rgba(176, 138, 90, 0.10), transparent 30%),
        var(--bg);
      color: var(--text);
      line-height: 1.6;
      overflow-x: hidden;
    }

    img{ max-width: 100%; display: block; }
    a{ color: inherit; text-decoration: none; }

    .container{
      width: min(92%, var(--container));
      margin: 0 auto;
    }

    .section{
      padding: 80px 0;
      position: relative;
    }

    .section-title{
      text-align: center;
      margin-bottom: 18px;
      color: var(--gold);
      letter-spacing: 0.12em;
      text-transform: uppercase;
      font-size: 0.85rem;
      font-weight: 600;
    }

    .section-heading{
      text-align: center;
      font-family: 'Cormorant Garamond', serif;
      font-size: clamp(2rem, 4vw, 3.6rem);
      line-height: 1.1;
      font-weight: 600;
      margin-bottom: 14px;
    }

    .section-subtitle{
      max-width: 820px;
      margin: 0 auto;
      text-align: center;
      color: var(--text-soft);
      font-size: 1rem;
    }

    .glass-card{
      background: var(--card);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255,255,255,0.45);
      box-shadow: var(--shadow);
      border-radius: var(--radius-xl);
    }

    .hero{
      min-height: 100vh;
      position: relative;
      display: flex;
      align-items: center;
      overflow: hidden;
      isolation: isolate;
    }

    .hero::before{
      content: "";
      position: absolute;
      inset: 0;
      background:
        linear-gradient(to bottom, rgba(28, 23, 18, 0.28), rgba(28, 23, 18, 0.48)),
        url("./img/novios.jpg") center/cover no-repeat;
      z-index: -2;
      transform: scale(1.02);
    }

    .hero::after{
      content: "";
      position: absolute;
      inset: 0;
      background:
        radial-gradient(circle at top, rgba(255,255,255,0.10), transparent 20%),
        linear-gradient(to top, rgba(247, 241, 234, 1) 0%, rgba(247, 241, 234, 0) 35%);
      z-index: -1;
    }

    .hero-content{
      width: 100%;
      padding: 60px 0 50px;
    }

    .hero-card{
      max-width: 840px;
      margin: 0 auto;
      padding: 42px 28px;
      text-align: center;
      color: #fff;
      background: linear-gradient(180deg, rgba(255,255,255,0.14), rgba(255,255,255,0.08));
      border: 1px solid rgba(255,255,255,0.18);
      box-shadow: 0 20px 70px rgba(0,0,0,0.18);
      border-radius: 32px;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
    }

    .eyebrow{
      display: inline-block;
      padding: 10px 18px;
      border-radius: 999px;
      background: rgba(255,255,255,0.12);
      border: 1px solid rgba(255,255,255,0.18);
      letter-spacing: 0.18em;
      text-transform: uppercase;
      font-size: 0.76rem;
      margin-bottom: 20px;
    }

    .hero h1{
      font-family: 'Cormorant Garamond', serif;
      font-size: clamp(3.2rem, 8vw, 6rem);
      line-height: 0.95;
      font-weight: 700;
      margin-bottom: 14px;
      text-shadow: 0 10px 24px rgba(0,0,0,0.18);
    }

    .hero .ampersand{
      color: #f6dfbd;
      padding: 0 6px;
    }

    .hero p{
      max-width: 720px;
      margin: 0 auto;
      font-size: clamp(1rem, 2vw, 1.08rem);
      line-height: 1.8;
      color: rgba(255,255,255,0.94);
    }

    .hero-date{
      margin-top: 24px;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      font-size: 0.95rem;
      color: #fff4e5;
    }

    .hero-actions{
      display: flex;
      justify-content: center;
      gap: 14px;
      flex-wrap: wrap;
      margin-top: 30px;
    }

    .btn{
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      border: none;
      cursor: pointer;
      border-radius: 999px;
      padding: 14px 24px;
      font-weight: 600;
      transition: transform .25s ease, box-shadow .25s ease, background .25s ease, opacity .25s ease;
      font-size: 0.96rem;
    }

    .btn:hover{ transform: translateY(-2px); }
    .btn:disabled{ opacity: .65; cursor: not-allowed; transform: none; }

    .btn-primary{
      background: linear-gradient(135deg, #c9a97b, #a57d4f);
      color: #fff;
      box-shadow: 0 12px 28px rgba(165, 125, 79, 0.28);
    }

    .btn-secondary{
      background: rgba(255,255,255,0.12);
      color: #fff;
      border: 1px solid rgba(255,255,255,0.25);
      backdrop-filter: blur(6px);
    }

    .intro-card{
      margin-top: -72px;
      position: relative;
      z-index: 3;
      padding: 30px 24px;
      text-align: center;
    }

    .intro-card p{
      max-width: 920px;
      margin: 0 auto;
      color: var(--text-soft);
      font-size: 1.05rem;
      line-height: 1.9;
    }

    .date-pill{
      margin: 26px auto 0;
      width: fit-content;
      padding: 14px 22px;
      border-radius: 999px;
      background: linear-gradient(180deg, rgba(255,255,255,0.85), rgba(255,255,255,0.55));
      border: 1px solid var(--line);
      font-weight: 600;
      color: var(--gold);
      box-shadow: 0 10px 28px rgba(176, 138, 90, 0.10);
    }

    .countdown-wrap{ margin-top: 38px; }

    .countdown{
      display: grid;
      grid-template-columns: repeat(4, minmax(110px, 1fr));
      gap: 18px;
      margin-top: 26px;
    }

    .time-card{
      text-align: center;
      padding: 28px 18px;
      border-radius: var(--radius-lg);
      background: linear-gradient(180deg, rgba(255,255,255,0.92), rgba(255,255,255,0.72));
      border: 1px solid var(--line);
      box-shadow: 0 14px 34px rgba(84, 64, 43, 0.08);
    }

    .time-card .num{
      display: block;
      font-family: 'Cormorant Garamond', serif;
      font-size: clamp(2.2rem, 5vw, 3.4rem);
      font-weight: 700;
      color: var(--gold);
      line-height: 1;
    }

    .time-card .label{
      display: block;
      margin-top: 10px;
      font-size: 0.82rem;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: var(--text-soft);
    }

    .location-card{
      display: grid;
      grid-template-columns: 1.1fr 0.9fr;
      gap: 28px;
      align-items: stretch;
      padding: 30px;
      margin-top: 40px;
    }

    .location-copy{
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 14px;
    }

    .location-copy h3{
      font-family: 'Cormorant Garamond', serif;
      font-size: clamp(2rem, 4vw, 3rem);
      line-height: 1.1;
    }

    .location-copy p{ color: var(--text-soft); }

    .location-badge{
      display: inline-flex;
      align-items: center;
      gap: 10px;
      width: fit-content;
      padding: 10px 16px;
      border-radius: 999px;
      background: rgba(176, 138, 90, 0.08);
      color: var(--gold);
      font-weight: 600;
      border: 1px solid rgba(176, 138, 90, 0.14);
    }

    .location-side{
      min-height: 260px;
      border-radius: var(--radius-xl);
      background:
        linear-gradient(180deg, rgba(176, 138, 90, 0.08), rgba(176, 138, 90, 0.03)),
        url("./img/novios.jpg") center/cover no-repeat;
      position: relative;
      overflow: hidden;
    }

    .location-side::after{
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(25,18,12,0.22), rgba(25,18,12,0.08));
    }

    .timeline{
      margin-top: 38px;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }

    .timeline-item{
      position: relative;
      padding: 28px 24px;
      border-radius: var(--radius-lg);
      background: linear-gradient(180deg, rgba(255,255,255,0.92), rgba(255,255,255,0.76));
      border: 1px solid var(--line);
      box-shadow: 0 14px 34px rgba(84, 64, 43, 0.08);
      overflow: hidden;
    }

    .timeline-item::before{
      content: "";
      position: absolute;
      inset: auto auto 0 0;
      width: 100%;
      height: 3px;
      background: linear-gradient(90deg, transparent, var(--gold), transparent);
      opacity: 0.65;
    }

    .timeline-time{
      display: block;
      color: var(--gold);
      font-weight: 700;
      letter-spacing: 0.08em;
      margin-bottom: 10px;
    }

    .timeline-title{
      font-family: 'Cormorant Garamond', serif;
      font-size: 2rem;
      line-height: 1.1;
      margin-bottom: 8px;
    }

    .timeline-icon{
      font-size: 2rem;
      margin-bottom: 10px;
      display: inline-block;
    }

    .timeline-desc{
      color: var(--text-soft);
      font-size: 0.95rem;
    }

    .dress-grid,
    .gifts-grid,
    .guests-grid{
      margin-top: 34px;
      display: grid;
      gap: 20px;
    }

    .dress-grid{ grid-template-columns: repeat(2, 1fr); }
    .gifts-grid{ grid-template-columns: 1fr; }
    .guests-grid{ grid-template-columns: 1fr 1fr; align-items: stretch; }

    .info-card{
      padding: 32px 26px;
      border-radius: var(--radius-lg);
      background: linear-gradient(180deg, rgba(255,255,255,0.92), rgba(255,255,255,0.74));
      border: 1px solid var(--line);
      box-shadow: 0 14px 34px rgba(84, 64, 43, 0.08);
    }

    .info-card.center{ text-align: center; }

    .big-icon{
      font-size: 2.2rem;
      display: block;
      margin-bottom: 12px;
    }

    .card-title{
      font-family: 'Cormorant Garamond', serif;
      font-size: 2rem;
      margin-bottom: 8px;
      line-height: 1.1;
    }

    .muted{ color: var(--text-soft); }

    .dress-label{
      font-size: 1.2rem;
      font-weight: 600;
      margin-top: 10px;
    }

    .dress-note{
      margin-top: 8px;
      color: var(--text-soft);
      font-size: 0.95rem;
    }

    .gift-highlight{
      margin-top: 16px;
      padding: 16px 18px;
      border-radius: 18px;
      background: rgba(176, 138, 90, 0.08);
      border: 1px dashed rgba(176, 138, 90, 0.28);
      color: var(--gold);
      font-weight: 600;
    }

    .guest-box{
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 12px;
    }

    .guest-names{
      font-family: 'Cormorant Garamond', serif;
      font-size: clamp(2rem, 4vw, 3rem);
      line-height: 1.1;
      color: var(--gold);
    }

    .guest-badge{
      display: inline-flex;
      align-items: center;
      gap: 8px;
      width: fit-content;
      padding: 10px 14px;
      border-radius: 999px;
      background: rgba(176, 138, 90, 0.08);
      color: var(--gold);
      font-weight: 600;
      border: 1px solid rgba(176, 138, 90, 0.14);
    }

    .confirm-box{
      text-align: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 14px;
      min-height: 100%;
      background: linear-gradient(180deg, rgba(255,255,255,0.94), rgba(255,255,255,0.78));
    }

    .confirm-box .success{
      font-size: 3rem;
      line-height: 1;
    }

    .confirm-title{
      font-family: 'Cormorant Garamond', serif;
      font-size: clamp(2rem, 4vw, 2.8rem);
      line-height: 1.1;
      color: var(--gold);
    }

    .confirm-box strong{ color: var(--gold); }

    .rsvp-form{
      margin-top: 18px;
      display: grid;
      gap: 14px;
    }

    .form-group{
      display: grid;
      gap: 8px;
    }

    .form-label{
      font-size: .95rem;
      font-weight: 600;
      color: var(--text);
    }

    .form-control{
      width: 100%;
      border: 1px solid var(--line);
      background: rgba(255,255,255,0.92);
      border-radius: 14px;
      padding: 14px 16px;
      font: inherit;
      color: var(--text);
      outline: none;
      transition: border-color .2s ease, box-shadow .2s ease;
    }

    .form-control:focus{
      border-color: var(--gold);
      box-shadow: 0 0 0 4px rgba(176, 138, 90, 0.10);
    }

    textarea.form-control{
      min-height: 120px;
      resize: vertical;
    }

    .radio-group{
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    .radio-option{
      flex: 1;
      min-width: 140px;
      position: relative;
    }

    .radio-option input{
      position: absolute;
      opacity: 0;
      pointer-events: none;
    }

    .radio-option label{
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
      padding: 14px 16px;
      border-radius: 14px;
      border: 1px solid var(--line);
      background: rgba(255,255,255,0.92);
      cursor: pointer;
      font-weight: 600;
      transition: all .2s ease;
    }

    .radio-option input:checked + label{
      background: rgba(176, 138, 90, 0.10);
      border-color: var(--gold);
      color: var(--gold);
      box-shadow: 0 8px 20px rgba(176, 138, 90, 0.10);
    }

    .helper-text{
      font-size: .9rem;
      color: var(--text-soft);
    }

    .status-box{
      display: none;
      margin-top: 14px;
      padding: 14px 16px;
      border-radius: 14px;
      font-size: .95rem;
      font-weight: 500;
    }

    .status-box.show{ display: block; }

    .status-success{
      background: rgba(79, 122, 84, 0.10);
      border: 1px solid rgba(79, 122, 84, 0.20);
      color: var(--success);
    }

    .status-error{
      background: rgba(159, 79, 79, 0.10);
      border: 1px solid rgba(159, 79, 79, 0.20);
      color: var(--danger);
    }

    .status-info{
      background: rgba(176, 138, 90, 0.10);
      border: 1px solid rgba(176, 138, 90, 0.20);
      color: var(--gold);
    }

    .hidden{ display: none !important; }

    .footer{
      padding: 60px 0 40px;
      text-align: center;
      color: var(--text-soft);
    }

    .footer h3{
      font-family: 'Cormorant Garamond', serif;
      font-size: clamp(2rem, 4vw, 3rem);
      color: var(--text);
      margin-bottom: 12px;
    }

    .footer p{
      max-width: 720px;
      margin: 0 auto;
    }

    .divider{
      width: 120px;
      height: 1px;
      background: linear-gradient(90deg, transparent, var(--gold), transparent);
      margin: 22px auto 0;
      opacity: 0.7;
    }

    .fade-up{
      opacity: 0;
      transform: translateY(24px);
      transition: opacity .7s ease, transform .7s ease;
    }

    .fade-up.show{
      opacity: 1;
      transform: translateY(0);
    }

    @media (max-width: 992px){
      .location-card,
      .guests-grid{
        grid-template-columns: 1fr;
      }

      .timeline{
        grid-template-columns: 1fr 1fr;
      }
    }

    @media (max-width: 768px){
      .section{ padding: 64px 0; }
      .hero-card{ padding: 34px 20px; }
      .intro-card{ margin-top: -42px; }
      .countdown{ grid-template-columns: repeat(2, 1fr); }
      .timeline{ grid-template-columns: 1fr; }
      .dress-grid{ grid-template-columns: 1fr; }
      .location-card{ padding: 24px; }
    }

    @media (max-width: 480px){
      .countdown{ gap: 14px; }
      .time-card{ padding: 22px 12px; }
      .btn{ width: 100%; }
      .hero-actions{ flex-direction: column; }
    }
  </style>
</head>
<body>

  <!-- HERO -->
  <header class="hero">
    <div class="container hero-content">
      <div class="hero-card fade-up">
        <span class="eyebrow">Invitación de boda</span>

        <h1>
          Erick <span class="ampersand">&</span> Telma
        </h1>

        <p>
          Con el amor que nos une, la bendición de Dios y el apoyo de nuestros padres,
          te invitamos a celebrar el día más especial de nuestras vidas.
        </p>

        <div class="hero-date">15 de noviembre 2026</div>

        <div class="hero-actions">
          <a href="#ubicacion" class="btn btn-primary">Ver detalles</a>
          <a href="#invitados" class="btn btn-secondary">Confirmar asistencia</a>
        </div>
      </div>
    </div>
  </header>

  <!-- INTRO -->
  <section class="container">
    <div class="glass-card intro-card fade-up">
      <p>
        Nos llena de alegría compartir contigo este momento tan especial. Queremos celebrar
        nuestro amor, nuestra fe y el comienzo de esta nueva etapa rodeados de las personas
        que amamos.
      </p>
      <div class="date-pill">15 de noviembre 2026</div>
    </div>
  </section>

  <!-- COUNTDOWN -->
  <section class="section">
    <div class="container">
      <div class="fade-up">
        <div class="section-title">Cuenta regresiva</div>
        <h2 class="section-heading">Faltan solo unos instantes para nuestro gran día</h2>
        <p class="section-subtitle">
          Cada segundo nos acerca al “sí, acepto”.
        </p>

        <div class="countdown-wrap">
          <div class="countdown" id="countdown">
            <div class="time-card">
              <span class="num" id="days">00</span>
              <span class="label">Días</span>
            </div>
            <div class="time-card">
              <span class="num" id="hours">00</span>
              <span class="label">Horas</span>
            </div>
            <div class="time-card">
              <span class="num" id="minutes">00</span>
              <span class="label">Minutos</span>
            </div>
            <div class="time-card">
              <span class="num" id="seconds">00</span>
              <span class="label">Segundos</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- UBICACION -->
  <section class="section" id="ubicacion">
    <div class="container">
      <div class="section-title fade-up">Lugar</div>
      <h2 class="section-heading fade-up">Salsipuedes</h2>
      <p class="section-subtitle fade-up">
        El lugar donde celebraremos el comienzo de nuestra historia como esposos.
      </p>

      <div class="location-card glass-card fade-up">
        <div class="location-copy">
          <span class="location-badge">📍 Medellín, Antioquia</span>
          <h3>Salsipuedes</h3>
          <p>
            Hemos preparado este día con muchísimo amor y nos encantará compartirlo contigo
            en un ambiente elegante, cálido y lleno de momentos inolvidables.
          </p>

          <!-- CAMBIA ESTE LINK POR EL REAL DE GOOGLE MAPS -->
          <a
            class="btn btn-primary"
            href="https://maps.google.com/?q=Salsipuedes+Medellin"
            target="_blank"
            rel="noopener noreferrer"
            style="width: fit-content;"
          >
            Ver ubicación
          </a>
        </div>

        <div class="location-side" aria-label="Foto decorativa de la boda"></div>
      </div>
    </div>
  </section>

  <!-- ITINERARIO -->
  <section class="section" id="itinerario">
    <div class="container">
      <div class="section-title fade-up">Itinerario</div>
      <h2 class="section-heading fade-up">Así celebraremos nuestro gran día</h2>
      <p class="section-subtitle fade-up">
        Una noche para recordar, brindar, sonreír y celebrar juntos.
      </p>

      <div class="timeline">
        <article class="timeline-item fade-up">
          <span class="timeline-time">4:00 PM</span>
          <span class="timeline-icon">💍</span>
          <h3 class="timeline-title">Ceremonia</h3>
          <p class="timeline-desc">
            El momento en el que uniremos nuestras vidas delante de Dios y de las personas que amamos.
          </p>
        </article>

        <article class="timeline-item fade-up">
          <span class="timeline-time">5:30 PM</span>
          <span class="timeline-icon">📸</span>
          <h3 class="timeline-title">Sesión de Fotos</h3>
          <p class="timeline-desc">
            Sonrisas, abrazos, familia y recuerdos que quedarán para siempre en nuestra historia.
          </p>
        </article>

        <article class="timeline-item fade-up">
          <span class="timeline-time">6:30 PM</span>
          <span class="timeline-icon">🥂</span>
          <h3 class="timeline-title">Cena y Brindis</h3>
          <p class="timeline-desc">
            Compartiremos la mesa, celebraremos el amor y levantaremos las copas por este nuevo comienzo.
          </p>
        </article>

        <article class="timeline-item fade-up">
          <span class="timeline-time">9:30 PM</span>
          <span class="timeline-icon">✨</span>
          <h3 class="timeline-title">Cierre de la Velada</h3>
          <p class="timeline-desc">
            El broche final de una noche inolvidable, llena de gratitud, alegría y muchísimo amor.
          </p>
        </article>
      </div>
    </div>
  </section>

  <!-- DRESS CODE -->
  <section class="section" id="dresscode">
    <div class="container">
      <div class="section-title fade-up">Código de vestimenta</div>
      <h2 class="section-heading fade-up">Elegancia para una noche especial</h2>
      <p class="section-subtitle fade-up">
        Queremos que te sientas cómodo, pero también espectacular.
      </p>

      <div class="dress-grid">
        <div class="info-card center fade-up">
          <span class="big-icon">🤵</span>
          <h3 class="card-title">Formal</h3>
          <div class="dress-label">Caballeros</div>
          <p class="dress-note">
            Traje formal o vestimenta elegante acorde con la ocasión.
          </p>
        </div>

        <div class="info-card center fade-up">
          <span class="big-icon">👗</span>
          <h3 class="card-title">Largo</h3>
          <div class="dress-label">Damas</div>
          <p class="dress-note">
            Vestido largo o atuendo elegante para una celebración inolvidable.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- REGALOS -->
  <section class="section" id="regalos">
    <div class="container">
      <div class="section-title fade-up">Regalos</div>
      <h2 class="section-heading fade-up">Su presencia es nuestro mejor regalo</h2>
      <p class="section-subtitle fade-up">
        Pero si desean tener un detalle con nosotros, estaremos profundamente agradecidos.
      </p>

      <div class="gifts-grid">
        <div class="info-card center fade-up">
          <span class="big-icon">🎁</span>
          <h3 class="card-title">Lluvia de Sobres</h3>
          <p class="muted">
            Su presencia es nuestro mejor regalo. Pero si desean tener un detalle con nosotros:
          </p>

          <div class="gift-highlight">
            ✉️ Buzón en recepción
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- INVITADOS / RSVP -->
  <section class="section" id="invitados">
    <div class="container">
      <div class="section-title fade-up">Invitados</div>
      <h2 class="section-heading fade-up">Nos encantará celebrar contigo</h2>
      <p class="section-subtitle fade-up">
        Hemos reservado un lugar especial para ustedes en esta noche inolvidable.
      </p>

      <div class="guests-grid">
        <!-- TARJETA INVITADO -->
        <div class="info-card guest-box fade-up">
          <span class="big-icon">💌</span>

          <div class="guest-names" id="guestNames">
            Hola, invitado especial
          </div>

          <p class="muted">
            Hemos reservado <strong id="guestSpots">0</strong> lugares para ustedes.
          </p>

          <div class="guest-badge" id="guestRoleBadge">
            Invitación especial
          </div>

          <div id="guestStatusBox" class="status-box status-info show">
            Cargando tu invitación...
          </div>
        </div>

        <!-- FORM RSVP -->
        <div class="info-card fade-up" id="rsvpCard">
          <div class="confirm-box hidden" id="confirmSuccessBox">
            <div class="success">💌</div>
            <h3 class="confirm-title">¡Confirmación Recibida!</h3>
            <p class="muted" id="confirmSuccessText">
              ¡Qué alegría! Ya contamos contigo para el gran día.
              <strong>Erick Rondón y Telma Verónica</strong>.
            </p>
          </div>

          <div id="rsvpFormWrapper">
            <h3 class="card-title" style="text-align:center;">Confirmar asistencia</h3>
            <p class="muted" style="text-align:center; margin-top:6px;">
              Nos ayudaría muchísimo que confirmes tu asistencia.
            </p>

            <form id="rsvpForm" class="rsvp-form">
              <div class="form-group">
                <label class="form-label">¿Nos acompañarás?</label>
                <div class="radio-group">
                  <div class="radio-option">
                    <input type="radio" name="asiste" id="asiste_si" value="true" checked />
                    <label for="asiste_si">💍 Sí, asistiré</label>
                  </div>
                  <div class="radio-option">
                    <input type="radio" name="asiste" id="asiste_no" value="false" />
                    <label for="asiste_no">💔 No podré asistir</label>
                  </div>
                </div>
              </div>

              <div class="form-group" id="groupCantidad">
                <label class="form-label" for="cantidad_confirmada">¿Cuántos asistirán?</label>
                <select id="cantidad_confirmada" name="cantidad_confirmada" class="form-control"></select>
                <div class="helper-text" id="cantidadHelper"></div>
              </div>

              <div class="form-group">
                <label class="form-label" for="telefono">Teléfono</label>
                <input
                  id="telefono"
                  name="telefono"
                  type="text"
                  class="form-control"
                  placeholder="3001234567"
                  maxlength="30"
                />
              </div>

              <div class="form-group">
                <label class="form-label" for="mensaje">Mensaje para los novios</label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  class="form-control"
                  placeholder="Déjanos un mensaje bonito 💛"
                  maxlength="500"
                ></textarea>
              </div>

              <button type="submit" class="btn btn-primary" id="btnConfirmar">
                Confirmar asistencia
              </button>

              <div id="formStatus" class="status-box"></div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>

  <footer class="footer">
    <div class="container fade-up">
      <h3>Erick & Telma</h3>
      <p>
        Gracias por ser parte de nuestra historia y acompañarnos en este día tan especial.
        Será una alegría inmensa compartir contigo este momento que quedará para siempre en nuestro corazón.
      </p>
      <div class="divider"></div>
    </div>
  </footer>

  <!-- SUPABASE -->
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

  <script>
    // =========================================================
    // CONFIG
    // =========================================================
    const APP_CONFIG = {
      weddingDate: '2026-11-15T16:00:00',

      // 👇 PEGA AQUI TUS DATOS DE SUPABASE
      supabaseUrl: 'https://TU-PROYECTO.supabase.co',
      supabaseAnonKey: 'TU_SUPABASE_ANON_KEY',

      // Texto por defecto si el invitado no tiene rol
      defaultRoleLabel: 'Invitación especial'
    };

    // =========================================================
    // REFERENCIAS DOM
    // =========================================================
    const guestNamesEl = document.getElementById('guestNames');
    const guestSpotsEl = document.getElementById('guestSpots');
    const guestRoleBadgeEl = document.getElementById('guestRoleBadge');
    const guestStatusBoxEl = document.getElementById('guestStatusBox');

    const rsvpCardEl = document.getElementById('rsvpCard');
    const rsvpFormWrapperEl = document.getElementById('rsvpFormWrapper');
    const confirmSuccessBoxEl = document.getElementById('confirmSuccessBox');
    const confirmSuccessTextEl = document.getElementById('confirmSuccessText');

    const rsvpFormEl = document.getElementById('rsvpForm');
    const btnConfirmarEl = document.getElementById('btnConfirmar');
    const formStatusEl = document.getElementById('formStatus');

    const cantidadSelectEl = document.getElementById('cantidad_confirmada');
    const cantidadHelperEl = document.getElementById('cantidadHelper');
    const groupCantidadEl = document.getElementById('groupCantidad');

    const asisteSiEl = document.getElementById('asiste_si');
    const asisteNoEl = document.getElementById('asiste_no');

    const telefonoEl = document.getElementById('telefono');
    const mensajeEl = document.getElementById('mensaje');

    // =========================================================
    // ESTADO
    // =========================================================
    let supabaseClient = null;
    let invitadoActual = null;
    let tokenActual = null;

    // =========================================================
    // HELPERS UI
    // =========================================================
    function setStatus(element, type, message) {
      element.className = 'status-box show';

      if (type === 'success') {
        element.classList.add('status-success');
      } else if (type === 'error') {
        element.classList.add('status-error');
      } else {
        element.classList.add('status-info');
      }

      element.textContent = message;
    }

    function clearStatus(element) {
      element.className = 'status-box';
      element.textContent = '';
    }

    function disableRsvpForm(disabled) {
      const controls = rsvpFormEl.querySelectorAll('input, select, textarea, button');
      controls.forEach(ctrl => ctrl.disabled = disabled);
    }

    function escapeHtml(text) {
      return String(text ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
    }

    function getTokenFromUrl() {
      const params = new URLSearchParams(window.location.search);
      return params.get('token');
    }

    function fillCantidadOptions(maxCupos) {
      cantidadSelectEl.innerHTML = '';

      for (let i = 1; i <= maxCupos; i++) {
        const option = document.createElement('option');
        option.value = String(i);
        option.textContent = String(i);
        cantidadSelectEl.appendChild(option);
      }

      cantidadHelperEl.textContent = `Tienes ${maxCupos} lugar${maxCupos > 1 ? 'es' : ''} reservado${maxCupos > 1 ? 's' : ''}.`;
    }

    function toggleCantidadByAsistencia() {
      const asiste = asisteSiEl.checked;
      groupCantidadEl.classList.toggle('hidden', !asiste);
    }

    function renderInvitado(invitado) {
      invitadoActual = invitado;

      guestNamesEl.textContent = `Hola, ${invitado.nombre_apellido}`;
      guestSpotsEl.textContent = invitado.cupos_reservados;
      guestRoleBadgeEl.textContent = invitado.rol || APP_CONFIG.defaultRoleLabel;

      fillCantidadOptions(invitado.cupos_reservados);
      setStatus(
        guestStatusBoxEl,
        'info',
        'Tu invitación está lista. Ya puedes confirmar tu asistencia.'
      );
    }

    function renderRsvpExistente(rsvp) {
      if (!rsvp) return;

      if (rsvp.asiste === true) {
        confirmSuccessTextEl.innerHTML = `
          ¡Qué alegría! Ya contamos contigo para el gran día.
          <strong>Erick Rondón y Telma Verónica</strong>.
        `;
      } else {
        confirmSuccessTextEl.innerHTML = `
          Gracias por confirmarnos. Lamentaremos no contar contigo ese día,
          pero agradecemos mucho que nos hayas avisado 💛
        `;
      }

      rsvpFormWrapperEl.classList.add('hidden');
      confirmSuccessBoxEl.classList.remove('hidden');
    }

    function renderInvitacionInvalida(message) {
      guestNamesEl.textContent = 'Invitación no disponible';
      guestSpotsEl.textContent = '0';
      guestRoleBadgeEl.textContent = 'Acceso no válido';

      setStatus(
        guestStatusBoxEl,
        'error',
        message || 'No encontramos una invitación válida para este enlace.'
      );

      rsvpFormWrapperEl.classList.add('hidden');
    }

    // =========================================================
    // COUNTDOWN
    // =========================================================
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    const weddingDate = new Date(APP_CONFIG.weddingDate).getTime();

    function pad(num) {
      return String(num).padStart(2, '0');
    }

    function updateCountdown() {
      const now = new Date().getTime();
      const distance = weddingDate - now;

      if (distance <= 0) {
        daysEl.textContent = '00';
        hoursEl.textContent = '00';
        minutesEl.textContent = '00';
        secondsEl.textContent = '00';
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      daysEl.textContent = pad(days);
      hoursEl.textContent = pad(hours);
      minutesEl.textContent = pad(minutes);
      secondsEl.textContent = pad(seconds);
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    // =========================================================
    // ANIMACIONES
    // =========================================================
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

    // =========================================================
    // SUPABASE
    // =========================================================
    function initSupabase() {
      if (!APP_CONFIG.supabaseUrl || !APP_CONFIG.supabaseAnonKey ||
          APP_CONFIG.supabaseUrl.includes('TU-PROYECTO') ||
          APP_CONFIG.supabaseAnonKey.includes('TU_SUPABASE_ANON_KEY')) {
        throw new Error('Debes configurar supabaseUrl y supabaseAnonKey en APP_CONFIG.');
      }

      const { createClient } = window.supabase;
      supabaseClient = createClient(APP_CONFIG.supabaseUrl, APP_CONFIG.supabaseAnonKey);
    }

    async function cargarInvitadoPorToken(token) {
      const { data, error } = await supabaseClient
        .from('invitados')
        .select('id, nombre_apellido, cupos_reservados, rol, token, activo')
        .eq('token', token)
        .eq('activo', true)
        .single();

      if (error || !data) {
        throw new Error('No encontramos una invitación válida para este enlace.');
      }

      return data;
    }

    async function cargarRsvpPorInvitadoId(invitadoId) {
      const { data, error } = await supabaseClient
        .from('vw_invitados_rsvp')
        .select('asiste, cantidad_confirmada, telefono, mensaje, estado_rsvp')
        .eq('id', invitadoId)
        .single();

      if (error) {
        return null;
      }

      if (!data || data.estado_rsvp === 'pendiente') {
        return null;
      }

      return data;
    }

    async function confirmarRsvpPorToken(payload) {
      const { data, error } = await supabaseClient.rpc('confirmar_rsvp_por_token', payload);

      if (error) {
        throw error;
      }

      return data;
    }

    // =========================================================
    // FORM RSVP
    // =========================================================
    function buildRsvpPayload() {
      const asiste = rsvpFormEl.querySelector('input[name="asiste"]:checked')?.value === 'true';
      const cantidad = asiste ? Number(cantidadSelectEl.value || 1) : 0;

      return {
        p_token: tokenActual,
        p_asiste: asiste,
        p_cantidad_confirmada: cantidad,
        p_telefono: telefonoEl.value.trim() || null,
        p_mensaje: mensajeEl.value.trim() || null
      };
    }

    async function onSubmitRsvp(event) {
      event.preventDefault();
      clearStatus(formStatusEl);

      if (!tokenActual || !invitadoActual) {
        setStatus(formStatusEl, 'error', 'No hay una invitación válida para confirmar.');
        return;
      }

      const payload = buildRsvpPayload();

      try {
        disableRsvpForm(true);
        btnConfirmarEl.textContent = 'Guardando confirmación...';

        await confirmarRsvpPorToken(payload);

        if (payload.p_asiste) {
          confirmSuccessTextEl.innerHTML = `
            ¡Qué alegría! Ya contamos contigo para el gran día.
            <strong>Erick Rondón y Telma Verónica</strong>.
          `;
        } else {
          confirmSuccessTextEl.innerHTML = `
            Gracias por confirmarnos. Lamentaremos no contar contigo ese día,
            pero agradecemos mucho que nos hayas avisado 💛
          `;
        }

        rsvpFormWrapperEl.classList.add('hidden');
        confirmSuccessBoxEl.classList.remove('hidden');
        setStatus(guestStatusBoxEl, 'success', 'Tu confirmación ya quedó registrada.');

      } catch (error) {
        console.error(error);
        setStatus(
          formStatusEl,
          'error',
          error?.message || 'No se pudo guardar la confirmación. Intenta de nuevo.'
        );
      } finally {
        disableRsvpForm(false);
        btnConfirmarEl.textContent = 'Confirmar asistencia';
      }
    }

    // =========================================================
    // INIT
    // =========================================================
    async function initPage() {
      try {
        initSupabase();

        tokenActual = getTokenFromUrl();

        if (!tokenActual) {
          renderInvitacionInvalida('Este enlace no contiene token de invitación.');
          return;
        }

        const invitado = await cargarInvitadoPorToken(tokenActual);
        renderInvitado(invitado);

        const rsvpExistente = await cargarRsvpPorInvitadoId(invitado.id);

        if (rsvpExistente) {
          renderRsvpExistente(rsvpExistente);
        }
      } catch (error) {
        console.error(error);
        renderInvitacionInvalida(error?.message || 'No se pudo cargar la invitación.');
      }
    }

    // eventos
    asisteSiEl.addEventListener('change', toggleCantidadByAsistencia);
    asisteNoEl.addEventListener('change', toggleCantidadByAsistencia);
    rsvpFormEl.addEventListener('submit', onSubmitRsvp);

    toggleCantidadByAsistencia();
    initPage();
  </script>
</body>
</html>