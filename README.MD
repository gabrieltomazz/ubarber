Getting started 

* Criando o projeto 
    * yarn init -l

* Adicionando dependencias
    * node add express
    * node add sucrase nodemon -d
    * yarn add eslint
    * yarn eslint --init
    * yarn add sequelize
    * yarn add sequelize-cli
    * yarn add pg pg-hstore
    * yarn add bcryptjs
    * yarn add jsonwebtoken 
    * yarn add yup

* docker
    * postgresSQL
        docker run --name ubarber-database -e POSTGRES_PASSWORD=docker -p 5432:5432  -d postgres 
        docker start ubarber-database

* Sequelize
    * Migrations
        * yarn sequelize migration:create --name=create-users
    * Run migrations
        * yarn sequelize db:migrate
        * yarn sequelize db:migrate:undo:all



