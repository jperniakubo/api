# Supernode - Documentaci贸n

> Node template (Typescript, Express, Sequelize TS y modelo Repositorio)

[![npm version](https://img.shields.io/npm/v/@toast-ui/editor.svg)](https://www.npmjs.com) [![github release version](https://img.shields.io/github/v/release/supermavster/supernode.svg?include_prereleases)](https://github.com/supermavster/supernode/releases/latest)  [![license](https://img.shields.io/github/license/supermavster/supernode.svg)](https://github.com/supermavster/supernode/blob/master/LICENSE)  [![PRs welcome](https://img.shields.io/badge/PRs-welcome-ff69b4.svg)](https://github.com/supermavster/supernode/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22) [![code with hearth by Supermavster](https://img.shields.io/badge/%3C/%3E%20with%20%E2%99%A5%20by-Supermavster-ff1414.svg)](https://github.com/supermavster)

**隆Ya no necesitas empezar tu proyecto Backend desde cero!**


# 馃毄 Tabla de contenido

- [Introducci贸n](#introducci贸n)
- [Comenzando 馃殌](#comenzando-)
- [Pre-requisitos 馃搵](#pre-requisitos-)
- [Instalaci贸n 馃敡](#instalaci贸n-)
- [Wiki 馃摉](#wiki-)
- [Caracter铆sticas 馃帹](#caracter铆sticas-)
- [Despliegue 馃摝](#despliegue-)
- [Construido con 馃洜锔廬(#construido-con-%EF%B8%8F)
- [Versionado 馃搶](#versionado-)
- [Contribuci贸n 鉁掞笍](#contribuci贸n-%EF%B8%8F)
- [Licencia 馃摐](#licencia-)
- [Expresiones de Gratitud 馃巵](#expresiones-de-gratitud-)
- [Developers 馃殌](#developers-)

# Introducci贸n


Esta es una 煤til, estructurada y compatible plantilla de Stack o Backend para **NODE**.

Hecho con las principales tecnolog铆as como: *Express, Sequelize, Jest y Node Server usando TypeScript*.

# Comenzando 馃殌

Sigue los siguientes pasos para utilizar y construir tus proyectos con base en este stack:

Realiza **fork** de este repositorio en t煤 cuenta.
![](https://i.ibb.co/C7sSKW1/star-fork.png)

O bien, puedes clonarlo directamente:
```shell
$ git clone https://github.com/supermavster/supernode.git
```

# Pre-requisitos 馃搵

Para poder utilizar este template, necesita tener instalado:
- Terminal
- NodeJS
- YARN
- Gestor de Base de datos
- Docker (Opcional)

Notas: 

**Terminal**
Para la terminal perfectamente puedes usar la terminal de [GIT](https://git-scm.com/ "GIT") o si quieres ser un poco m谩s profesional usar [Windows Subsystem for Linux (WSL) ](https://www.neoguias.com/activar-terminal-linux-windows-10/ "Windows Subsystem for Linux (WSL)")

**NodeJS**
Instalalo y descargalo en su versi贸n m谩s estable en el siguiente link: [NodeJS](https://nodejs.org/en/ "NodeJS") al instalar node trata de ejecutar **Install Additional Tools for Node.js** con el fin de poder tener todos los elementos necesarios para la ejecuci贸n de NodeJS.

**Yarn**
Instalalo y descargalo en su versi贸n m谩s estable en el siguiente link: [Yarn](https://yarnpkg.com/ "Yarn") , con el fin de ejecutar comandos m谩s rapidamente y un tanto m谩s estructurado.

**Gestor de Base de datos**
Por preferencia MySQL, o puedes escoger entre las siguientes: *Postgres, MySQL, MariaDB, Sqlite3 y Microsoft SQL Server*

**Docker** (Opcional)
Creaci贸n del gestor de base de datos e inclusivde ejecuci贸n de Node.


# Instalaci贸n 馃敡

Para la configuraci贸n de la instalaci贸n del mismo, debemos configurar los environments e instalar dependencias, para que podamos ejecutar el stack.


## Instalaci贸n de Dependencias

Ahora necesitamos instalar las dependencias del proyecto, utilizando alguno de los siguientes comandos:
```shell
$ npm install
```
or
```shell
$ yarn install
```

## Configuraci贸n
Necesitas a帽adir las variables de entorno, las cuales nos permitiran conectarnos a las bases de datos ofrecidas por Sequelize, al igual toda credencial que tengamos.

Para esto un ejemplo de un archivo env en la carpeta `environment`; m谩s especifico `environment/.env.example`

```shell
$ cd environment
$ cp .env.example .env.local && cp .env.example .env.development && cp .env.example .env.production
```
Un ejemplo base del archivo `.env.development` seria:

```
##################
# Env File
##################

ENV=development
VERSION=1
PROJECT=supernode
SHORT_NAME=sn
LANGUAGE=es

#HOST DATA:
HOST=localhost
PORT=5000

## DATABASE DATA
# DEV
DEV_DB_USERNAME=root
DEV_DB_PASSWORD=secret
DEV_DB_NAME=test
DEV_DB_HOSTNAME=127.0.0.1
DEV_DB_SYSTEM=mysql
DEV_DB_PORT=33060

GMAIL_SERVICE_NAME=gmail
GMAIL_SERVICE_HOST='smtp.gmail.com'
GMAIL_SERVICE_SECURE=true
GMAIL_SERVICE_PORT=465
GMAIL_USER_NAME=correo@gmail.com
GMAIL_USER_PASSWORD=secret
```


## Ejecutar el APP
**Warning! Debe de ejecutarse la base de datos antes de proseguir**

Si utilizas **docker** te recomiendo que montes y ejecutes un volumen con mysql, m谩s informaci贸n: [Docker + MySQL (Tutorial)](https://platzi.com/tutoriales/1432-docker/3268-como-crear-un-contenedor-con-docker-mysql-y-persistir-la-informacion/), despues de crear el volumen ejecutar el id o nombre del contenedor: `docker start be04f0c06...`

---
**Ejemplos de uso:**

Un ejemplo ejecutado con las credenciales en `local`, seria:

```shell
$ npm run dev:local
```
o
```shell
$ yarn dev:local
```

Dando como respuesta de servidor: http://localhost:5000/

---
***Development***

Un ejemplo ejecutado con las credenciales en `development`, seria:

```shell
$ npm run dev:development
```
o
```shell
$ yarn dev:development
```

O de manera corta, con la ejecuci贸n de `Nodemon`:

```shell
$ npm run dev
```
o
```shell
$ yarn dev
```


**Nota:** Configurar el archivo `.env.development` para la ejecuci贸n de este comando.


---
Un ejemplo ejecutado con las credenciales en `production`, seria:

```shell
$ npm run dev:production
```
o
```shell
$ yarn dev:production
```
---

La plantilla admite cuatro entornos, puede modificarlos desde pakcage.json > scripts
npm install. 

Por ejemplo, ejecute la plantilla `npm run serve:local`, para ejecutar la aplicaci贸n utilizando el modo de entorno local.

---

Para los servicios dirigete a la carpeta endpoints e importa dicho JSON en INSOMNIA

# Wiki 馃摉

Puedes encontrar mucho m谩s de c贸mo utilizar este proyecto en nuestra [Wiki](https://github.com/supermavster/supernode/wiki)


# Caracter铆sticas 馃帹
- Ejemplo completo de llamada API (para que pueda rastrearlo y saber c贸mo funciona el ciclo de vida de la llamada API).
- Uso de Typescript.
- Configurar entorno de prueba utilizando pruebas Jest con informes de cobertura. (In Progress)
- Estructura: Controlador, Servicio, Repositorio y Modelo.
- Validaci贸n de modelos de bases de datos.
- Eslint linting, Pettrier y Babel.
- Correcci贸n autom谩tica para errores de linting antes de confirmar cambios.
- Soporte de m煤ltiples entornos.
- Soporte de m煤lti lenguaje.
- Un lugar para manejar errores.
- Manejo de errores usando el m贸dulo Hapi / Boom (errores consistentes y estructurados).
- Manejo de Interfaces
- Creaci贸n de Migraciones Estructuradas.
- Creaci贸n de Seeders Estructurados.
- Ejemplos: CRUD y CRUD con archivos.
- Incorporaci贸n completa.
- Env铆o de correos electr贸nicos personalizados.
- Compilaci贸n con Babel en TS y configuraci贸n de la misma.
- Verificaci贸n y limpieza del c贸digo con ESLint y Pettrier usando TS.
- Generaci贸n autom谩tica de documentaci贸n en el Swagger
- Configuraci贸n del insomnio y servicios de pila
- Recopilaci贸n y ejecuci贸n
- Despliegue y configuraci贸n - *BitButcket*
- Y mucho m谩s...

**Nota:** Se puede extender a m谩s idiomas y escalar.

# Despliegue 馃摝

PENDING

# Construido con 馃洜锔?

Este proyecto fue creado usando las siguientes tecnologias:
- NodeJS
- Yarn
- Express
- Typescript
- Sequelize (and Sequelize TypeScript)
- Hapi/Boom
- Husky
- ESLint
- Prettier
- Nodemon or PM2
- HTTP Status Code
- Swagger
- Jest (in progress)

# Versionado 馃搶

Usamos [SemVer](http://semver.org/) para el versionado. Para todas las versiones disponibles, mira los [tags en este repositorio](https://github.com/supermavster/supernode/tags).

# Contribuci贸n 鉁掞笍
Puedes mirar la lista de todos los [contribuyentes](https://github.com/supermavster/supernode/contributors) qu铆enes han participado en este proyecto. 

# Licencia 馃摐

Este proyecto est谩 bajo la Licencia (MIT) - mira el archivo [LICENSE.md](LICENSE.md) para detalles. Supernode - 漏[Supermavster](https://github.com/Supermavster).

# Expresiones de Gratitud 馃巵

* Comenta a otros sobre este proyecto 馃摙
* Invita una cerveza 馃嵑 o un caf茅 鈽? a alguien del equipo. 
* Da las gracias p煤blicamente 馃.
* etc.



#  Developers 馃殌
| <img src="https://avatars3.githubusercontent.com/u/20430676?s=460&u=39d9c329b8fd8134c129b2b36fdf866fbab7b224&v=4" width="100" /> <br/> Miguel 脕ngel|
|---------------------------------------------------------------------------------------------------------------------|
| <div align="center"> <a href="https://github.com/supermavster"> <img src="https://cdn.iconscout.com/icon/free/png-256/github-153-675523.png" width="30" /> </a> <a href="https://www.linkedin.com/in/miguel-angel-torres-vargas/"> <img src="https://freeiconshop.com/wp-content/uploads/edd/linkedin-flat.png" width="30" /> </a>                                                     |


---
鈱笍 con 鉂わ笍 por [Supermavster](https://github.com/Supermavster) 馃槉
