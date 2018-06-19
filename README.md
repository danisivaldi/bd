# Como instalar o sistema:

1. Instalar Node.js e npm
2. Instalar as dependências do projeto com `npm install` (dentro da pasta do projeto)
3. Instalar as libs de Cliente do Oracle usando o `.zip` na pasta `libclient_orcl` (Se for Linux Ubuntu)
    1. Extrair arquivos na sua pasta `$HOME/.local/lib/<aqui>`
    2. Exportar o caminho para variável de ambiente
    ```bash
        echo 'export LD_LIBRARY_PATH="$HOME/.local/lib/instantclient_12_2"' >> $HOME/.bashrc
    ```
4. Faça uma cópia do arquivo `.env.example` para um arquivo chamado `.env`, e modifique os campos necessários.

Por exemplo    

```env
DATABASE_USER=E5248962
DATABASE_PASSWORD=E5248962
DATABASE_HOST=grad.icmc.usp.br
DATABASE_PORT=15215
DATABASE_SID=orcl

```
