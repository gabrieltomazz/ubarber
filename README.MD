Getting started 

* Criando o projeto 
    * yarn init -l

* Adicionando dependencias
    * node add express
    * node add sucrase nodemon -d
    * yarn add eslint  
    * yarn eslint --init
    * yarn add sequelize ( Database ORM )
    * yarn add sequelize-cli ( ORM cli)
    * yarn add pg pg-hstore ( Database PgAdmin )
    * yarn add bcryptjs ( Security random generation numbers )
    * yarn add jsonwebtoken ( token provider )
    * yarn add yup (Data validator )
    * yarn add multer (Upload files)
    * yarn add date-fns@next ( data formater)
    * yarn add mongoose ( non relational database )
    * yarn add nodemailer ( email manager )
    * yarn add express-handlebars nodemailer-express-handlebars ( Email template manager )
    * yarn add bee-queue ( Queu manager )
    * yarn add @sentry/node@5.15.4 ( Error monitoring )
    * yarn add express-async-errors ( Throw Applications errors in Express )
    * yarn add youch ( Treat error message )
    * yarn add dotenv ( Build Global ENVORIMENT VARIABLES )
    
* docker
    * postgresSQL
        - docker run --name ubarber-database -e POSTGRES_PASSWORD=docker -p 5432:5432  -d postgres 
        - docker start ubarber-database
    * mongodb
        - docker run --name mongoubarber -p 27017:27017 -d -t mongo
        - docker start mongoubarber
    * redis to emails notification 
        - docker run --name redisubarber -p 6379:6379 -d -t redis:alpine
        - docker start redisubarber

* Softwares to dowload
    * Visual Studio Code 
    * Insomnia
    * Postbird
    * Mongodb Compass
    * Bee-queue or Kue(Better but less performance)
* Sequelize
    * Migrations
        * yarn sequelize migration:create --name=create-users
        * yarn sequelize migration:create --name=create-files
        * yarn sequelize migration:create --name=create-appointments
    * Run migrations
        * yarn sequelize db:migrate
        * yarn sequelize db:migrate:undo:all

* Email - Tools
    * Amazon SES
    * Mailgun
    * Sparkpost
    * Mandril (Mailchimp)
    * Mailtrap (Dev - free)




