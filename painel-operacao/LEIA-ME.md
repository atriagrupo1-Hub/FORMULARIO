# Painel da Operação

Publicado pela Cloudflare Pages a partir desta pasta.

- **Build output directory** no Cloudflare: `painel-operacao`
- Endereço final: `atriagrupo.com.br/dashprodutos`

Os arquivos ficam em `dashprodutos/`, e é esse nome de pasta que define o
caminho na URL. Trocar o nome da pasta muda o endereço.

## Atualizar o painel

Qualquer envio para a branch publica sozinho, em cerca de um minuto.
Não precisa arrastar nada na Cloudflare.

O `config.js` guarda a URL e a chave `anon` do Supabase. A chave é pública
por natureza — a segurança fica nas regras de RLS do banco, definidas em
`supabase-painel.sql`.
