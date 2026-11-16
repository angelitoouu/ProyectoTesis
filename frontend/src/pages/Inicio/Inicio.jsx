import { Link } from 'react-router-dom';

const Inicio = () => {
  return (
    <div className="container" style={{ maxWidth: '960px', paddingBottom: '3rem' }}>
      {/* Hero Principal */}
      <div
        className="page-header"
        style={{
          textAlign: 'center',
          marginTop: '1.5rem',
          marginBottom: '2.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.35rem 0.9rem',
            background: 'var(--primary-light)',
            color: 'var(--primary-dark)',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.82rem',
            fontWeight: 700,
            marginBottom: '0.8rem',
            border: '1px solid var(--primary-border)',
          }}
        >
        Servicio de Costura y Confección a Medida
        </span>

        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.2, margin: '0.4rem 0' }}>
          Taller de Costura
        </h1>

        <p style={{ maxWidth: '620px', fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: 1.6, marginTop: '0.4rem' }}>
          Gestión profesional de pedidos, ajustes, arreglos y confección de prendas.
          Consulta el estado de tu pedido en tiempo real o solicita un nuevo trabajo.
        </p>
      </div>

      {/* Tarjetas Principales de Acción para el Cliente */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2.5rem',
        }}
      >
        {/* Tarjeta 1: Solicitar Encargo */}
        <div
          className="form-card"
          style={{
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderTop: '4px solid var(--primary)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
        >
          <div>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
              }}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14" />
                <path d="M5 12h14" />
              </svg>
            </div>

            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              Solicitar Encargo
            </h2>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              ¿Tienes una prenda para arreglar, ajustar o confeccionar? Registra tu solicitud de forma rápida con tus medidas corporales.
            </p>
          </div>

          <Link
            to="/solicitar"
            className="btn btn-primary"
            style={{
              width: '100%',
              justifyContent: 'center',
              padding: '0.75rem 1.2rem',
              fontSize: '0.95rem',
              fontWeight: 700,
            }}
          >
            Pedir Encargo
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Tarjeta 2: Consultar Estado */}
        <div
          className="form-card"
          style={{
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderTop: '4px solid var(--accent-purple)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
        >
          <div>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-sm)',
                background: '#f5f3ff',
                color: 'var(--accent-purple)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>

            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              Seguimiento de Pedido
            </h2>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              ¿Ya dejaste tu ropa en el taller? Revisa en qué etapa de confección se encuentra y tu saldo pendiente usando tu número o ticket.
            </p>
          </div>

          <Link
            to="/consulta"
            className="btn btn-secondary"
            style={{
              width: '100%',
              justifyContent: 'center',
              padding: '0.75rem 1.2rem',
              fontSize: '0.95rem',
              fontWeight: 700,
            }}
          >
            Consultar Estado
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Sección Informativa: Cómo Funciona el Taller */}
      <div
        style={{
          background: 'var(--surface)',
          padding: '2rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-xs)',
        }}
      >
        <h3
          style={{
            fontSize: '1.1rem',
            fontWeight: 800,
            color: 'var(--text-main)',
            textAlign: 'center',
            marginBottom: '1.5rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          ¿Cómo funciona nuestro servicio?
        </h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.5rem',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'var(--primary)',
                color: '#ffffff',
                fontWeight: 800,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '0.6rem',
              }}
            >
              1
            </div>
            <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.3rem' }}>
              Registro y Medidas
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
              Ingresa los datos de tu prenda y medidas corporales necesarias para un ajuste perfecto.
            </p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'var(--accent-purple)',
                color: '#ffffff',
                fontWeight: 800,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '0.6rem',
              }}
            >
              2
            </div>
            <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.3rem' }}>
              Avance en Taller
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
              Tu prenda pasa por los estados de confección: Pendiente, En proceso y Listo para prueba.
            </p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'var(--accent-emerald)',
                color: '#ffffff',
                fontWeight: 800,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '0.6rem',
              }}
            >
              3
            </div>
            <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.3rem' }}>
              Retiro con Ticket
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
              Con tu código único de ticket retiras tu prenda en la fecha acordada y cancelas el saldo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inicio;

