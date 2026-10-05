// Monta o site publicado na Vercel: copia os arquivos do site para public/ e cria
// public/js/config.js com as chaves guardadas nas variáveis de ambiente do projeto
// (Settings > Environment Variables). O js/config.js não fica no Git: veja o README.
const fs = require('fs');
const path = require('path');

// No computador, nada é copiado e o js/config.js local não é tocado.
if (!process.env.VERCEL) {
  console.log('Fora da Vercel: nada a fazer; o js/config.js local não foi alterado.');
  process.exit(0);
}

// Só o que vai ao ar. Arquivo ou pasta nova do site precisa entrar nesta lista.
const ARQUIVOS = ['index.html', 'privacidade.html', 'favicon.png', 'css', 'js', 'img'];

const raiz = path.join(__dirname, '..');
const saida = path.join(raiz, 'public');
fs.rmSync(saida, { recursive: true, force: true });
for (const nome of ARQUIVOS) {
  fs.cpSync(path.join(raiz, nome), path.join(saida, nome), { recursive: true });
}

const config = {
  smartsuppKey: process.env.SMARTSUPP_KEY || '',
};
if (!config.smartsuppKey) {
  console.warn('Aviso: a variável SMARTSUPP_KEY não está definida na Vercel. O site vai ao ar sem o chat.');
}
fs.writeFileSync(
  path.join(saida, 'js', 'config.js'),
  `window.DONANA_CONFIG = ${JSON.stringify(config, null, 2)};\n`,
);
console.log(`Site montado em public/ (${ARQUIVOS.join(', ')}), com js/config.js.`);
