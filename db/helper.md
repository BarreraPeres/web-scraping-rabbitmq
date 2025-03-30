# docker run --name db-scraping -e POSTGRESQL_USERNAME=docker
# -e POSTGRESQL_PASSWORD=docker -e POSTGRESQL_DATABASE=db-scraping-pg 
# -p 5432:5432 docker.io/bitnami/postgresql:16

## rode tbm o rabbitMQ 
### docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:management

# rodando as migrations do db
## ~/node
## ❯ docker cp db/schema.sql db-scraping:/schema.sql
### docker exec -i db-scraping psql -U docker -d db-scraping-pg -f /schema.sql

# como remover um migration errada
## docker exec -it -u root db-scraping bash
### rm /schema.sql
### entao copie novamente o schema.sql

# accesse o db pelo terminal com o seguinte comando:
## docker exec -it db-scraping psql -U docker -d db-scraping-pg