[<img src="https://cdn.countryflags.com/thumbs/united-states-of-america/flag-3d-round-250.png" width="32">](https://github.com/led-startup-studio/boletos/tree/master/.github/workflows/README.md)
[<img src="https://cdn.countryflags.com/thumbs/brazil/flag-3d-round-250.png" width="32">](https://github.com/led-startup-studio/boletos/tree/master/.github/workflows/LEIAME.md)


# GitHub Actions

## Versionamentoe Subimissão

O script em Action realiza o versionamento do projeto baseado na versão descrita no arquivo package.json.

Para criar uma nova versão, basta atualizar a versão no arquivo package.json e criar uma PR ou um subir diretamente para ramificação master do projeto.

O script irá verificar se uma TAG com a mesma versão já foi criada no GitHub. Caso seja uma nova TAG, ela será criada no GitHub e uma nova versão será enviada aos serviços do NPM. Caso contrário, será realizado somente um teste unitário para validar o código submetido.

O padrão utilizado para versionamento é o X.Y.Z, no qual X é referente a atualizações significantes, enquanto Z é para atualizações menores, correções de erros ou mesmo ajustes pequenos.
