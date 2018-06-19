# Como instalar o sistema:

1. Instalar Node.js e npm
2. Instalar as dependências do projeto com `npm install` (dentro da pasta do projeto)
3. Instalar as libs de Cliente do Oracle usando o `.zip` na pasta `libclient_orcl` (Se for Linux Ubuntu)
    1. Extrair arquivos na sua pasta `$HOME/.local/lib/<aqui>`
    2. Exportar o caminho para variável de ambiente
    ```bash
        echo 'export LD_LIBRARY_PATH="$HOME/.local/lib/instantclient_12_2"' >> $HOME/.bashrc
    ```
