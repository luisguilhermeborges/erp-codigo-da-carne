const xlsx = require('xlsx');
const fs = require('fs');

const CODIGOS_KIT_BURGUER = new Set([
  '210121', '3009', '003010', '20930', '20920', 
  '389008', '389021', '022074', '201'
]);

function getCategoriaPai(nome, codigo) {
  const cod = String(codigo ?? '').trim();
  if (CODIGOS_KIT_BURGUER.has(cod)) return 'Kit Burguer';

  const n = nome.toUpperCase();
  if (n.includes('BOV') || n.includes('WAGYU') || n.includes('ANGUS')) return 'Bovino';
  if (n.includes('FRANGO') || n.includes('GALETO') || n.includes('TULIPA')) return 'Frango';
  if (n.includes('SUIN') || n.includes('PANCETA') || n.includes('PORCHETTA') || n.includes('GUANCIALE')) return 'Suíno';
  if (n.includes('LING') || n.includes('CHOURIÇO')) return 'Linguiça';
  if (n.includes('CORDEIRO') || n.includes('CARRÉ')) return 'Cordeiro';
  if (n.includes('TILAPIA') || n.includes('BACALHAU') || n.includes('PEIXE')) return 'Pescados';
  if (n.includes('QUEIJO') || n.includes('PROVOLONE') || n.includes('CHEDDAR')) return 'Queijo';
  if (n.includes('CERVEJA') || n.includes('IPA') || n.includes('LAGER') || n.includes('STOUT') || n.includes('APA')) return 'Cerveja';
  if (n.includes('AGUA') || n.includes('REFRIGERANTE') || n.includes('COCA') || n.includes('SUCO') || n.includes('LICOR') || n.includes('AÇAÍ')) return 'Bebidas';
  if (n.includes('PAO') || n.includes('PÃO') || n.includes('MOLHO') || n.includes('SAL ') || n.includes('SALT ') || n.includes('RUB ') || n.includes('TEMPERO') || n.includes('FAROFA') || n.includes('BATATA') || n.includes('MANDIOCA') || n.includes('CALDO')) return 'Acompanhamento';
  if (n.includes('ESPETO') && !n.includes('BOV') && !n.includes('FRANGO') && !n.includes('QUEIJO')) return 'Acessório';
  if (n.includes('GRELHA') || n.includes('FACAS') || n.includes('AFIADOR') || n.includes('ABRIDOR') || n.includes('CHURRASQUEIRA') || n.includes('TABUA') || n.includes('LUVA') || n.includes('TERMIC') || n.includes('ISOPOR') || n.includes('CARVÃO') || n.includes('CARVAO') || n.includes('ACENDEDOR') || n.includes('GEL ') || n.includes('FÓSFORO') || n.includes('ALUMÍNIO') || n.includes('ASSAR') || n.includes('FILME')) return 'Acessório';
  if (n.includes('LENHA') || n.includes('SERRAGEM')) return 'Acessório';
  if (n.includes('TORRESMO') || n.includes('TORRESMINHO')) return 'Outros'; 
  if (n.includes('KIT BURGUER') || n.includes('BURGUER')) return 'Kit Burguer'; 
  if (n.includes('SORVETE') || n.includes('PICOLE')) return 'Sobremesa';  return 'Outros';
}

function getFilho(nome, pai) {
  if (pai === 'Kit Burguer') return 'Kit Burguer';
  const n = nome.toUpperCase();
  if (n.includes('LD') || n.includes('DUQUESA') || n.includes('MOIDA') || n.includes('MOÍDA') || n.includes('BIFE') || n.includes('CUBOS') || n.includes('PANELA') || n.includes('PICADINHO') || n.includes('EMPANADO') || n.includes('ISCA') || n.includes('MEDALHAO') || n.includes('ALMONDEGA')) {
    return 'Dia a Dia';
  }
  
  if (pai === 'Bovino' || pai === 'Frango' || pai === 'Suíno' || pai === 'Cordeiro' || pai === 'Linguiça') return 'Churrasco';
  if (pai === 'Bebidas' || pai === 'Cerveja') return 'Bebida';
  if (pai === 'Acessório') return 'Acessório';
  if (pai === 'Acompanhamento') return 'Acompanhamento';
  
  return 'Outros';
}

function getBisneto(nome) {
  const n = nome.toUpperCase();
  if (n.includes('LD') || n.includes('DUQUESA') || n.includes('LA DUQUESA')) return 'La Duquesa';
  if (n.includes('LA REINA')) return 'La Reina';
  if (n.includes('LA MAJESTAD')) return 'La majestad';
  if (n.includes('CODIGO SERIES') || n.includes('CÓDIGO SERIES')) return 'Codigo Series';
  if (n.includes('FSW')) return 'FSW';
  return 'Outras Marcas';
}

function getNeto(nome, filho) {
  const n = nome.toUpperCase();
  if (filho === 'Dia a Dia') return ''; 

  const cortes = ['ANCHO', 'ACEM', 'ACÉM', 'CHUCK EYE', 'ACENDEDOR', 'AFIADOR', 'AGUA', 'ÁGUA', 'ALCATRA', 'ASSADO DE TIRAS', 'BANANINHA', 'CERVEJA', 'REFRIGERANTE', 'CHORIZO', 'COSTELA', 'CUPIM', 'DENVER', 'ENTRANHA', 'FRALDA', 'FRALDINHA', 'LINGUIÇA', 'MAMINHA', 'MATAMBRITO', 'PEITO', 'PICANHA', 'PRIME RIB', 'PRIME STEAK', 'FLAT IRON', 'RAQUETE', 'SHORT RIB', 'T BONE', 'T-BONE', 'TORRESMO'];
  
  for (const corte of cortes) {
    if (n.includes(corte)) {
      if (corte === 'ACÉM') return 'ACEM';
      if (corte === 'ÁGUA') return 'AGUA';
      if (corte === 'FRALDINHA') return 'FRALDA';
      if (corte === 'FLAT IRON') return 'RAQUETE'; 
      return corte;
    }
  }
  
  return 'OUTROS';
}

function processItem(nomeO, info) {
    const pai = getCategoriaPai(nomeO, info.codigo);
    const filho = getFilho(nomeO, pai);
    const neto = getNeto(nomeO, filho);
    const bisneto = getBisneto(nomeO);

    return {
      codigo: info.codigo,
      unidade: info.unidade,
      preco_venda: info.preco_venda,
      pai,
      filho,
      neto,
      bisneto
    };
}

function run() {
  const itensDbSheet = xlsx.readFile('ITENS DB.xlsx').Sheets[xlsx.readFile('ITENS DB.xlsx').SheetNames[0]];
  const itensDbData = xlsx.utils.sheet_to_json(itensDbSheet);

  const databaseSheet = xlsx.readFile('ITENS DATABASE.xlsx').Sheets[xlsx.readFile('ITENS DATABASE.xlsx').SheetNames[0]];
  const databaseData = xlsx.utils.sheet_to_json(databaseSheet);

  const dbMap = {};
  const generatedCompleto = {};

  for (const item of itensDbData) {
    const desc = (item['(*) Descrição'] || '').toUpperCase().trim();
    if (desc) {
      const info = {
        codigo: item['(*) Código'],
        unidade: item['(*) Unidade de Medida'],
        preco_venda: item['Preço Venda']
      };
      dbMap[desc] = info;
      
      const nomeOriginal = item['(*) Descrição'].trim();
      generatedCompleto[nomeOriginal] = processItem(nomeOriginal, info);
    }
  }

  const generatedPadrao = {};
  
  for (const d of databaseData) {
    const nome = Object.values(d)[0]; 
    if (!nome) continue;
    const nomeO = nome.trim();
    const nomeUp = nomeO.toUpperCase();

    const info = dbMap[nomeUp] || { codigo: "N/A", unidade: "UN", preco_venda: "0" };
    generatedPadrao[nomeO] = processItem(nomeO, info);
  }

  const out = `// Arquivo gerado automaticamente pelo script generateBancoPadrao.cjs
// Banco Padrão Oficial - Código da Carne

// Itens selecionados para a página de Pedidos (375 itens)
export const BANCO_PADRAO = ${JSON.stringify(generatedPadrao, null, 2)};

// Todos os itens do sistema para a página de Gestão (~895 itens)
export const BANCO_COMPLETO = ${JSON.stringify(generatedCompleto, null, 2)};

export const ORDEM_CATEGORIAS_PAI = [
  "Bovino",
  "Frango",
  "Suíno",
  "Linguiça",
  "Cordeiro",
  "Pescados",
  "Queijo",
  "Cerveja",
  "Bebidas",
  "Acompanhamento",
  "Outros",
  "Sobremesa",
  "Acessório",
  "Dia a Dia",
  "Kit Burguer"
];

export const ORDEM_FILHOS = [
  "Kit Burguer",
  "Churrasco",
  "Dia a Dia",
  "Bebida",
  "Acompanhamento",
  "Acessório",
  "Outros"
];
`;

  fs.writeFileSync('src/data/bancoPadrao.js', out);
  console.log("bancoPadrao.js generated with", Object.keys(generatedPadrao).length, "standard items and", Object.keys(generatedCompleto).length, "complete items.");
}

run();
