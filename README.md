### Web Scraping 
## Neste projeto tentei usar um pouco da ortogonalidade (pág: 56 - Programador Pragmático)

# Cada serviço com responsabilidade única
# A API apenas recebe requisições e envia para processamento
# Um serviço dedicado de scraping consome as mensagens e processa diretamente
# Os resultados são armazenados em um banco de dados

# A API pode consultar os resultados ou receber notificações de conclusão

## Vantagem da ortogalidade
# Permite maior escalabilidade
# manutenibilidade 
# resiliência do sistema como um todo.
