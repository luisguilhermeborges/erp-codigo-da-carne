// Banco de Dados Oficial - Código da Carne
// Versão 5.0 — Completo com Categorias, Subcategorias, Cortes, Linhas e Marcas integradas nas tags

export const BANCO_PADRAO = {

  // ══════════════════════════════════════════════════
  // KIT BURGUER
  // ══════════════════════════════════════════════════
  "KIT BURGUER SIMPLES": { codigo: "290223", categoria: "KIT BURGUER", tags: ["KIT BURGUER", "CDC", "BURGUER", "HAMBURGUER", "KIT"], unidade: "UN" },
  "KIT BURGUER BOVINO FSW": { codigo: "290230", categoria: "KIT BURGUER", tags: ["KIT BURGUER", "BOVINO", "FSW", "CDC", "BURGUER", "HAMBURGUER", "KIT"], unidade: "UN" },
  "KIT BURGUER WAGYU": { codigo: "290227", categoria: "KIT BURGUER", tags: ["KIT BURGUER", "BOVINO", "OUTRAS MARCAS", "CDC", "BURGUER", "HAMBURGUER", "KIT", "WAGYU", "PREMIUM"], unidade: "UN" },
  "KIT BURGUER SUÍNO": { codigo: "290224", categoria: "KIT BURGUER", tags: ["KIT BURGUER", "SUINO", "CDC", "BURGUER", "HAMBURGUER", "KIT"], unidade: "UN" },
  "KIT BURGUER MISTO": { codigo: "290225", categoria: "KIT BURGUER", tags: ["KIT BURGUER", "CDC", "BURGUER", "HAMBURGUER", "KIT", "MISTO"], unidade: "UN" },
  "KIT MINI BURGUER": { codigo: "290226", categoria: "KIT BURGUER", tags: ["KIT BURGUER", "CDC", "BURGUER", "MINI", "HAMBURGUER", "KIT"], unidade: "UN" },
  "BURGUER BOMB": { codigo: "027102", categoria: "KIT BURGUER", tags: ["KIT BURGUER", "CDC", "BURGUER", "HAMBURGUER"], unidade: "UN" },

  // ══════════════════════════════════════════════════
  // BOVINO — PICANHA
  // ══════════════════════════════════════════════════
  "PICANHA BOV PEC AZUL FSW": { codigo: "044315", categoria: "BOVINO", tags: ["BOVINO", "PICANHA", "FSW", "FRIBOI", "AZUL", "CHURRASCO"], unidade: "KG" },
  "PICANHA BOV LA MAJESTAD": { codigo: "087200", categoria: "BOVINO", tags: ["BOVINO", "PICANHA", "LA MAJESTAD", "CHURRASCO", "PREMIUM"], unidade: "KG" },
  "PICANHA BOV PEC PRETA FSW": { codigo: "044005", categoria: "BOVINO", tags: ["BOVINO", "PICANHA", "FSW", "FRIBOI", "PRETA", "CHURRASCO"], unidade: "KG" },
  "PICANHA BOV LA REINA": { codigo: "080300", categoria: "BOVINO", tags: ["BOVINO", "PICANHA", "LA REINA", "CHURRASCO"], unidade: "KG" },
  "PICANHA BOV ESTRELA NOBRE": { codigo: "018006", categoria: "BOVINO", tags: ["BOVINO", "PICANHA", "OUTRAS MARCAS", "ESTRELA NOBRE", "CHURRASCO"], unidade: "KG" },
  "PICANHA BOV CODIGO SERIES": { codigo: "053005", categoria: "BOVINO", tags: ["BOVINO", "PICANHA", "CODIGO SERIES", "CHURRASCO"], unidade: "KG" },
  "PICANHA BOV PEC VERMELHA CABANA LAS LILAS MINERVA": { codigo: "095340", categoria: "BOVINO", tags: ["BOVINO", "PICANHA", "OUTRAS MARCAS", "LAS LILAS", "MINERVA", "PREMIUM", "IMPORTADO"], unidade: "KG" },
  "PICANHA BOV PEC WAGYU JC": { codigo: "017617", categoria: "BOVINO", tags: ["BOVINO", "PICANHA", "OUTRAS MARCAS", "JC", "WAGYU", "PREMIUM", "CHURRASCO"], unidade: "KG" },
  "PICANHA TIRAS BOV 180G/200G PRETA FSW": { codigo: "044552", categoria: "BOVINO", tags: ["BOVINO", "PICANHA", "FSW", "FRIBOI", "TIRAS", "PRETA", "PORCIONADO"], unidade: "KG" },

  // ══════════════════════════════════════════════════
  // BOVINO — FILÉ DE COSTELA / ANCHO
  // ══════════════════════════════════════════════════
  "FILE DE COSTELA BOV ANCHO STEAK LA MAJESTAD": { codigo: "086204", categoria: "BOVINO", tags: ["BOVINO", "FILE DE COSTELA", "ANCHO", "LA MAJESTAD", "STEAK", "CHURRASCO"], unidade: "KG" },
  "FILE DE COSTELA BOV ANCHO STEAK CODIGO SERIES": { codigo: "089209", categoria: "BOVINO", tags: ["BOVINO", "FILE DE COSTELA", "ANCHO", "CODIGO SERIES", "STEAK"], unidade: "KG" },
  "FILE DE COSTELA BOV ANCHO STEAK LA REINA": { codigo: "086206", categoria: "BOVINO", tags: ["BOVINO", "FILE DE COSTELA", "ANCHO", "LA REINA", "STEAK"], unidade: "KG" },
  "FILE DE COSTELA BOV ANCHO STEAK RESERVA COPPER ALIANÇA": { codigo: "013012", categoria: "BOVINO", tags: ["BOVINO", "FILE DE COSTELA", "ANCHO", "OUTRAS MARCAS", "RESERVA COPPER", "ALIANÇA", "STEAK", "RESERVA", "PREMIUM"], unidade: "KG" },
  "FILE DE COSTELA C/ OSSO BOV TOMAHAWK PRETA FSW": { codigo: "044092", categoria: "BOVINO", tags: ["BOVINO", "FILE DE COSTELA", "ANCHO", "FSW", "FRIBOI", "TOMAHAWK", "COM OSSO", "PRETA", "PREMIUM"], unidade: "KG" },
  "ANCHO M 5-6 BOV STEAK WAGYU GUIDARA": { codigo: "090316", categoria: "BOVINO", tags: ["BOVINO", "FILE DE COSTELA", "ANCHO", "OUTRAS MARCAS", "GUIDARA", "WAGYU", "STEAK", "PREMIUM"], unidade: "KG" },

  // ══════════════════════════════════════════════════
  // BOVINO — CONTRAFILÉ / CHORIZO
  // ══════════════════════════════════════════════════
  "CONTRAFILE BOV CHORIZO STEAK LA REINA": { codigo: "085206", categoria: "BOVINO", tags: ["BOVINO", "CONTRAFILE", "CHORIZO", "LA REINA", "STEAK", "CHURRASCO"], unidade: "KG" },
  "CONTRAFILE BOV CHORIZO STEAK LA MAJESTAD": { codigo: "085204", categoria: "BOVINO", tags: ["BOVINO", "CONTRAFILE", "CHORIZO", "LA MAJESTAD", "STEAK"], unidade: "KG" },
  "CONTRAFILE BOV CHORIZO STEAK CODIGO SERIES": { codigo: "029092", categoria: "BOVINO", tags: ["BOVINO", "CONTRAFILE", "CHORIZO", "CODIGO SERIES", "STEAK"], unidade: "KG" },
  "CONTRAFILE BOV CHORIZO STEAK TIRA LA MAJESTAD": { codigo: "085205", categoria: "BOVINO", tags: ["BOVINO", "CONTRAFILE", "CHORIZO", "LA MAJESTAD", "STEAK", "TIRA"], unidade: "KG" },
  "CONTRA FILE BOV CHORIZO STEAK RESERVA COPPER ALIANÇA": { codigo: "013007", categoria: "BOVINO", tags: ["BOVINO", "CONTRAFILE", "CHORIZO", "OUTRAS MARCAS", "RESERVA COPPER", "ALIANÇA", "STEAK", "RESERVA", "PREMIUM"], unidade: "KG" },
  "BISTECA COM FILE BOV LA MAJESTAD": { codigo: "089127", categoria: "BOVINO", tags: ["BOVINO", "CONTRAFILE", "CHORIZO", "LA MAJESTAD", "BISTECA", "FILE"], unidade: "KG" },
  "FILÉ MIGNON CILINDRO LA DUQUESA": { codigo: "060123", categoria: "BOVINO", tags: ["BOVINO", "FILE MIGNON", "OUTRAS MARCAS", "LA DUQUESA", "CILINDRO", "PREMIUM"], unidade: "KG" },

  // ══════════════════════════════════════════════════
  // BOVINO — MAMINHA
  // ══════════════════════════════════════════════════
  "MAMINHA BOV PEC AZUL FSW": { codigo: "053003", categoria: "BOVINO", tags: ["BOVINO", "MAMINHA", "FSW", "FRIBOI", "AZUL"], unidade: "KG" },
  "MAMINHA BOV PRETA FSW": { codigo: "044003", categoria: "BOVINO", tags: ["BOVINO", "MAMINHA", "FSW", "FRIBOI", "PRETA"], unidade: "KG" },
  "MAMINHA BOV LA REINA": { codigo: "084001", categoria: "BOVINO", tags: ["BOVINO", "MAMINHA", "LA REINA"], unidade: "KG" },
  "MAMINHA BOV LA MAJESTAD": { codigo: "084010", categoria: "BOVINO", tags: ["BOVINO", "MAMINHA", "LA MAJESTAD"], unidade: "KG" },
  "MAMINHA BOV STEAK LA REINA": { codigo: "040723", categoria: "BOVINO", tags: ["BOVINO", "MAMINHA", "LA REINA", "STEAK"], unidade: "KG" },
  "MAMINHA BOV PEÇ CODIGO SERIES": { codigo: "084020", categoria: "BOVINO", tags: ["BOVINO", "MAMINHA", "CODIGO SERIES"], unidade: "KG" },
  "MAMINHA DA ALCATRA BOV PEÇ WAGYU JC": { codigo: "017616", categoria: "BOVINO", tags: ["BOVINO", "MAMINHA", "ALCATRA", "OUTRAS MARCAS", "JC", "WAGYU", "PREMIUM"], unidade: "KG" },
  "MAMINHA DA ALCATRA BOV PEÇ RESERVA COPPER ALIANÇA": { codigo: "013020", categoria: "BOVINO", tags: ["BOVINO", "MAMINHA", "ALCATRA", "OUTRAS MARCAS", "RESERVA COPPER", "ALIANÇA", "RESERVA"], unidade: "KG" },
  "MAMINHA BOV FDS CDC": { codigo: "000138", categoria: "BOVINO", tags: ["BOVINO", "MAMINHA", "CDC", "FDS"], unidade: "KG" },
  "MAMINHA BOV PEÇ VACA VELHA": { codigo: "005207", categoria: "BOVINO", tags: ["BOVINO", "MAMINHA", "OUTRAS MARCAS", "VACA VELHA", "PREMIUM"], unidade: "KG" },

  // ══════════════════════════════════════════════════
  // BOVINO — ALCATRA
  // ══════════════════════════════════════════════════
  "ALCATRA BOV BIFES LD": { codigo: "080100", categoria: "BOVINO", tags: ["BOVINO", "ALCATRA", "LD", "BIFES"], unidade: "KG" },
  "ALCATRA BOV PICADINHO LD": { codigo: "080120", categoria: "BOVINO", tags: ["BOVINO", "ALCATRA", "LD", "PICADINHO"], unidade: "KG" },
  "ALCATRA BIFES EMPANADO LD": { codigo: "024075", categoria: "BOVINO", tags: ["BOVINO", "ALCATRA", "LD", "BIFES", "EMPANADO"], unidade: "KG" },

  // ══════════════════════════════════════════════════
  // BOVINO — FILÉ MIGNON
  // ══════════════════════════════════════════════════
  "FILE MIGNON BOV MEDALHÃO LD": { codigo: "080720", categoria: "BOVINO", tags: ["BOVINO", "FILE MIGNON", "LD", "MEDALHAO"], unidade: "KG" },
  "FILE MIGNON BOV PICADINHO LD": { codigo: "080850", categoria: "BOVINO", tags: ["BOVINO", "FILE MIGNON", "LD", "PICADINHO"], unidade: "KG" },
  "FILE MIGNON BOV BIFES LD": { codigo: "060621", categoria: "BOVINO", tags: ["BOVINO", "FILE MIGNON", "LD", "BIFES"], unidade: "KG" },
  "FILE MIGNON BOV PEÇ S/ CORDÃO LD": { codigo: "060620", categoria: "BOVINO", tags: ["BOVINO", "FILE MIGNON", "LD", "SEM CORDÃO", "PECA"], unidade: "KG" },

  // ══════════════════════════════════════════════════
  // BOVINO — FRALDA
  // ══════════════════════════════════════════════════
  "FRALDA BOV LA REINA": { codigo: "082002", categoria: "BOVINO", tags: ["BOVINO", "FRALDA", "LA REINA", "CHURRASCO"], unidade: "KG" },
  "FRALDA RED BOV PEÇ ESTRELA MOMENTOS ESPECIAIS": { codigo: "018041", categoria: "BOVINO", tags: ["BOVINO", "FRALDA", "OUTRAS MARCAS", "ESTRELA", "RED", "MOMENTOS ESPECIAIS"], unidade: "KG" },
  "FRALDA RED BOV FSW AZUL": { codigo: "044313", categoria: "BOVINO", tags: ["BOVINO", "FRALDA", "FSW", "RED", "AZUL"], unidade: "KG" },
  "FRALDA BOV LA MAJESTAD": { codigo: "030064", categoria: "BOVINO", tags: ["BOVINO", "FRALDA", "LA MAJESTAD"], unidade: "KG" },
  "FRALDA RED PEÇ PRETA FSW": { codigo: "044013", categoria: "BOVINO", tags: ["BOVINO", "FRALDA", "FSW", "RED", "PRETA"], unidade: "KG" },
  "FRALDA RED BOV LA MAJESTAD": { codigo: "082004", categoria: "BOVINO", tags: ["BOVINO", "FRALDA", "LA MAJESTAD", "RED"], unidade: "KG" },
  "FRALDA RED BOV PEC WAGYU GUIDARA": { codigo: "023304", categoria: "BOVINO", tags: ["BOVINO", "FRALDA", "OUTRAS MARCAS", "GUIDARA", "WAGYU", "RED", "PREMIUM"], unidade: "KG" },
  "FRALDA BOV PEC VACA VELHA PRETA FSW": { codigo: "044567", categoria: "BOVINO", tags: ["BOVINO", "FRALDA", "FSW", "VACA VELHA", "PRETA"], unidade: "KG" },

  // ══════════════════════════════════════════════════
  // BOVINO — ASSADO DE TIRAS
  // ══════════════════════════════════════════════════
  "ASSADO DE TIRAS BOV AZUL FSW": { codigo: "060030", categoria: "BOVINO", tags: ["BOVINO", "ASSADO DE TIRAS", "FSW", "AZUL"], unidade: "KG" },
  "ASSADO DE TIRAS BOV PRETA FSW": { codigo: "044094", categoria: "BOVINO", tags: ["BOVINO", "ASSADO DE TIRAS", "FSW", "PRETA"], unidade: "KG" },
  "ASSADO DE TIRAS BOV GRAN CAMPEON PATAGONIA": { codigo: "000755", categoria: "BOVINO", tags: ["BOVINO", "ASSADO DE TIRAS", "OUTRAS MARCAS", "GRAN CAMPEON", "PATAGONIA", "PREMIUM", "IMPORTADO"], unidade: "KG" },
  "ASSADO DE TIRAS BOV LA MAJESTAD": { codigo: "087850", categoria: "BOVINO", tags: ["BOVINO", "ASSADO DE TIRAS", "LA MAJESTAD"], unidade: "KG" },
  "ASSADO DE TIRAS BOV LA REINA": { codigo: "088850", categoria: "BOVINO", tags: ["BOVINO", "ASSADO DE TIRAS", "LA REINA"], unidade: "KG" },
  "ASSADO DE TIRAS BOV PEC AZUL FSW W": { codigo: "044424", categoria: "BOVINO", tags: ["BOVINO", "ASSADO DE TIRAS", "FSW", "AZUL", "WAGYU"], unidade: "KG" },

  // ══════════════════════════════════════════════════
  // BOVINO — CUPIM
  // ══════════════════════════════════════════════════
  "CUPIM BOV STEAK CDC": { codigo: "051123", categoria: "BOVINO", tags: ["BOVINO", "CUPIM", "CDC", "STEAK"], unidade: "KG" },
  "CUPIM BOV FDS CDC": { codigo: "000135", categoria: "BOVINO", tags: ["BOVINO", "CUPIM", "CDC", "FDS"], unidade: "KG" },
  "CUPIM BOV PEÇ CDC": { codigo: "050123", categoria: "BOVINO", tags: ["BOVINO", "CUPIM", "CDC", "PECA"], unidade: "KG" },
  "CUPIM BOV PEC FSW": { codigo: "053013", categoria: "BOVINO", tags: ["BOVINO", "CUPIM", "FSW"], unidade: "KG" },
  "CROQUETE DE CUPIM CDC": { codigo: "024084", categoria: "BOVINO", tags: ["BOVINO", "CUPIM", "TORRESMO", "CDC", "CROQUETE", "PETISCO"], unidade: "KG" },

  // ══════════════════════════════════════════════════
  // BOVINO — COSTELA
  // ══════════════════════════════════════════════════
  "COSTELA BOV FDS CDC": { codigo: "000133", categoria: "BOVINO", tags: ["BOVINO", "COSTELA", "CDC", "FDS"], unidade: "KG" },
  "COSTELA MINI-JANELA JANELINHA BOV CDC": { codigo: "025016", categoria: "BOVINO", tags: ["BOVINO", "COSTELA", "CDC", "JANELINHA", "MINI JANELA"], unidade: "KG" },
  "COSTELA FOUR RIBS BOV LA MAJESTAD": { codigo: "082325", categoria: "BOVINO", tags: ["BOVINO", "COSTELA", "LA MAJESTAD", "FOUR RIBS", "PREMIUM"], unidade: "KG" },
  "COSTELA BOV DE TIRA AZUL FSW": { codigo: "044477", categoria: "BOVINO", tags: ["BOVINO", "COSTELA", "FSW", "TIRA", "AZUL"], unidade: "KG" },
  "COSTELA ROJAO BOV CDC": { codigo: "025027", categoria: "BOVINO", tags: ["BOVINO", "COSTELA", "CDC", "ROJAO"], unidade: "KG" },
  "COSTELA DO TRASEIRO BOV JANELÃO ESTRELA": { codigo: "004127", categoria: "BOVINO", tags: ["BOVINO", "COSTELA", "OUTRAS MARCAS", "ESTRELA", "JANELAO", "TRASEIRO"], unidade: "KG" },
  "COSTELA BOV JANELA PRECOCE COCAMAR": { codigo: "124165", categoria: "BOVINO", tags: ["BOVINO", "COSTELA", "OUTRAS MARCAS", "COCAMAR", "JANELA", "PRECOCE"], unidade: "KG" },
  "COSTELA ESPECIAL QUADRADA BOV PEÇ RESERVA FSW": { codigo: "044301", categoria: "BOVINO", tags: ["BOVINO", "COSTELA", "FSW", "ESPECIAL", "QUADRADA", "RESERVA"], unidade: "KG" },
  "COSTELA MINGA BOV CDC": { codigo: "025017", categoria: "BOVINO", tags: ["BOVINO", "COSTELA", "CDC", "MINGA"], unidade: "KG" },
  "COSTELA BOV CUBOS PARA PANELA": { codigo: "040522", categoria: "BOVINO", tags: ["BOVINO", "COSTELA", "CUBOS", "PANELA"], unidade: "KG" },
  "COSTELA BOV DESFIADA LD CDC": { codigo: "080950", categoria: "BOVINO", tags: ["BOVINO", "COSTELA", "LD", "CDC", "DESFIADA"], unidade: "KG" },
  "COSTELA JANELA BOV ASTRA GRILL": { codigo: "024230", categoria: "BOVINO", tags: ["BOVINO", "COSTELA", "OUTRAS MARCAS", "ASTRA GRILL", "JANELA", "ASTRA"], unidade: "KG" },

  // ══════════════════════════════════════════════════
  // BOVINO — ACÉM / CHUCK
  // ══════════════════════════════════════════════════
  "ACEM BOV STEAK (CHUCK EYE) LA MAJESTAD": { codigo: "088201", categoria: "BOVINO", tags: ["BOVINO", "ACEM", "LA MAJESTAD", "CHUCK EYE", "STEAK", "CHURRASCO"], unidade: "KG" },
  "ACEM BOV STEAK (CHUCK EYE) CODIGO SERIES": { codigo: "088202", categoria: "BOVINO", tags: ["BOVINO", "ACEM", "CODIGO SERIES", "CHUCK EYE", "STEAK"], unidade: "KG" },
  "ACEM BOV CHUCK PEÇ GUIDARA WAGYU": { codigo: "090348", categoria: "BOVINO", tags: ["BOVINO", "ACEM", "OUTRAS MARCAS", "GUIDARA", "WAGYU", "CHUCK", "PREMIUM"], unidade: "KG" },
  "ACEM BOV CUBOS CDC": { codigo: "080111", categoria: "BOVINO", tags: ["BOVINO", "ACEM", "CDC", "CUBOS"], unidade: "KG" },

  // ══════════════════════════════════════════════════
  // BOVINO — SHORT RIB & PRIME RIB
  // ══════════════════════════════════════════════════
  "SHORT RIB BOV CODIGO SERIES": { codigo: "089250", categoria: "BOVINO", tags: ["BOVINO", "SHORT RIB", "CODIGO SERIES", "CHURRASCO"], unidade: "KG" },
  "SHORT RIB BOV LA MAJESTAD": { codigo: "088250", categoria: "BOVINO", tags: ["BOVINO", "SHORT RIB", "LA MAJESTAD", "CHURRASCO"], unidade: "KG" },
  "SHORT RIB BOV WAGYU": { codigo: "017583", categoria: "BOVINO", tags: ["BOVINO", "SHORT RIB", "OUTRAS MARCAS", "WAGYU", "PREMIUM"], unidade: "KG" },
  "PRIME RIB BOV LA REINA": { codigo: "089123", categoria: "BOVINO", tags: ["BOVINO", "PRIME RIB", "LA REINA", "CHURRASCO", "PREMIUM"], unidade: "KG" },

  // ══════════════════════════════════════════════════
  // BOVINO — T-BONE / PORTERHOUSE
  // ══════════════════════════════════════════════════
  "T BONE PORTERHOUSE BOV PEC PRETA FSW": { codigo: "044218", categoria: "BOVINO", tags: ["BOVINO", "T BONE", "FSW", "PORTERHOUSE", "PRETA", "PREMIUM"], unidade: "KG" },
  "T-BONE BOV LA REINA": { codigo: "085208", categoria: "BOVINO", tags: ["BOVINO", "T BONE", "LA REINA", "CHURRASCO"], unidade: "KG" },
  "T-BONE BOV LA MAJESTAD": { codigo: "089126", categoria: "BOVINO", tags: ["BOVINO", "T BONE", "LA MAJESTAD", "CHURRASCO"], unidade: "KG" },
  "T-BONE BOV VACA VELHA": { codigo: "005276", categoria: "BOVINO", tags: ["BOVINO", "T BONE", "OUTRAS MARCAS", "VACA VELHA", "PREMIUM"], unidade: "KG" },

  // ══════════════════════════════════════════════════
  // BOVINO — RAQUETE / FLAT IRON / DENVER
  // ══════════════════════════════════════════════════
  "RAQUETE (FLAT IRON) BOV PEC AZUL FSW": { codigo: "044111", categoria: "BOVINO", tags: ["BOVINO", "FLAT IRON", "FSW", "RAQUETE", "AZUL"], unidade: "KG" },
  "RAQUETE (FLAT IRON) BOV PEC AZUL FSW W": { codigo: "044423", categoria: "BOVINO", tags: ["BOVINO", "FLAT IRON", "FSW", "RAQUETE", "AZUL"], unidade: "KG" },
  "FLAT IRON BOV LA MAJESTAD": { codigo: "081110", categoria: "BOVINO", tags: ["BOVINO", "FLAT IRON", "LA MAJESTAD", "RAQUETE", "CHURRASCO"], unidade: "KG" },
  "DENVER BOV STEAK AZUL FSW": { codigo: "044108", categoria: "BOVINO", tags: ["BOVINO", "DENVER", "FSW", "STEAK", "AZUL"], unidade: "KG" },
  "DENVER BOV STEAK LA MAJESTAD": { codigo: "073750", categoria: "BOVINO", tags: ["BOVINO", "DENVER", "LA MAJESTAD", "STEAK", "CHURRASCO"], unidade: "KG" },

  // ══════════════════════════════════════════════════
  // BOVINO — ENTRANHA
  // ══════════════════════════════════════════════════
  "ENTRANHA DO DIAFRAGMA BOV PEC ENTRANHA FSW": { codigo: "044034", categoria: "BOVINO", tags: ["BOVINO", "ENTRANHA", "FSW", "DIAFRAGMA", "CHURRASCO"], unidade: "KG" },
  "ENTRANHA BOV PEÇ RESERVA DO PRODUTOR PATAGONIA": { codigo: "011090", categoria: "BOVINO", tags: ["BOVINO", "ENTRANHA", "OUTRAS MARCAS", "RESERVA DO PRODUTOR", "PATAGONIA", "RESERVA", "PREMIUM", "IMPORTADO"], unidade: "KG" },

  // ══════════════════════════════════════════════════
  // BOVINO — PEITO / BRISKET
  // ══════════════════════════════════════════════════
  "PEITO BOV STEAK CDC": { codigo: "088350", categoria: "BOVINO", tags: ["BOVINO", "PEITO", "CDC", "BRISKET", "STEAK"], unidade: "KG" },
  "PEITO BOV PEC WAGYU CDC": { codigo: "016354", categoria: "BOVINO", tags: ["BOVINO", "PEITO", "OUTRAS MARCAS", "CDC", "WAGYU", "BRISKET", "PREMIUM"], unidade: "KG" },
  "PEITO BOV PEC PRETA FSW": { codigo: "044345", categoria: "BOVINO", tags: ["BOVINO", "PEITO", "FSW", "BRISKET", "PRETA"], unidade: "KG" },
  "PEITO (BRISKET STEAK) BOV WAGYU GUIDARA": { codigo: "090349", categoria: "BOVINO", tags: ["BOVINO", "PEITO", "OUTRAS MARCAS", "GUIDARA", "WAGYU", "BRISKET", "PREMIUM"], unidade: "KG" },
  "PEITO BOV STEAK WAGYU CDC": { codigo: "016355", categoria: "BOVINO", tags: ["BOVINO", "PEITO", "OUTRAS MARCAS", "CDC", "WAGYU", "BRISKET", "STEAK"], unidade: "KG" },
  "PEITO BOV PEC RESERVA CRIADOR AZUL FSW W": { codigo: "044417", categoria: "BOVINO", tags: ["BOVINO", "PEITO", "FSW", "BRISKET", "RESERVA CRIADOR"], unidade: "KG" },

  // ══════════════════════════════════════════════════
  // BOVINO — OUTROS CORTES
  // ══════════════════════════════════════════════════
  "COX MOLE BOV BIFES LD": { codigo: "080130", categoria: "BOVINO", tags: ["BOVINO", "OUTROS", "LD", "COXAO MOLE", "BIFES"], unidade: "KG" },
  "COX MOLE BOV CUBOS PANELA LD": { codigo: "080110", categoria: "BOVINO", tags: ["BOVINO", "OUTROS", "LD", "COXAO MOLE", "CUBOS", "PANELA"], unidade: "KG" },
  "BANANINHA BOV PRETA PEC FSW": { codigo: "044035", categoria: "BOVINO", tags: ["BOVINO", "OUTROS", "FSW", "BANANINHA", "PRETA"], unidade: "KG" },
  "BANANINHA CDC": { codigo: "025014", categoria: "BOVINO", tags: ["BOVINO", "OUTROS", "CDC", "BANANINHA"], unidade: "KG" },
  "OSSO BOV CANOA TUTANO FRACIONADO FSW": { codigo: "044499", categoria: "BOVINO", tags: ["BOVINO", "OUTROS", "FSW", "OSSO", "CANOA", "TUTANO"], unidade: "KG" },
  "OSSO BUCO BOV CDC": { codigo: "025012", categoria: "BOVINO", tags: ["BOVINO", "OUTROS", "CDC", "OSSO BUCO"], unidade: "KG" },
  "OSSO BUCO BOV FRAC EDICAO LIMITADA AZUL FSW": { codigo: "044419", categoria: "BOVINO", tags: ["BOVINO", "OUTROS", "FSW", "OSSO BUCO", "EDICAO LIMITADA"], unidade: "KG" },
  "OSSOBUCO BOV PEÇ ANGUS SERIES ESTRELA": { codigo: "065009", categoria: "BOVINO", tags: ["BOVINO", "OUTROS", "OUTRAS MARCAS", "ANGUS SERIES", "ESTRELA", "OSSO BUCO", "ANGUS", "PREMIUM"], unidade: "KG" },
  "RABO BOV PEDAÇOS CDC": { codigo: "070525", categoria: "BOVINO", tags: ["BOVINO", "OUTROS", "CDC", "RABO"], unidade: "KG" },
  "FIGADO BOV CDC": { codigo: "001151", categoria: "BOVINO", tags: ["BOVINO", "OUTROS", "CDC", "FIGADO"], unidade: "KG" },
  "GRANITO BOV CDC": { codigo: "088450", categoria: "BOVINO", tags: ["BOVINO", "OUTROS", "CDC", "GRANITO", "STEAK SUPREMO"], unidade: "KG" },
  "STEAK SUPREMO BOV LA MAJESTAD": { codigo: "080150", categoria: "BOVINO", tags: ["BOVINO", "OUTROS", "LA MAJESTAD", "STEAK SUPREMO", "PREMIUM"], unidade: "KG" },
  "STEAK DO VAZIO WAGYU": { codigo: "017629", categoria: "BOVINO", tags: ["BOVINO", "OUTROS", "OUTRAS MARCAS", "WAGYU", "STEAK", "VAZIO", "PREMIUM"], unidade: "KG" },
  "STEAK DO VAZIO TEMPERADO": { codigo: "095806", categoria: "BOVINO", tags: ["BOVINO", "OUTROS", "STEAK", "VAZIO", "TEMPERADO"], unidade: "KG" },
  "PRIME STEAK BOV PEC PRETA FSW": { codigo: "044056", categoria: "BOVINO", tags: ["BOVINO", "OUTROS", "FSW", "PRIME STEAK", "PRETA"], unidade: "KG" },
  "CAPA DE FILE BOV STEAK CDC": { codigo: "028123", categoria: "BOVINO", tags: ["BOVINO", "OUTROS", "CDC", "CAPA DE FILE", "STEAK"], unidade: "KG" },
  "CAPA DE FILE BOV PEÇ WAGYU SECRETO GUIDARA": { codigo: "023302", categoria: "BOVINO", tags: ["BOVINO", "OUTROS", "OUTRAS MARCAS", "GUIDARA", "WAGYU", "CAPA DE FILE", "SECRETO", "PREMIUM"], unidade: "KG" },
  "CAPA DE FILE BOV PEC PRETA FSW": { codigo: "044497", categoria: "BOVINO", tags: ["BOVINO", "OUTROS", "FSW", "CAPA DE FILE", "PRETA"], unidade: "KG" },
  "LAGARTO BOV CARPACCIO FSW 250G": { codigo: "044513", categoria: "BOVINO", tags: ["BOVINO", "OUTROS", "FSW", "LAGARTO", "CARPACCIO", "PORCIONADO"], unidade: "KG" },
  "BIFE A ROLE RECHEADO LD": { codigo: "080190", categoria: "BOVINO", tags: ["BOVINO", "OUTROS", "LD", "BIFE A ROLE", "RECHEADO"], unidade: "KG" },

  // ══════════════════════════════════════════════════
  // BOVINO — CARNE MOÍDA
  // ══════════════════════════════════════════════════
  "CARNE BOV MOIDA BLEND 150G": { codigo: "389008", categoria: "BOVINO", tags: ["BOVINO", "MOIDA", "CARNE MOIDA", "BLEND", "PORCIONADO", "HAMBURGUER"], unidade: "UN" },
  "CARNE BOV MOIDA BLEND 180G": { codigo: "389007", categoria: "BOVINO", tags: ["BOVINO", "MOIDA", "CARNE MOIDA", "BLEND", "PORCIONADO", "HAMBURGUER"], unidade: "UN" },
  "CARNE MOÍDA BOV RED LD": { codigo: "080750", categoria: "BOVINO", tags: ["BOVINO", "MOIDA", "LD", "CARNE MOIDA", "RED"], unidade: "KG" },
  "CARNE MOIDA BOV CDC": { codigo: "080650", categoria: "BOVINO", tags: ["BOVINO", "MOIDA", "CDC", "CARNE MOIDA"], unidade: "KG" },
  "CARNE BOV MOIDA WAGYU 200G": { codigo: "022074", categoria: "BOVINO", tags: ["BOVINO", "MOIDA", "OUTRAS MARCAS", "WAGYU", "CARNE MOIDA", "PORCIONADO", "PREMIUM"], unidade: "UN" },
  "CARNE BOV MOIDA BLEND 60G": { codigo: "210122", categoria: "BOVINO", tags: ["BOVINO", "MOIDA", "CARNE MOIDA", "BLEND", "PORCIONADO", "MINI"], unidade: "UN" },
  "CARNE BOV MOIDA BLEND COSTELA 340G FSW": { codigo: "044095", categoria: "BOVINO", tags: ["BOVINO", "MOIDA", "FSW", "CARNE MOIDA", "BLEND", "COSTELA"], unidade: "UN" },
  "CARNE BOV MOIDA BLEND 50G/7 FSW": { codigo: "044075", categoria: "BOVINO", tags: ["BOVINO", "MOIDA", "FSW", "CARNE MOIDA", "BLEND", "MINI"], unidade: "UN" },
  "CARNE MOIDA BOV RECHEADA CDC": { codigo: "024085", categoria: "BOVINO", tags: ["BOVINO", "MOIDA", "CDC", "CARNE MOIDA", "RECHEADA"], unidade: "KG" },
  "CARNE MOIDA RECHEADA DEFUMADA FDS": { codigo: "000153", categoria: "BOVINO", tags: ["BOVINO", "MOIDA", "CARNE MOIDA", "RECHEADA", "DEFUMADA"], unidade: "KG" },
  "ALMONDEGA BOV 50G CDC": { codigo: "060625", categoria: "BOVINO", tags: ["BOVINO", "MOIDA", "CDC", "ALMONDEGA", "PORCIONADO"], unidade: "UN" },

  // ══════════════════════════════════════════════════
  // BOVINO — ESPETO
  // ══════════════════════════════════════════════════
  "ESPETINHO BOVINO CDC": { codigo: "018092", categoria: "BOVINO", tags: ["BOVINO", "ESPETO", "CDC", "ESPETINHO"], unidade: "UN" },
  "ESPETO BOV COM BACON CDC": { codigo: "018095", categoria: "BOVINO", tags: ["BOVINO", "ESPETO", "CDC", "BACON"], unidade: "UN" },

  // ══════════════════════════════════════════════════
  // FRANGO
  // ══════════════════════════════════════════════════
  "FILE DE PEITO FRANGO LD": { codigo: "001738", categoria: "FRANGO", tags: ["FRANGO", "FILE", "LD", "PEITO"], unidade: "KG" },
  "FILE DE FRANGO PICADINHO LD": { codigo: "001739", categoria: "FRANGO", tags: ["FRANGO", "FILE", "LD", "PICADINHO"], unidade: "KG" },
  "FILE DE PEITO FRANGO CUBOS GREL 400G NAT": { codigo: "009215", categoria: "FRANGO", tags: ["FRANGO", "FILE", "NAT", "PEITO", "CUBOS", "GRELHADO", "PORCIONADO"], unidade: "UN" },
  "FILE DE PEITO FRANGO TIRAS GREL 400G NAT": { codigo: "009216", categoria: "FRANGO", tags: ["FRANGO", "FILE", "NAT", "PEITO", "TIRAS", "GRELHADO", "PORCIONADO"], unidade: "UN" },
  "PEITO DE FRANGO DESFIADO 400G NAT": { codigo: "009213", categoria: "FRANGO", tags: ["FRANGO", "FILE", "NAT", "PEITO", "DESFIADO", "PORCIONADO"], unidade: "UN" },
  "FRANGO DESFIADO TEMPERADO E COZIDO 400G": { codigo: "001736", categoria: "FRANGO", tags: ["FRANGO", "FILE", "DESFIADO", "TEMPERADO", "COZIDO", "PORCIONADO"], unidade: "UN" },
  "FILE DE FRANGO EMPANADO LD": { codigo: "024076", categoria: "FRANGO", tags: ["FRANGO", "FILE", "LD", "EMPANADO"], unidade: "KG" },
  "FILE DE COXA SB FRANGO 500G NAT": { codigo: "009218", categoria: "FRANGO", tags: ["FRANGO", "COXA", "NAT", "FILE", "SOBRECOXA", "PORCIONADO"], unidade: "UN" },
  "COXA E SB COXA DESOSSADA TEMPERADA": { codigo: "015620", categoria: "FRANGO", tags: ["FRANGO", "COXA", "SOBRECOXA", "DESOSSADA", "TEMPERADA"], unidade: "KG" },
  "SOBRECOXA RECHEADA FDS CDC": { codigo: "000132", categoria: "FRANGO", tags: ["FRANGO", "COXA", "CDC", "SOBRECOXA", "RECHEADA", "FDS"], unidade: "UN" },
  "SOBRECOXA FRANGO RECHEADA CDC": { codigo: "015640", categoria: "FRANGO", tags: ["FRANGO", "COXA", "CDC", "SOBRECOXA", "RECHEADA"], unidade: "UN" },
  "COXA E MEIO ASA FRANGO GREL 400G NAT": { codigo: "009219", categoria: "FRANGO", tags: ["FRANGO", "COXA", "NAT", "ASA", "GRELHADO", "PORCIONADO"], unidade: "UN" },
  "COXA E SBCX DESOSSADA SEM PELE TEMPERADA": { codigo: "015889", categoria: "FRANGO", tags: ["FRANGO", "COXA", "SOBRECOXA", "DESOSSADA", "SEM PELE", "TEMPERADA"], unidade: "KG" },
  "ISCA COXA DE FRANGO TEMPERADA CDC": { codigo: "015625", categoria: "FRANGO", tags: ["FRANGO", "COXA", "CDC", "ISCA", "TEMPERADA"], unidade: "KG" },
  "COXA PIRULITO TEMPERADA EMPANADO": { codigo: "015660", categoria: "FRANGO", tags: ["FRANGO", "COXA", "PIRULITO", "TEMPERADA", "EMPANADO"], unidade: "KG" },
  "MEIO DA ASA (TULIPA) TEMPERADA": { codigo: "015770", categoria: "FRANGO", tags: ["FRANGO", "ASA", "TULIPA", "TEMPERADA"], unidade: "KG" },
  "COXINHA DA ASA TEMPERADA CDC": { codigo: "015723", categoria: "FRANGO", tags: ["FRANGO", "ASA", "CDC", "COXINHA DA ASA", "TEMPERADA"], unidade: "KG" },
  "TULIPA DE FRANGO DEFUMADA FDS CDC": { codigo: "000141", categoria: "FRANGO", tags: ["FRANGO", "ASA", "CDC", "TULIPA", "DEFUMADA", "FDS"], unidade: "KG" },
  "FRANGO INTEIRO FDS CDC": { codigo: "000130", categoria: "FRANGO", tags: ["FRANGO", "FRANGO INTEIRO", "CDC", "INTEIRO", "FDS"], unidade: "KG" },
  "FRANGO INTEIRO TEMPERADO CDC": { codigo: "015623", categoria: "FRANGO", tags: ["FRANGO", "FRANGO INTEIRO", "CDC", "INTEIRO", "TEMPERADO"], unidade: "KG" },
  "GALETO INTEIRO TEMPERADO CDC": { codigo: "012112", categoria: "FRANGO", tags: ["FRANGO", "FRANGO INTEIRO", "CDC", "GALETO", "INTEIRO", "TEMPERADO"], unidade: "KG" },
  "ESPETINHO DE FRANGO C/ BACON CDC": { codigo: "025092", categoria: "FRANGO", tags: ["FRANGO", "ESPETO", "CDC", "ESPETINHO", "BACON"], unidade: "UN" },
  "ESPETINHO CORAÇÃO DE FRANGO CDC": { codigo: "010102", categoria: "FRANGO", tags: ["FRANGO", "ESPETO", "CDC", "ESPETINHO", "CORACAO"], unidade: "UN" },
  "MINI COXINHA DE FRANGO 260G": { codigo: "202008", categoria: "FRANGO", tags: ["FRANGO", "OUTROS", "TORRESMO", "MINI COXINHA", "SALGADO", "PETISCO"], unidade: "UN" },

  // ══════════════════════════════════════════════════
  // SUÍNO
  // ══════════════════════════════════════════════════
  "MATAMBRITO SUINO PEÇ TEMPERADO": { codigo: "090822", categoria: "SUINO", tags: ["SUINO", "MATAMBRITO", "TEMPERADO"], unidade: "KG" },
  "MATAMBRITO SUINO PEÇ GRELHADO FDS": { codigo: "000143", categoria: "SUINO", tags: ["SUINO", "MATAMBRITO", "GRELHADO", "FDS"], unidade: "KG" },
  "PANCETA SUINA TEMPERADA CDC": { codigo: "024063", categoria: "SUINO", tags: ["SUINO", "MATAMBRITO", "CDC", "PANCETA", "TEMPERADA"], unidade: "KG" },
  "PANCETA SUINA RECHEADA RICO": { codigo: "012022", categoria: "SUINO", tags: ["SUINO", "MATAMBRITO", "OUTRAS MARCAS", "RICO", "PANCETA", "RECHEADA"], unidade: "KG" },
  "GUANCIALE SUÍNO RICO": { codigo: "013122", categoria: "SUINO", tags: ["SUINO", "MATAMBRITO", "OUTRAS MARCAS", "RICO", "GUANCIALE"], unidade: "KG" },
  "COSTELA SUINA DESOSSADA CDC": { codigo: "058025", categoria: "SUINO", tags: ["SUINO", "COSTELA", "CDC", "DESOSSADA"], unidade: "KG" },
  "COSTELA SUÍNA FDS CDC": { codigo: "000136", categoria: "SUINO", tags: ["SUINO", "COSTELA", "CDC", "FDS"], unidade: "KG" },
  "COSTELA SUINA TEMPERADA CDC": { codigo: "058026", categoria: "SUINO", tags: ["SUINO", "COSTELA", "CDC", "TEMPERADA"], unidade: "KG" },
  "COSTELA SUINA PEÇ CDC": { codigo: "010800", categoria: "SUINO", tags: ["SUINO", "COSTELA", "CDC", "PECA"], unidade: "KG" },
  "COSTELA SUINA EM CUBOS": { codigo: "010922", categoria: "SUINO", tags: ["SUINO", "COSTELA", "CUBOS"], unidade: "KG" },
  "FILE MIGNON SUINO MEDALHAO COM BACON LD": { codigo: "078300", categoria: "SUINO", tags: ["SUINO", "FILE MIGNON", "LD", "MEDALHAO", "BACON"], unidade: "KG" },
  "FILE MIGNON SUINO MEDALHAO LD": { codigo: "078400", categoria: "SUINO", tags: ["SUINO", "FILE MIGNON", "LD", "MEDALHAO"], unidade: "KG" },
  "FILE MIGNON SUINO PEÇ ENROLADO COM BACON": { codigo: "002546", categoria: "SUINO", tags: ["SUINO", "FILE MIGNON", "ENROLADO", "BACON"], unidade: "KG" },
  "PRIME RIB SUINO TEMPERADO CDC": { codigo: "058002", categoria: "SUINO", tags: ["SUINO", "PRIME RIB", "CDC", "TEMPERADO"], unidade: "KG" },
  "PRIME RIB SUINO CDC": { codigo: "058001", categoria: "SUINO", tags: ["SUINO", "PRIME RIB", "CDC"], unidade: "KG" },
  "BISTEQUINHA SUINA LD": { codigo: "000118", categoria: "SUINO", tags: ["SUINO", "OUTROS", "LD", "BISTEQUINHA"], unidade: "KG" },
  "PORK STEAK LD LR (COPA LOMBO)": { codigo: "000047", categoria: "SUINO", tags: ["SUINO", "LOMBO", "LD", "PORK STEAK", "COPA LOMBO"], unidade: "KG" },
  "LOMBO SUINO EMPANADO LD": { codigo: "024080", categoria: "SUINO", tags: ["SUINO", "LOMBO", "LD", "EMPANADO"], unidade: "KG" },
  "PORCHETTA SUINA CDC": { codigo: "010888", categoria: "SUINO", tags: ["SUINO", "OUTROS", "CDC", "PORCHETTA", "RECHEADA"], unidade: "KG" },
  "PORCHETTA SUÍNA FDS CDC": { codigo: "000134", categoria: "SUINO", tags: ["SUINO", "OUTROS", "CDC", "PORCHETTA", "FDS"], unidade: "KG" },
  "CARNE SUINA MOIDA 150G": { codigo: "389021", categoria: "SUINO", tags: ["SUINO", "OUTROS", "CARNE MOIDA", "PORCIONADO", "HAMBURGUER"], unidade: "UN" },
  "CARNE SUINA MOIDA 180G": { codigo: "389020", categoria: "SUINO", tags: ["SUINO", "OUTROS", "CARNE MOIDA", "PORCIONADO", "HAMBURGUER"], unidade: "UN" },
  "BACON FATIADO BURG CDC 12 FATIAS (COMBO)": { codigo: "003010", categoria: "SUINO", tags: ["SUINO", "OUTROS", "KIT BURGUER", "CDC", "BACON", "FATIADO", "BURGUER", "COMBO"], unidade: "UN" },

  // ══════════════════════════════════════════════════
  // LINGUIÇA
  // ══════════════════════════════════════════════════
  "LINGUIÇA DE PARRILHA FSW": { codigo: "044505", categoria: "LINGUICA", tags: ["LINGUICA", "BOVINA", "FSW", "PARRILHA"], unidade: "KG" },
  "LINGUIÇA DE COSTELA 500G FSW": { codigo: "044468", categoria: "LINGUICA", tags: ["LINGUICA", "BOVINA", "FSW", "COSTELA", "PORCIONADO"], unidade: "UN" },
  "LINGUIÇA CUIABANA BOVINA SPECIALLI 400G": { codigo: "030820", categoria: "LINGUICA", tags: ["LINGUICA", "BOVINA", "OUTRAS MARCAS", "SPECIALLI", "CUIABANA", "PORCIONADO"], unidade: "UN" },
  "LING CHOURIÇO SAO MARTINHO": { codigo: "000243", categoria: "LINGUICA", tags: ["LINGUICA", "BOVINA", "OUTRAS MARCAS", "SÃO MARTINHO", "CHOURIÇO", "SAO MARTINHO"], unidade: "KG" },
  "LING TOSCANA PRÉ COZIDA RICO": { codigo: "011029", categoria: "LINGUICA", tags: ["LINGUICA", "SUINA", "OUTRAS MARCAS", "RICO", "TOSCANA", "PRE COZIDA"], unidade: "KG" },
  "LING TOSCANA RUCULA E TOMATE RICO 500G": { codigo: "011137", categoria: "LINGUICA", tags: ["LINGUICA", "SUINA", "OUTRAS MARCAS", "RICO", "TOSCANA", "RUCULA", "TOMATE"], unidade: "UN" },
  "LING TOSCANA COM QUEIJO RICO 500G": { codigo: "011136", categoria: "LINGUICA", tags: ["LINGUICA", "SUINA", "OUTRAS MARCAS", "RICO", "TOSCANA", "QUEIJO"], unidade: "UN" },
  "LING SUÍNA RICO CASEIRA": { codigo: "011022", categoria: "LINGUICA", tags: ["LINGUICA", "SUINA", "OUTRAS MARCAS", "RICO", "CASEIRA"], unidade: "KG" },
  "LING RICO HUNGARA": { codigo: "011031", categoria: "LINGUICA", tags: ["LINGUICA", "SUINA", "OUTRAS MARCAS", "RICO", "HUNGARA"], unidade: "KG" },
  "LING SUINA TOSCANA CDC": { codigo: "096139", categoria: "LINGUICA", tags: ["LINGUICA", "SUINA", "CDC", "TOSCANA"], unidade: "KG" },
  "LINGUIÇA TOSCANA FDS CDC": { codigo: "000139", categoria: "LINGUICA", tags: ["LINGUICA", "SUINA", "CDC", "TOSCANA", "FDS"], unidade: "KG" },
  "LINGUIÇA SUINA TOSCANA SPECIALLI 400G": { codigo: "1579", categoria: "LINGUICA", tags: ["LINGUICA", "SUINA", "OUTRAS MARCAS", "SPECIALLI", "TOSCANA"], unidade: "UN" },
  "LINGUIÇA DE REQUEIJÃO COM CERVEJA E BACON 400G SPECIALLI": { codigo: "030823", categoria: "LINGUICA", tags: ["LINGUICA", "SUINA", "OUTRAS MARCAS", "SPECIALLI", "REQUEIJAO", "CERVEJA", "BACON"], unidade: "UN" },
  "LINGUIÇA PERNIL SUINO TEX MEX SPECIALLI 400G": { codigo: "090825", categoria: "LINGUICA", tags: ["LINGUICA", "SUINA", "OUTRAS MARCAS", "SPECIALLI", "PERNIL", "TEX MEX"], unidade: "UN" },
  "LINGUIÇA DE PERNIL SUINO COM GORGONZOLA SPECIALLI 400G": { codigo: "030832", categoria: "LINGUICA", tags: ["LINGUICA", "SUINA", "OUTRAS MARCAS", "SPECIALLI", "PERNIL", "GORGONZOLA"], unidade: "UN" },
  "MASSA DE LINGUIÇA CHEIRO VERDE RICO": { codigo: "010112", categoria: "LINGUICA", tags: ["LINGUICA", "SUINA", "OUTRAS MARCAS", "RICO", "MASSA DE LINGUICA", "CHEIRO VERDE"], unidade: "KG" },
  "LINGUIÇA CHEIRO VERDE RICO 500G": { codigo: "011025", categoria: "LINGUICA", tags: ["LINGUICA", "FRANGO", "OUTRAS MARCAS", "RICO", "CHEIRO VERDE"], unidade: "UN" },
  "LINGUIÇA DE FRANGO MINEIRA SPECIALLI 300G": { codigo: "789896", categoria: "LINGUICA", tags: ["LINGUICA", "FRANGO", "OUTRAS MARCAS", "SPECIALLI", "MINEIRA"], unidade: "UN" },
  "LINGUIÇA FRESCAL CUIABANA DE FRANGO 600G ESTRELA": { codigo: "012091", categoria: "LINGUICA", tags: ["LINGUICA", "FRANGO", "OUTRAS MARCAS", "ESTRELA", "FRESCAL", "CUIABANA"], unidade: "UN" },

  // ══════════════════════════════════════════════════
  // CORDEIRO
  // ══════════════════════════════════════════════════
  "FRENCH RACK DE CORDEIRO FATIADO TEMPERADO CDC": { codigo: "022104", categoria: "CORDEIRO", tags: ["CORDEIRO", "FRENCH RACK", "CDC", "TEMPERADO", "FATIADO"], unidade: "KG" },
  "FRENCH RACK DE CORDEIRO FATIADO": { codigo: "022100", categoria: "CORDEIRO", tags: ["CORDEIRO", "FRENCH RACK", "FATIADO"], unidade: "KG" },
  "FRENCH RACK CORDEIRO CANEIROSUL": { codigo: "000421", categoria: "CORDEIRO", tags: ["CORDEIRO", "FRENCH RACK", "OUTRAS MARCAS", "CANEIROSUL"], unidade: "KG" },
  "FRENCH RACK CORDEIRO 20UP FRICASA": { codigo: "066227", categoria: "CORDEIRO", tags: ["CORDEIRO", "FRENCH RACK", "OUTRAS MARCAS", "FRICASA"], unidade: "KG" },
  "PALETA CORDEIRO CONG CAMPOS DEL PLATA LAS PIEDRAS IMP": { codigo: "000873", categoria: "CORDEIRO", tags: ["CORDEIRO", "PALETA", "OUTRAS MARCAS", "CAMPOS DEL PLATA", "LAS PIEDRAS", "IMPORTADO"], unidade: "KG" },
  "PALETA CORDEIRO CANEIROSUL": { codigo: "000464", categoria: "CORDEIRO", tags: ["CORDEIRO", "PALETA", "OUTRAS MARCAS", "CANEIROSUL"], unidade: "KG" },
  "PERNIL CORDEIRO FATIADO TEMPERADO CDC": { codigo: "021198", categoria: "CORDEIRO", tags: ["CORDEIRO", "PERNIL", "CDC", "FATIADO", "TEMPERADO"], unidade: "KG" },
  "PERNIL CORDEIRO PEC CAMPOS DEL PLATA": { codigo: "058234", categoria: "CORDEIRO", tags: ["CORDEIRO", "PERNIL", "OUTRAS MARCAS", "CAMPOS DEL PLATA", "IMPORTADO"], unidade: "KG" },
  "PERNIL CORDEIRO TEMPERADO CDC": { codigo: "019032", categoria: "CORDEIRO", tags: ["CORDEIRO", "PERNIL", "CDC", "TEMPERADO"], unidade: "KG" },
  "COSTELA CORDEIRO TEMPERADA CDC": { codigo: "035330", categoria: "CORDEIRO", tags: ["CORDEIRO", "COSTELA", "CDC", "TEMPERADA"], unidade: "KG" },
  "COSTELA CORDEIRO SERRADA FLAVOR": { codigo: "040433", categoria: "CORDEIRO", tags: ["CORDEIRO", "COSTELA", "OUTRAS MARCAS", "FLAVOR", "SERRADA"], unidade: "KG" },
  "SHORT RACK CORDEIRO TEMPERADO CDC": { codigo: "022111", categoria: "CORDEIRO", tags: ["CORDEIRO", "COSTELA", "CDC", "SHORT RACK", "TEMPERADO"], unidade: "KG" },
  "T-BONE CORDEIRO FATIADO TEMPERADO": { codigo: "013112", categoria: "CORDEIRO", tags: ["CORDEIRO", "T BONE", "FATIADO", "TEMPERADO"], unidade: "KG" },
  "T-BONE CORDEIRO FATIADO": { codigo: "029062", categoria: "CORDEIRO", tags: ["CORDEIRO", "T BONE", "FATIADO"], unidade: "KG" },
  "PICANHA CORDEIRO CDC": { codigo: "010007", categoria: "CORDEIRO", tags: ["CORDEIRO", "OUTROS", "CDC", "PICANHA"], unidade: "KG" },

  // ══════════════════════════════════════════════════
  // PESCADOS
  // ══════════════════════════════════════════════════
  "LOMBO BACALHAU MORHUA": { codigo: "000993", categoria: "PESCADOS", tags: ["PESCADOS", "BACALHAU", "MORHUA", "PEIXE", "PESCADO"], unidade: "KG" },
  "FILE DE TILAPIA CONGELADA 800G CANÇÃO ALIMENTOS": { codigo: "161601", categoria: "PESCADOS", tags: ["PESCADOS", "CANÇÃO ALIMENTOS", "TILAPIA", "FILE", "PEIXE", "PESCADO", "CANCAO"], unidade: "UN" },
  "FILE DE TILAPIA SEM PELE LEVO 600G": { codigo: "1075001", categoria: "PESCADOS", tags: ["PESCADOS", "LEVO", "TILAPIA", "FILE", "SEM PELE", "PEIXE", "PESCADO"], unidade: "UN" },
  "FILE DE TILAPIA 500G AGB": { codigo: "022301", categoria: "PESCADOS", tags: ["PESCADOS", "AGB", "TILAPIA", "FILE", "PEIXE", "PESCADO"], unidade: "UN" },

  // ══════════════════════════════════════════════════
  // QUEIJO
  // ══════════════════════════════════════════════════
  "QUEIJO DE COALHO ESPETO LACTOLAR": { codigo: "030089", categoria: "QUEIJO", tags: ["QUEIJO", "ESPETO", "LACTOLAR", "QUEIJO COALHO", "CHURRASCO"], unidade: "KG" },
  "ESPETO QUEIJO COALHO C GOIABADA E BACON": { codigo: "000875", categoria: "QUEIJO", tags: ["QUEIJO", "ESPETO", "CDC", "QUEIJO COALHO", "GOIABADA", "BACON"], unidade: "UN" },
  "ESPETO QUEIJO COALHO COM BACON": { codigo: "000877", categoria: "QUEIJO", tags: ["QUEIJO", "ESPETO", "CDC", "QUEIJO COALHO", "BACON"], unidade: "UN" },
  "QUEIJO CHEDDAR BURG 8 FATIAS (COMBO)": { codigo: "3009", categoria: "QUEIJO", tags: ["QUEIJO", "KIT BURGUER", "CDC", "CHEDDAR", "BURGUER", "COMBO", "FATIADO"], unidade: "UN" },
  "PROVOLONERA PROVOLERA COLMEIA URUGUAIA EL PASO": { codigo: "030073", categoria: "QUEIJO", tags: ["QUEIJO", "EL PASO", "PROVOLONE", "PROVOLERA", "COLMEIA", "URUGUAIA"], unidade: "KG" },
  "MINI BOLINHO DE QUEIJO COM PIMENTA 260G CECIQUE": { codigo: "202007", categoria: "QUEIJO", tags: ["QUEIJO", "TORRESMO", "CECIQUE", "BOLINHO", "PIMENTA", "PETISCO"], unidade: "UN" },
  "VULCAO RECHEADO CREAM CHEESE CDC": { codigo: "027105", categoria: "QUEIJO", tags: ["QUEIJO", "ACOMPANHAMENTO", "CDC", "VULCAO", "CREAM CHEESE", "RECHEADO"], unidade: "UN" },
  "VULCAO RECHEADO CHEEDAR CDC": { codigo: "027104", categoria: "QUEIJO", tags: ["QUEIJO", "ACOMPANHAMENTO", "CDC", "VULCAO", "CHEDDAR", "RECHEADO"], unidade: "UN" },

  // ══════════════════════════════════════════════════
  // CERVEJA
  // ══════════════════════════════════════════════════
  "CERVEJA HEINEKEN LONG NECK 330ML": { codigo: "139410", categoria: "CERVEJA", tags: ["CERVEJA", "HEINEKEN", "LONG NECK", "LAGER"], unidade: "UN" },
  "CERVEJA HEINEKEN LONG NECK 330ML 0,0%": { codigo: "903996", categoria: "CERVEJA", tags: ["CERVEJA", "HEINEKEN", "ZERO ALCOOL", "LONG NECK"], unidade: "UN" },
  "CERV AMSTEL ULTRA 275ML": { codigo: "904631", categoria: "CERVEJA", tags: ["CERVEJA", "OUTRAS MARCAS", "AMSTEL", "ULTRA"], unidade: "UN" },
  "CERVEJA CORONA 330ML": { codigo: "24331", categoria: "CERVEJA", tags: ["CERVEJA", "OUTRAS MARCAS", "CORONA", "LAGER", "IMPORTADA"], unidade: "UN" },
  "CERVEJA IPA CDC": { codigo: "201124", categoria: "CERVEJA", tags: ["CERVEJA", "OUTRAS MARCAS", "CDC", "IPA", "ARTESANAL"], unidade: "UN" },
  "CERVEJA FROGS 63 EXPORT 473ML": { codigo: "CER158", categoria: "CERVEJA", tags: ["CERVEJA", "FROGS", "EXPORT", "ARTESANAL"], unidade: "UN" },
  "CERVEJA FROGS HAZE POP LAGER 473ML": { codigo: "CER156", categoria: "CERVEJA", tags: ["CERVEJA", "FROGS", "HAZE POP", "LAGER", "ARTESANAL"], unidade: "UN" },
  "CERVEJA FROGS INDIA PALE ALE 473ML": { codigo: "CER155", categoria: "CERVEJA", tags: ["CERVEJA", "FROGS", "IPA", "INDIA PALE ALE", "ARTESANAL"], unidade: "UN" },
  "CERVEJA FROGS AMERICAN PELE ALE 473ML": { codigo: "CER153", categoria: "CERVEJA", tags: ["CERVEJA", "FROGS", "AMERICAN ALE", "ARTESANAL"], unidade: "UN" },
  "CERVEJA FROGS WEISS 473ML": { codigo: "CER150", categoria: "CERVEJA", tags: ["CERVEJA", "FROGS", "WEISS", "TRIGO", "ARTESANAL"], unidade: "UN" },
  "CERVEJA FROGS ENGLISH PELE ALE 473ML": { codigo: "CER151", categoria: "CERVEJA", tags: ["CERVEJA", "FROGS", "ENGLISH ALE", "ARTESANAL"], unidade: "UN" },
  "SCHORNSTEIN IPA 355ML": { codigo: "SCHLON001", categoria: "CERVEJA", tags: ["CERVEJA", "SCHORNSTEIN", "IPA", "ARTESANAL"], unidade: "UN" },
  "SCHORNSTEIN STOUT": { codigo: "STOUT", categoria: "CERVEJA", tags: ["CERVEJA", "SCHORNSTEIN", "STOUT", "ARTESANAL"], unidade: "UN" },
  "SCHORNSTEIN APA 500ML": { codigo: "SCHGARN001", categoria: "CERVEJA", tags: ["CERVEJA", "SCHORNSTEIN", "APA", "ARTESANAL"], unidade: "UN" },
  "SCHORNSTEIN LAGER 355ML": { codigo: "SCHLON004", categoria: "CERVEJA", tags: ["CERVEJA", "SCHORNSTEIN", "LAGER", "ARTESANAL"], unidade: "UN" },

  // ══════════════════════════════════════════════════
  // BEBIDAS
  // ══════════════════════════════════════════════════
  "COCA COLA ORIGINAL 2 LITROS": { codigo: "1208", categoria: "BEBIDAS", tags: ["BEBIDAS", "REFRIGERANTE", "COCA-COLA", "COCA COLA", "2 LITROS"], unidade: "UN" },
  "COCA COLA SEM AÇUCAR 2 LITROS": { codigo: "1215", categoria: "BEBIDAS", tags: ["BEBIDAS", "REFRIGERANTE", "COCA-COLA", "COCA COLA", "ZERO", "SEM AÇUCAR", "2 LITROS"], unidade: "UN" },
  "COCA COLA ORIGINAL LATA 350 ML": { codigo: "1213", categoria: "BEBIDAS", tags: ["BEBIDAS", "REFRIGERANTE", "COCA-COLA", "COCA COLA", "LATA"], unidade: "UN" },
  "COCA COLA SEM AÇUCAR LATA 350 ML": { codigo: "1217", categoria: "BEBIDAS", tags: ["BEBIDAS", "REFRIGERANTE", "COCA-COLA", "COCA COLA", "ZERO", "LATA"], unidade: "UN" },
  "COCA COLA PALITO SEM AÇUCAR LATA 310ML": { codigo: "7894900701159", categoria: "BEBIDAS", tags: ["BEBIDAS", "REFRIGERANTE", "COCA-COLA", "COCA COLA", "ZERO", "PALITO", "LATA"], unidade: "UN" },
  "SUCO DE LARANJA 900ML IDEAL SUCOS": { codigo: "SUCO900ML", categoria: "BEBIDAS", tags: ["BEBIDAS", "SUCO", "IDEAL SUCOS", "LARANJA"], unidade: "UN" },
  "SUCO DE LARANJA 300ML IDEAL SUCOS": { codigo: "SUCO300ML", categoria: "BEBIDAS", tags: ["BEBIDAS", "SUCO", "IDEAL SUCOS", "LARANJA"], unidade: "UN" },
  "AGUA MINERAL CANCAO NOVA 510ML": { codigo: "000222", categoria: "BEBIDAS", tags: ["BEBIDAS", "AGUA", "CANÇÃO NOVA", "MINERAL", "SEM GAS", "CANCAO NOVA"], unidade: "UN" },
  "AGUA MINERAL CANCAO NOVA 510ML C/GAS": { codigo: "000333", categoria: "BEBIDAS", tags: ["BEBIDAS", "AGUA", "CANÇÃO NOVA", "MINERAL", "COM GAS", "CANCAO NOVA"], unidade: "UN" },
  "AGUA BONAFONT C/ GÁS 500ML": { codigo: "N/A", categoria: "BEBIDAS", tags: ["BEBIDAS", "AGUA", "BONAFONT", "COM GAS"], unidade: "UN" },
  "AGUA BONAFONT MINERAL S/ GÁS 500ML": { codigo: "N/A", categoria: "BEBIDAS", tags: ["BEBIDAS", "AGUA", "BONAFONT", "MINERAL", "SEM GAS"], unidade: "UN" },
  "LICOR BARDERA DE DOCE DE LEITE 500ML": { codigo: "206956431381", categoria: "BEBIDAS", tags: ["BEBIDAS", "OUTRAS", "BARDERA", "LICOR", "DOCE DE LEITE", "BEBIDA"], unidade: "UN" },
  "AÇAÍ COM GUARANÁ 1,5 L SAVIO": { codigo: "10935", categoria: "BEBIDAS", tags: ["BEBIDAS", "OUTRAS", "SAVIO", "ACAI", "GUARANA", "SUCO"], unidade: "UN" },

  // ══════════════════════════════════════════════════
  // ACOMPANHAMENTO — PÃO
  // ══════════════════════════════════════════════════
  "PAO STA MASSA DE ALHO TRADICIONAL": { codigo: "789806", categoria: "ACOMPANHAMENTO", tags: ["ACOMPANHAMENTO", "PAO", "SANTA MASSA", "ALHO", "TRADICIONAL"], unidade: "UN" },
  "PAO STA MASSA DE ALHO BOLINHA TRADICIONAL 300G": { codigo: "84", categoria: "ACOMPANHAMENTO", tags: ["ACOMPANHAMENTO", "PAO", "SANTA MASSA", "ALHO", "BOLINHA"], unidade: "UN" },
  "PAO DE HAMBURGUER (COMBO)": { codigo: "20920", categoria: "ACOMPANHAMENTO", tags: ["ACOMPANHAMENTO", "PAO", "KIT BURGUER", "HAMBURGUER", "COMBO"], unidade: "UN" },
  "MINI PÃO DE HAMBURGUER (COMBO)": { codigo: "210120", categoria: "ACOMPANHAMENTO", tags: ["ACOMPANHAMENTO", "PAO", "KIT BURGUER", "MINI", "HAMBURGUER", "COMBO"], unidade: "UN" },
  "PAO CURITIBANO": { codigo: "20930", categoria: "ACOMPANHAMENTO", tags: ["ACOMPANHAMENTO", "PAO", "CURITIBANO"], unidade: "UN" },
  "PAO DE PEPPERONI COM REQUEIJÃO SANTA MASSA 240 G": { codigo: "789176", categoria: "ACOMPANHAMENTO", tags: ["ACOMPANHAMENTO", "PAO", "SANTA MASSA", "PEPPERONI", "REQUEIJAO"], unidade: "UN" },

  // ══════════════════════════════════════════════════
  // ACOMPANHAMENTO — MOLHO
  // ══════════════════════════════════════════════════
  "MOLHO AMERICAN BURGUER ROMS SAUCE": { codigo: "210092", categoria: "ACOMPANHAMENTO", tags: ["ACOMPANHAMENTO", "MOLHO", "ROMS SAUCE", "AMERICAN BURGUER"], unidade: "UN" },
  "MOLHO WHITE BEERBQ ROMS SAUCE 200ML": { codigo: "040026", categoria: "ACOMPANHAMENTO", tags: ["ACOMPANHAMENTO", "MOLHO", "ROMS SAUCE", "WHITE", "BBQ", "CERVEJA"], unidade: "UN" },
  "MOLHO DE PEPINO AGRIDOCE CAT A PICKLES ROMS SAUCE 200G": { codigo: "4000", categoria: "ACOMPANHAMENTO", tags: ["ACOMPANHAMENTO", "MOLHO", "ROMS SAUCE", "PEPINO", "AGRIDOCE", "PICKLES"], unidade: "UN" },
  "MOLHO MOSTARDA JIMMY HERMANO ROMS SAUCE 200G": { codigo: "210127", categoria: "ACOMPANHAMENTO", tags: ["ACOMPANHAMENTO", "MOLHO", "ROMS SAUCE", "MOSTARDA", "JIMMY HERMANO"], unidade: "UN" },
  "MOLHO DRAGONS BITE ROMS SAUCE 200G": { codigo: "210128", categoria: "ACOMPANHAMENTO", tags: ["ACOMPANHAMENTO", "MOLHO", "ROMS SAUCE", "PIMENTA", "DRAGONS BITE"], unidade: "UN" },
  "MOLHO GOIABADA DEFUMADA GUAVA SMOKED 200G ROMS SAUCE": { codigo: "210169", categoria: "ACOMPANHAMENTO", tags: ["ACOMPANHAMENTO", "MOLHO", "ROMS SAUCE", "GOIABADA", "DEFUMADA", "GUAVA"], unidade: "UN" },
  "MOLHO CHIMICHURRI TRADICIONAL LE GUSTA CODIGO DA CARNE 160G": { codigo: "7898960489811", categoria: "ACOMPANHAMENTO", tags: ["ACOMPANHAMENTO", "MOLHO", "LE GUSTA", "CÓDIGO DA CARNE", "CHIMICHURRI", "CODIGO DA CARNE"], unidade: "UN" },
  "MOLHO SWEET CHILLI TRADICIONAL DE CABRON 230G": { codigo: "1010024", categoria: "ACOMPANHAMENTO", tags: ["ACOMPANHAMENTO", "MOLHO", "DE CABRON", "SWEET CHILLI"], unidade: "UN" },
  "MOLHO SRIRACHA DE CABRON 220G": { codigo: "1020012", categoria: "ACOMPANHAMENTO", tags: ["ACOMPANHAMENTO", "MOLHO", "DE CABRON", "SRIRACHA", "PIMENTA"], unidade: "UN" },
  "MOLHO DE PIMENTA DON OSCAR": { codigo: "220", categoria: "ACOMPANHAMENTO", tags: ["ACOMPANHAMENTO", "MOLHO", "DON OSCAR", "PIMENTA"], unidade: "UN" },
  "MAIONESE FDS": { codigo: "002500", categoria: "ACOMPANHAMENTO", tags: ["ACOMPANHAMENTO", "MOLHO", "MAIONESE", "FDS"], unidade: "KG" },
  "KETCHUP TRADICIONAL HEINZ 397 G": { codigo: "16099", categoria: "ACOMPANHAMENTO", tags: ["ACOMPANHAMENTO", "MOLHO", "HEINZ", "KETCHUP"], unidade: "UN" },
  "KETCHUP PICLES HEINZ 397 G": { codigo: "18761", categoria: "ACOMPANHAMENTO", tags: ["ACOMPANHAMENTO", "MOLHO", "HEINZ", "KETCHUP", "PICKLES"], unidade: "UN" },
  "MOSTARDA TRADICIONAL HEINZ 255 G": { codigo: "16164", categoria: "ACOMPANHAMENTO", tags: ["ACOMPANHAMENTO", "MOLHO", "HEINZ", "MOSTARDA"], unidade: "UN" },
  "VINAGRETE FDS CDC": { codigo: "002503", categoria: "ACOMPANHAMENTO", tags: ["ACOMPANHAMENTO", "MOLHO", "CDC", "VINAGRETE", "FDS"], unidade: "KG" },
  "MEL DE ABELHA MADE BY BEES 440G": { codigo: "1608", categoria: "ACOMPANHAMENTO", tags: ["ACOMPANHAMENTO", "MOLHO", "MADE BY BEES", "MEL", "ABELHA"], unidade: "UN" },
  "ALHO DOURADO CROCANTE TRADICIONAL SOUL CHEF": { codigo: "PD0001", categoria: "ACOMPANHAMENTO", tags: ["ACOMPANHAMENTO", "MOLHO", "SOUL CHEF", "ALHO", "DOURADO", "CROCANTE"], unidade: "UN" },

  // ══════════════════════════════════════════════════
  // ACOMPANHAMENTO — SAL E TEMPERO
  // ══════════════════════════════════════════════════
  "SAL DE PARRILLA PREMIUM 500G CODIGO DA CARNE": { codigo: "11082", categoria: "ACOMPANHAMENTO", tags: ["ACOMPANHAMENTO", "SAL", "CÓDIGO DA CARNE", "PARRILLA", "PREMIUM", "CODIGO DA CARNE"], unidade: "UN" },
  "SAL DE PARRILLA 250G CODIGO DA CARNE": { codigo: "12122023", categoria: "ACOMPANHAMENTO", tags: ["ACOMPANHAMENTO", "SAL", "CÓDIGO DA CARNE", "PARRILLA", "CODIGO DA CARNE"], unidade: "UN" },
  "SAL DE PARRILLA CODIGO DA CARNE SACHE 150G": { codigo: "210194", categoria: "ACOMPANHAMENTO", tags: ["ACOMPANHAMENTO", "SAL", "CÓDIGO DA CARNE", "PARRILLA", "SACHE", "CODIGO DA CARNE"], unidade: "UN" },
  "SAL DE PARRILHA SACHE 80G CDC": { codigo: "202", categoria: "ACOMPANHAMENTO", tags: ["ACOMPANHAMENTO", "SAL", "CDC", "PARRILLA", "SACHE"], unidade: "UN" },
  "SALT AND PEPPER 500G CÓDIGO DA CARNE": { codigo: "210140", categoria: "ACOMPANHAMENTO", tags: ["ACOMPANHAMENTO", "SAL", "CÓDIGO DA CARNE", "PIMENTA", "SALT AND PEPPER", "CODIGO DA CARNE"], unidade: "UN" },
  "SALT AND RED PEPPER 500G CÓDIGO DA CARNE": { codigo: "210139", categoria: "ACOMPANHAMENTO", tags: ["ACOMPANHAMENTO", "SAL", "CÓDIGO DA CARNE", "PIMENTA VERMELHA", "SALT AND PEPPER", "CODIGO DA CARNE"], unidade: "UN" },
  "SALT AND LEMON PEPPER 500G CÓDIGO DA CARNE": { codigo: "210141", categoria: "ACOMPANHAMENTO", tags: ["ACOMPANHAMENTO", "SAL", "CÓDIGO DA CARNE", "LIMÃO", "PIMENTA", "SALT AND PEPPER", "CODIGO DA CARNE"], unidade: "UN" },
  "SAL CAMPEIRO 490G CÓDIGO DA CARNE": { codigo: "210143", categoria: "ACOMPANHAMENTO", tags: ["ACOMPANHAMENTO", "SAL", "CÓDIGO DA CARNE", "CAMPEIRO", "CODIGO DA CARNE"], unidade: "UN" },
  "SAL & CHIMICHURRI 490G CÓDIGO DA CARNE": { codigo: "210142", categoria: "ACOMPANHAMENTO", tags: ["ACOMPANHAMENTO", "SAL", "CÓDIGO DA CARNE", "CHIMICHURRI", "CODIGO DA CARNE"], unidade: "UN" },
  "SAL DE FINALIZACAO 500G CODIGO DA CARNE": { codigo: "7898960489613", categoria: "ACOMPANHAMENTO", tags: ["ACOMPANHAMENTO", "SAL", "CÓDIGO DA CARNE", "FINALIZACAO", "CODIGO DA CARNE"], unidade: "UN" },
  "SAL PIMENTA E ALHO CODIGO DA CARNE 190G": { codigo: "27199", categoria: "ACOMPANHAMENTO", tags: ["ACOMPANHAMENTO", "SAL", "CÓDIGO DA CARNE", "PIMENTA", "ALHO", "CODIGO DA CARNE"], unidade: "UN" },
  "SAL CELUSAL PARRILLA 1 KG": { codigo: "4652", categoria: "ACOMPANHAMENTO", tags: ["ACOMPANHAMENTO", "SAL", "CELUSAL", "PARRILLA"], unidade: "UN" },
  "SAL CELUSAL GRUESA 1 KG": { codigo: "4653", categoria: "ACOMPANHAMENTO", tags: ["ACOMPANHAMENTO", "SAL", "CELUSAL", "GROSSO"], unidade: "UN" },
  "SAL MARINHO MALDON FLAKES 250G": { codigo: "54519", categoria: "ACOMPANHAMENTO", tags: ["ACOMPANHAMENTO", "SAL", "MALDON", "MARINHO", "FLAKES", "PREMIUM"], unidade: "UN" },
  "SAL MALDON DEFUMADO FLAKES 125G": { codigo: "54518", categoria: "ACOMPANHAMENTO", tags: ["ACOMPANHAMENTO", "SAL", "MALDON", "DEFUMADO", "FLAKES", "PREMIUM"], unidade: "UN" },
  "SAL MARINHO MALDON CHILLI 100G": { codigo: "54520", categoria: "ACOMPANHAMENTO", tags: ["ACOMPANHAMENTO", "SAL", "MALDON", "MARINHO", "CHILLI", "PREMIUM"], unidade: "UN" },
  "SAL MALDON DESERT KALAHARI 250G": { codigo: "54522", categoria: "ACOMPANHAMENTO", tags: ["ACOMPANHAMENTO", "SAL", "MALDON", "KALAHARI", "PREMIUM"], unidade: "UN" },
  "SAL ARABE LEGUSTA 200G": { codigo: "3434", categoria: "ACOMPANHAMENTO", tags: ["ACOMPANHAMENTO", "SAL", "LE GUSTA", "ARABE"], unidade: "UN" },
  "SAL CORDEIRO LE GUSTA CODIGO DA CARNE 160G": { codigo: "7898960489538", categoria: "ACOMPANHAMENTO", tags: ["ACOMPANHAMENTO", "SAL", "LE GUSTA", "CÓDIGO DA CARNE", "CORDEIRO", "CODIGO DA CARNE"], unidade: "UN" },
  "TEMPERO LE GUSTA TRADICIONAL SAL MARINHO E ESPECIARIAS 260G": { codigo: "7898960489019", categoria: "ACOMPANHAMENTO", tags: ["ACOMPANHAMENTO", "SAL", "LE GUSTA", "TEMPERO", "SAL MARINHO", "ESPECIARIAS"], unidade: "UN" },
  "TEMPERO FRUTAS GRELHADAS LE GUSTA CODIGO DA CARNE 200G": { codigo: "7898960489835", categoria: "ACOMPANHAMENTO", tags: ["ACOMPANHAMENTO", "SAL", "LE GUSTA", "CÓDIGO DA CARNE", "TEMPERO", "FRUTAS GRELHADAS"], unidade: "UN" },
  "BLACK RUB CODIGO DA CARNE 150G": { codigo: "210215", categoria: "ACOMPANHAMENTO", tags: ["ACOMPANHAMENTO", "SAL", "CÓDIGO DA CARNE", "RUB", "BLACK", "TEMPERO", "CODIGO DA CARNE"], unidade: "UN" },
  "DRY RUB CODIGO DA CARNE LE GUSTA 150G": { codigo: "1809013", categoria: "ACOMPANHAMENTO", tags: ["ACOMPANHAMENTO", "SAL", "CÓDIGO DA CARNE", "LE GUSTA", "DRY RUB", "TEMPERO", "CODIGO DA CARNE"], unidade: "UN" },
  "BEEF RUB - 140G LE GUSTA": { codigo: "T101", categoria: "ACOMPANHAMENTO", tags: ["ACOMPANHAMENTO", "SAL", "LE GUSTA", "BEEF RUB", "TEMPERO"], unidade: "UN" },
  "SACHE SALT E PEPPER 30G COMBO BURGUER": { codigo: "201", categoria: "ACOMPANHAMENTO", tags: ["ACOMPANHAMENTO", "SAL", "KIT BURGUER", "CDC", "PIMENTA", "SACHE", "COMBO", "BURGUER"], unidade: "UN" },

  // ══════════════════════════════════════════════════
  // ACOMPANHAMENTO — FAROFA & BATATA
  // ══════════════════════════════════════════════════
  "FAROFE FAROFA TEMPERADA COM CEBOLA": { codigo: "22", categoria: "ACOMPANHAMENTO", tags: ["ACOMPANHAMENTO", "FAROFA", "TEMPERADA", "CEBOLA"], unidade: "KG" },
  "FAROFA CROCANTE PRATIC LEVE": { codigo: "25", categoria: "ACOMPANHAMENTO", tags: ["ACOMPANHAMENTO", "FAROFA", "PRATIC LEVE", "CROCANTE"], unidade: "UN" },
  "MANDIOCA CREMOSA FDS": { codigo: "002501", categoria: "ACOMPANHAMENTO", tags: ["ACOMPANHAMENTO", "FAROFA", "MANDIOCA", "CREMOSA", "FDS", "AIPIM"], unidade: "KG" },
  "BATATA ONDULADA CHURRAS 80G PRATIC LEVE": { codigo: "001090", categoria: "ACOMPANHAMENTO", tags: ["ACOMPANHAMENTO", "BATATA", "PRATIC LEVE", "ONDULADA", "CHURRASCO"], unidade: "UN" },
  "BATATA RUSTICA 80G PRATIC LEVE": { codigo: "210213", categoria: "ACOMPANHAMENTO", tags: ["ACOMPANHAMENTO", "BATATA", "PRATIC LEVE", "RUSTICA"], unidade: "UN" },
  "BATATA ONDULADA CEBOLA SALSA 80G PRATIC LEVE": { codigo: "001106", categoria: "ACOMPANHAMENTO", tags: ["ACOMPANHAMENTO", "BATATA", "PRATIC LEVE", "ONDULADA", "CEBOLA", "SALSA"], unidade: "UN" },
  "BATATA ONDULADA ORIGINAL 80G PRATIC LEVE": { codigo: "001083", categoria: "ACOMPANHAMENTO", tags: ["ACOMPANHAMENTO", "BATATA", "PRATIC LEVE", "ONDULADA", "ORIGINAL"], unidade: "UN" },

  // ══════════════════════════════════════════════════
  // ACOMPANHAMENTO — OUTROS
  // ══════════════════════════════════════════════════
  "PIMENTA EM CONSERVA CHURRASQUINHO DE PIMENTA CDC": { codigo: "5011", categoria: "ACOMPANHAMENTO", tags: ["ACOMPANHAMENTO", "OUTROS", "CDC", "PIMENTA", "CONSERVA"], unidade: "UN" },
  "CALDO DE CARNE 1 LITRO DAVOZZI": { codigo: "2270", categoria: "ACOMPANHAMENTO", tags: ["CALDO", "ACOMPANHAMENTO", "DAVOZZI", "CARNE"], unidade: "UN" },
  "CALDO DE FRANGO 1 LITRO DAVOZZI": { codigo: "2271", categoria: "ACOMPANHAMENTO", tags: ["CALDO", "ACOMPANHAMENTO", "DAVOZZI", "FRANGO"], unidade: "UN" },
  "CALDO DE LEGUMES 1 LITRO DAVOZZI": { codigo: "2272", categoria: "ACOMPANHAMENTO", tags: ["CALDO", "ACOMPANHAMENTO", "DAVOZZI", "LEGUMES"], unidade: "UN" },

  // ══════════════════════════════════════════════════
  // TORRESMO / PETISCO
  // ══════════════════════════════════════════════════
  "TORRESMO PRONTO SANTA MASSA 40G": { codigo: "157", categoria: "TORRESMO", tags: ["TORRESMO", "SANTA MASSA", "PRONTO", "PETISCO"], unidade: "UN" },
  "TORRESMO PRONTO ALHO DEFUMADO SANTA MASSA 40G": { codigo: "177", categoria: "TORRESMO", tags: ["TORRESMO", "SANTA MASSA", "PRONTO", "ALHO", "DEFUMADO", "PETISCO"], unidade: "UN" },
  "TORRESMO PRONTO LIMAO SANTA MASSA 40G": { codigo: "212", categoria: "TORRESMO", tags: ["TORRESMO", "SANTA MASSA", "PRONTO", "LIMAO", "PETISCO"], unidade: "UN" },
  "TORRESMINHO TRADICIONAL PIG CHEF 80G": { codigo: "210079", categoria: "TORRESMO", tags: ["TORRESMO", "PIG CHEF", "TRADICIONAL", "PETISCO"], unidade: "UN" },

  // ══════════════════════════════════════════════════
  // SORVETE / PICOLÉ
  // ══════════════════════════════════════════════════
  "SORVETE UVA AO CREME POTE 500 ML SAVIO": { codigo: "8043", categoria: "SORVETE", tags: ["SORVETE", "SAVIO", "UVA", "CREME"], unidade: "UN" },
  "SORVETE CARAMELO CROCANTE E DOCE DE LEITE POTE 1,5 L SAVIO": { codigo: "8037", categoria: "SORVETE", tags: ["SORVETE", "SAVIO", "CARAMELO", "DOCE DE LEITE"], unidade: "UN" },
  "SORVETE DE IOGURTE COM AMARENA 1,5 L SAVIO": { codigo: "7972", categoria: "SORVETE", tags: ["SORVETE", "SAVIO", "IOGURTE", "AMARENA"], unidade: "UN" },
  "SORVETE PISTACHE POTE 1 L SAVIO": { codigo: "11315", categoria: "SORVETE", tags: ["SORVETE", "SAVIO", "PISTACHE"], unidade: "UN" },
  "SORVETE CHOCOMALTINE POTE 1,5 L SAVIO": { codigo: "7990", categoria: "SORVETE", tags: ["SORVETE", "SAVIO", "CHOCOLATE", "MALTINE"], unidade: "UN" },
  "SORVETE DE CREME COM CROCANTE 1,5 L SAVIO": { codigo: "7976", categoria: "SORVETE", tags: ["SORVETE", "SAVIO", "CREME", "CROCANTE"], unidade: "UN" },
  "SORVETE LEITINHO TRUFADO POTE 1,5 L SAVIO": { codigo: "8027", categoria: "SORVETE", tags: ["SORVETE", "SAVIO", "LEITINHO", "TRUFADO"], unidade: "UN" },
  "SORVETE COCCO BIANCO POTE 1,5L SAVIO": { codigo: "11201", categoria: "SORVETE", tags: ["SORVETE", "SAVIO", "COCCO", "COCO"], unidade: "UN" },
  "SORVETE BRIGADEIRO POTE 2 L SAVIO": { codigo: "8070", categoria: "SORVETE", tags: ["SORVETE", "SAVIO", "BRIGADEIRO"], unidade: "UN" },
  "SORVETE MORANGO E LEITE CONDENSADO POTE 2 L SAVIO": { codigo: "8041", categoria: "SORVETE", tags: ["SORVETE", "SAVIO", "MORANGO", "LEITE CONDENSADO"], unidade: "UN" },
  "SORVETE NAPOLITANO ESPECIAL POTE 2 L SAVIO": { codigo: "8032", categoria: "SORVETE", tags: ["SORVETE", "SAVIO", "NAPOLITANO"], unidade: "UN" },
  "SORVETE MARACUJA AO CREME POTE 150 ML SAVIO": { codigo: "7987", categoria: "SORVETE", tags: ["SORVETE", "SAVIO", "MARACUJA", "CREME"], unidade: "UN" },
  "SORVETE UVA AO CREME POTE 150 ML SAVIO": { codigo: "8035", categoria: "SORVETE", tags: ["SORVETE", "SAVIO", "UVA", "CREME"], unidade: "UN" },
  "PICOLE SUPREMO CHOCOLATE SAVIO": { codigo: "8045", categoria: "SORVETE", tags: ["SORVETE", "SAVIO", "PICOLE", "CHOCOLATE"], unidade: "UN" },
  "PICOLE SUPREMO PISTACHE SAVIO": { codigo: "8072", categoria: "SORVETE", tags: ["SORVETE", "SAVIO", "PICOLE", "PISTACHE"], unidade: "UN" },
  "PICOLE SUPREMO BROWNIE SAVIO": { codigo: "8075", categoria: "SORVETE", tags: ["SORVETE", "SAVIO", "PICOLE", "BROWNIE"], unidade: "UN" },
  "PICOLE NAPOLITANO SAVIO": { codigo: "8076", categoria: "SORVETE", tags: ["SORVETE", "SAVIO", "PICOLE", "NAPOLITANO"], unidade: "UN" },
  "PICOLE TABLET SAVIO": { codigo: "7958", categoria: "SORVETE", tags: ["SORVETE", "SAVIO", "PICOLE", "TABLET"], unidade: "UN" },

  // ══════════════════════════════════════════════════
  // ACESSÓRIOS — ESPETO / SUPORTE / GRELHA
  // ══════════════════════════════════════════════════
  "ESPETO GAUCHO DUPLO 75CM (62CM LAM)": { codigo: "GA004", categoria: "ACESSORIOS", tags: ["ACESSORIOS", "ESPETO", "GRILAZER", "GAUCHO", "DUPLO", "75CM", "CHURRASCO", "ACESSORIO"], unidade: "UN" },
  "ESPETO GAUCHO DUPLO 55CM (42CM LAM) GRILAZER": { codigo: "GA002", categoria: "ACESSORIOS", tags: ["ACESSORIOS", "ESPETO", "GRILAZER", "GAUCHO", "DUPLO", "55CM", "CHURRASCO", "ACESSORIO"], unidade: "UN" },
  "ESPETO GAUCHO SIMPLES 65 CM (52 LAM)": { codigo: "GA022", categoria: "ACESSORIOS", tags: ["ACESSORIOS", "ESPETO", "GRILAZER", "GAUCHO", "SIMPLES", "65CM", "CHURRASCO", "ACESSORIO"], unidade: "UN" },
  "ESPETO GAUCHO DUPLO 85CM  - 70CM LAM": { codigo: "GA005", categoria: "ACESSORIOS", tags: ["ACESSORIOS", "ESPETO", "GRILAZER", "GAUCHO", "DUPLO", "85CM", "CHURRASCO", "ACESSORIO"], unidade: "UN" },
  "ESPETO GAUCHO DUPLO 65CM - 52CM LAM": { codigo: "GA003", categoria: "ACESSORIOS", tags: ["ACESSORIOS", "ESPETO", "GRILAZER", "GAUCHO", "DUPLO", "65CM", "CHURRASCO", "ACESSORIO"], unidade: "UN" },
  "ESPETO GIRATORIO GRANDE 60CM 110V": { codigo: "45002", categoria: "ACESSORIOS", tags: ["ACESSORIOS", "ESPETO", "GIRATORIO", "ELETRICO", "110V", "CHURRASCO", "ACESSORIO"], unidade: "UN" },
  "ESPETOS DE BAMBU PARANA C/ 50 UN": { codigo: "400300121", categoria: "ACESSORIOS", tags: ["ACESSORIOS", "ESPETO", "PARANA", "BAMBU", "DESCARTAVEL", "ACESSORIO"], unidade: "UN" },
  "GRELHA URUGUAIA ANTIADERENTE ANAFLON": { codigo: "GR1015", categoria: "ACESSORIOS", tags: ["ACESSORIOS", "GRELHA", "ANAFLON", "URUGUAIA", "ANTIADERENTE", "ACESSORIO"], unidade: "UN" },
  "GRELHA GAUCHO TELA MOEDA 50X49 CM GRILAZER": { codigo: "GA140", categoria: "ACESSORIOS", tags: ["ACESSORIOS", "GRELHA", "GRILAZER", "GAUCHO", "TELA MOEDA", "50X49", "ACESSORIO"], unidade: "UN" },
  "GRELHA GAUCHO TELA MOEDA 40X49 GRILAZER": { codigo: "GA142", categoria: "ACESSORIOS", tags: ["ACESSORIOS", "GRELHA", "GRILAZER", "GAUCHO", "TELA MOEDA", "40X49", "ACESSORIO"], unidade: "UN" },
  "GRELHA INOX PARRILLA ARGENTINA 40X50CM C/ CALHA GRILAZER": { codigo: "GR0100", categoria: "ACESSORIOS", tags: ["ACESSORIOS", "GRELHA", "GRILAZER", "INOX", "PARRILLA", "ARGENTINA", "CALHA", "ACESSORIO"], unidade: "UN" },
  "GRELHA GAUCHO PARA PEIXE (G) 25X50 CM GRILAZER": { codigo: "GA111", categoria: "ACESSORIOS", tags: ["ACESSORIOS", "GRELHA", "GRILAZER", "PEIXE", "GAUCHO", "ACESSORIO"], unidade: "UN" },
  "CHURRASQUEIRA DESMONTAVEL INOX CDC": { codigo: "000415", categoria: "ACESSORIOS", tags: ["ACESSORIOS", "GRELHA", "CDC", "CHURRASQUEIRA", "DESMONTAVEL", "INOX", "ACESSORIO"], unidade: "UN" },

  // ══════════════════════════════════════════════════
  // ACESSÓRIOS — FACA / AFIADOR / UTENSÍLIOS / EMBALAGENS
  // ══════════════════════════════════════════════════
  "AFIADOR DE FACAS PROFISSIONAL SUPRA KORTE": { codigo: "1960004", categoria: "ACESSORIOS", tags: ["ACESSORIOS", "FACA", "SUPRA KORTE", "AFIADOR", "PROFISSIONAL", "ACESSORIO"], unidade: "UN" },
  "AFIADOR DE FACAS AZUL SUPRA KORTE": { codigo: "1950003", categoria: "ACESSORIOS", tags: ["ACESSORIOS", "FACA", "SUPRA KORTE", "AFIADOR", "AZUL", "ACESSORIO"], unidade: "UN" },
  "YUZE AFIADOR DE FACAS PRETO - EMBALAGEM BLISTER": { codigo: "4", categoria: "ACESSORIOS", tags: ["ACESSORIOS", "FACA", "YUZE", "AFIADOR", "ACESSORIO"], unidade: "UN" },
  "PEDRA DE AFIAR COMBINADA 108N CARBORUNDUM": { codigo: "5725", categoria: "ACESSORIOS", tags: ["ACESSORIOS", "FACA", "CARBORUNDUM", "PEDRA DE AFIAR", "ACESSORIO"], unidade: "UN" },
  "ABRIDOR CARTÃO INOX PRETO 10 CDC": { codigo: "AC10", categoria: "ACESSORIOS", tags: ["ACESSORIOS", "OUTROS", "CDC", "ABRIDOR", "INOX", "ACESSORIO"], unidade: "UN" },
  "ABRIDOR FIXO NOVO PRETO": { codigo: "AF-005", categoria: "ACESSORIOS", tags: ["ACESSORIOS", "OUTROS", "ABRIDOR", "FIXO", "ACESSORIO"], unidade: "UN" },
  "TABUA DE CARNE RUSTICA (BOLACHA) PRIME": { codigo: "9016", categoria: "ACESSORIOS", tags: ["ACESSORIOS", "OUTROS", "PRIME", "TABUA", "CARNE", "RUSTICA", "MADEIRA", "ACESSORIO"], unidade: "UN" },
  "LUVA ANTICALOR PARA CHURRASCO PRIME GRILL": { codigo: "GR0891", categoria: "ACESSORIOS", tags: ["ACESSORIOS", "OUTROS", "PRIME GRILL", "LUVA", "ANTICALOR", "CHURRASCO", "ACESSORIO"], unidade: "UN" },
  "BOLSA TERMICA 15 LITROS CDC COM ALÇA DE COURO": { codigo: "210136", categoria: "ACESSORIOS", tags: ["ACESSORIOS", "EMBALAGEM", "CDC", "BOLSA TERMICA", "15 LITROS", "COURO", "ACESSORIO"], unidade: "UN" },
  "CAIXA PRESENTE CDC": { codigo: "002225", categoria: "ACESSORIOS", tags: ["ACESSORIOS", "EMBALAGEM", "CDC", "CAIXA PRESENTE", "ACESSORIO", "PRESENTE"], unidade: "UN" },
  "CAIXA ISOPOR 10 LTS CODIGO DA CARNE": { codigo: "210168", categoria: "ACESSORIOS", tags: ["ACESSORIOS", "EMBALAGEM", "CÓDIGO DA CARNE", "ISOPOR", "CAIXA", "10 LITROS", "CODIGO DA CARNE", "ACESSORIO"], unidade: "UN" },
  "CAIXA ISOPOR 17 LTS CODIGO DA CARNE": { codigo: "2892543", categoria: "ACESSORIOS", tags: ["ACESSORIOS", "EMBALAGEM", "CÓDIGO DA CARNE", "ISOPOR", "CAIXA", "17 LITROS", "CODIGO DA CARNE", "ACESSORIO"], unidade: "UN" },
  "CAIXA ISOPOR 35 LTS CODIGO DA CARNE": { codigo: "2887914", categoria: "ACESSORIOS", tags: ["ACESSORIOS", "EMBALAGEM", "CÓDIGO DA CARNE", "ISOPOR", "CAIXA", "35 LITROS", "CODIGO DA CARNE", "ACESSORIO"], unidade: "UN" },

  // ══════════════════════════════════════════════════
  // ACESSÓRIOS — ACENDEDOR / CARVÃO
  // ══════════════════════════════════════════════════
  "CARVÃO CODIGO DA CARNE 5KG": { codigo: "015764", categoria: "ACESSORIOS", tags: ["ACESSORIOS", "ACENDEDOR", "CÓDIGO DA CARNE", "CARVAO", "5KG", "CODIGO DA CARNE"], unidade: "UN" },
  "ACENDEDOR BASTÃO C/10 FIAT LUX": { codigo: "2152", categoria: "ACESSORIOS", tags: ["ACESSORIOS", "ACENDEDOR", "FIAT LUX", "BASTAO"], unidade: "UN" },
  "YUZE ACENDEDOR ELETRICO DE CARVÃO 110V": { codigo: "4058", categoria: "ACESSORIOS", tags: ["ACESSORIOS", "ACENDEDOR", "YUZE", "ELETRICO", "CARVAO", "110V"], unidade: "UN" },
  "GEL ACENDEDOR ALCOOL ETILICO 420G FIAT LUX": { codigo: "7896007939039", categoria: "ACESSORIOS", tags: ["ACESSORIOS", "ACENDEDOR", "FIAT LUX", "GEL", "ALCOOL"], unidade: "UN" },
  "ACENDEDOR ALCOOL SOLIDO FIAT LUX": { codigo: "210030", categoria: "ACESSORIOS", tags: ["ACESSORIOS", "ACENDEDOR", "FIAT LUX", "ALCOOL SOLIDO"], unidade: "UN" },
  "FÓSFOROS EXTRA LONGOS C/ 50 FIAT LUX": { codigo: "1009", categoria: "ACESSORIOS", tags: ["ACESSORIOS", "ACENDEDOR", "FIAT LUX", "FOSFOROS", "EXTRA LONGOS"], unidade: "UN" },

  // ══════════════════════════════════════════════════
  // DEFUMAÇÃO / LENHA
  // ══════════════════════════════════════════════════
  "LENHA TORRADA ECOGRILL 4KG": { codigo: "52", categoria: "DEFUMACAO", tags: ["DEFUMACAO", "ECOGRILL", "LENHA", "TORRada"], unidade: "UN" },
  "LENHA GOIABEIRA GOIABA": { codigo: "005252", categoria: "DEFUMACAO", tags: ["DEFUMACAO", "LENHA", "GOIABEIRA"], unidade: "UN" },
  "SERRAGEM GOIABEIRA DEFUMAÇÃO BLUE SMOKE": { codigo: "210236", categoria: "DEFUMACAO", tags: ["DEFUMACAO", "BLUE SMOKE", "SERRAGEM", "GOIABEIRA"], unidade: "UN" },

  // ══════════════════════════════════════════════════
  // OUTROS / EMBALAGEM / USO E CONSUMO
  // ══════════════════════════════════════════════════
  "PAPEL ALUMÍNIO 30CMX4M FIAT LUX": { codigo: "211110", categoria: "ACESSORIOS", tags: ["ACESSORIOS", "EMBALAGEM", "FIAT LUX", "PAPEL ALUMINIO", "ACESSORIO"], unidade: "UN" },
  "SACOS PARA ASSAR FIAT LUX": { codigo: "7896007961375", categoria: "ACESSORIOS", tags: ["ACESSORIOS", "EMBALAGEM", "FIAT LUX", "SACO", "ASSAR", "ACESSORIO"], unidade: "UN" },
  "FILME POLIESTER PARA CHURRASCO 45CMX5M FIAT LUX": { codigo: "260621", categoria: "ACESSORIOS", tags: ["ACESSORIOS", "EMBALAGEM", "FIAT LUX", "FILME", "POLIESTER", "CHURRASCO", "ACESSORIO"], unidade: "UN" }

};

// Ordem de exibição das categorias
export const ORDEM_CATEGORIAS = [
  "KIT BURGUER",
  "BOVINO",
  "FRANGO",
  "SUINO",
  "LINGUICA",
  "CORDEIRO",
  "PESCADOS",
  "QUEIJO",
  "CERVEJA",
  "BEBIDAS",
  "ACOMPANHAMENTO",
  "TORRESMO",
  "SORVETE",
  "ACESSORIOS",
  "DEFUMACAO"
];