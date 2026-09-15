// Genera un código de ticket simple y legible, ej: TK-4821
const generateTicket = () => {
  const random = Math.floor(1000 + Math.random() * 9000);
  return `TK-${random}`;
};

module.exports = generateTicket;
