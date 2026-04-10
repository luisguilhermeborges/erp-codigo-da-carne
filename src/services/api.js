// Configuração central da API
const BASE = 'https://api-codigo-da-carne.onrender.com/api';

const get  = (path)       => fetch(`${BASE}${path}`).then(r => r.json());
const post = (path, body) => fetch(`${BASE}${path}`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) }).then(r => r.json());
const put  = (path, body) => fetch(`${BASE}${path}`, { method:'PUT',  headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) }).then(r => r.json());
const del  = (path)       => fetch(`${BASE}${path}`, { method:'DELETE' }).then(r => r.json());

export const api = {
  // Preços
  precos: {
    buscar:    ()     => get('/precos'),
    importar:  (mapa) => post('/precos/importar', mapa),
  },
  // Pedidos
  pedidos: {
    fila:          ()              => get('/pedidos/fila'),
    historico:     ()              => get('/pedidos/historico'),
    todos:         ()              => get('/pedidos/todos'),
    criar:         (p)             => post('/pedidos', p),
    finalizar:     (id, dados)     => put(`/pedidos/${id}/finalizar`, dados),
    apagar:        (id)            => del(`/pedidos/${id}`),
    limpar:        (status)        => del(`/pedidos${status ? `?status=${status}` : ''}`),
    paraReceber:   (destino)       => get(`/pedidos/para-receber?destino=${encodeURIComponent(destino)}`),
    receber:       (id, dados)     => put(`/pedidos/${id}/receber`, dados),
  },
  // Filiais
  filiais: {
    buscar:  ()   => get('/filiais'),
    salvar:  (f)  => post('/filiais', f),
    sync:    (arr)=> post('/filiais/sync', arr),
    apagar:  (id) => del(`/filiais/${id}`),
  },
  // Usuários
  usuarios: {
    buscar:     ()      => get('/usuarios'),
    buscarUm:   (login) => get(`/usuarios/${login}`),
    salvar:     (u)     => post('/usuarios', u),
    apagar:     (id)    => del(`/usuarios/${id}`),
  },
};