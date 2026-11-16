const nodemailer = require('nodemailer');

const enviarTicketPorCorreo = async ({ email, nombre, ticket, prenda, trabajo, abono, precio_total }) => {
  if (!email || !email.includes('@')) {
    return false;
  }

  try {
    let transporter;

    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      // Configuración para Gmail o servidor SMTP real
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS, // Contraseña de aplicación de Gmail (16 letras)
        },
      });
    } else {
      // Si no hay credenciales configuradas en el .env, usa cuenta de prueba Ethereal
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    }

    const infoPago = Number(abono) > 0
      ? `<p><strong>Abono registrado:</strong> $${Number(abono).toLocaleString('es-CL')} (Saldo pendiente: $${Math.max(0, (Number(precio_total) || 0) - Number(abono)).toLocaleString('es-CL')})</p>`
      : `<p><strong>Forma de pago elegida:</strong> Pago al momento de retirar o acordar la entrega.</p>`;

    const mailOptions = {
      from: `"Taller de Costura" <${process.env.SMTP_FROM || 'no-reply@tallerdecostura.com'}>`,
      to: email,
      subject: `Comprobante de Solicitud de Encargo - Ticket: ${ticket}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #4f46e5; margin-bottom: 10px;">¡Hola, ${nombre || 'Cliente'}!</h2>
          <p>Hemos recibido correctamente tu solicitud de encargo en el <strong>Taller de Costura</strong>.</p>
          
          <div style="background-color: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 8px; padding: 15px; margin: 20px 0; text-align: center;">
            <p style="margin: 0; font-size: 14px; color: #64748b; font-weight: bold; text-transform: uppercase;">Tu Código de Seguimiento (Ticket)</p>
            <h1 style="margin: 8px 0; font-size: 32px; letter-spacing: 2px; color: #1e293b;">${ticket}</h1>
            <p style="margin: 0; font-size: 13px; color: #64748b;">Guarda este código para consultar el avance de tu prenda en nuestra web.</p>
          </div>

          <h3 style="color: #334155; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;">Detalles del Encargo:</h3>
          <ul style="color: #475569; line-height: 1.6;">
            <li><strong>Prenda:</strong> ${prenda}</li>
            ${trabajo ? `<li><strong>Detalle del trabajo:</strong> ${trabajo}</li>` : ''}
          </ul>

          <div style="background: #f1f5f9; padding: 10px 15px; border-radius: 6px; margin: 15px 0;">
            ${infoPago}
          </div>

          <p style="color: #64748b; font-size: 13px; margin-top: 25px;">
            Atentamente,<br>
            <strong>Taller de Costura</strong>
          </p>
        </div>
      `,
    };

    console.log(`Intentando enviar correo a: ${email} usando cuenta: ${process.env.SMTP_USER || 'Ethereal'}`);
    const info = await transporter.sendMail(mailOptions);
    console.log(`Correo enviado exitosamente a ${email}. Mensaje ID: ${info.messageId}`);
    return true;
  } catch (err) {
    console.error('Error al enviar correo del ticket:', err.message);
    return false;
  }
};

module.exports = { enviarTicketPorCorreo };

