// Cria o js/config.js na hora do deploy na Vercel, com as chaves guardadas nas
// variáveis de ambiente do projeto (Settings > Environment Variables).
// O js/config.js não fica no Git: veja o README.
const fs = require('fs');
const path = require('path');

// No computador, o js/config.js é o seu e não é tocado.
if (!process.env.VERCEL) {
  console.log('Fora da Vercel: o js/config.js local não foi alterado.');
  process.exit(0);
}

const config = {
  smartsuppKey: process.env.SMARTSUPP_KEY || '',
};

if (!config.smartsuppKey) {
  console.warn('Aviso: a variável SMARTSUPP_KEY não está definida na Vercel. O site vai ao ar sem o chat.');
}

fs.writeFileSync(
  path.join(__dirname, '..', 'js', 'config.js'),
  `window.DONANA_CONFIG = ${JSON.stringify(config, null, 2)};\n`,
);
console.log('js/config.js criado.');
