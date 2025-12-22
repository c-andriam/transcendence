---
title: 'Overview on Prisma Schema'
sidebar_label: 'Overview'
metaTitle: 'Prisma Schema Overview'
metaDescription: 'The Prisma schema is the main method of configuration when using Prisma. It is typically called schema.prisma and contains your database connection and data model.'
---

The Prisma Schema (or _schema_ for short) is the main method of configuration for your Prisma ORM setup. It consists of the following parts:

- [**Data sources**](/orm/prisma-schema/overview/data-sources): Specify the details of the data sources Prisma ORM should connect to (e.g. a PostgreSQL database)
- [**Generators**](/orm/prisma-schema/overview/generators): Specifies what clients should be generated based on the data model (e.g. Prisma Client)
- [**Data model definition**](/orm/prisma-schema/data-model): Specifies your application [models](/orm/prisma-schema/data-model/models#defining-models) (the shape of the data per data source) and their [relations](/orm/prisma-schema/data-model/relations)

It is typically a single file called `schema.prisma` (or multiple files with `.prisma` file extension) that is stored in a defined but customizable [location](/orm/prisma-schema/overview/location). You can also [organize your Prisma schema in multiple files](/orm/prisma-schema/overview/location#multi-file-prisma-schema) if you prefer that.

See the [Prisma schema API reference](/orm/reference/prisma-schema-reference) <span class="api"></span> for detailed information about each section of the schema.

Whenever a `prisma` command is invoked, the CLI typically reads some information from the schema, e.g.:

- `prisma generate`: Reads _all_ above mentioned information from the Prisma schema to generate the correct data source client code (e.g. Prisma Client).
- `prisma migrate dev`: Reads the data sources and data model definition to create a new migration.

You can also [use environment variables](#accessing-environment-variables-from-the-schema) inside the schema to provide configuration options when a CLI command is invoked.

## Example

The following is an example of a Prisma Schema that specifies:

- A data source (PostgreSQL or MongoDB)
- A generator (Prisma Client)
- A data model definition with two models (with one relation) and one `enum`
- Several [native data type attributes](/orm/prisma-schema/data-model/models#native-types-mapping) (`@db.VarChar(255)`, `@db.ObjectId`)

<TabbedContent code>
<TabItem value="Relational databases">

```prisma
datasource db {
  provider = "postgresql"
}

generator client {
  provider = "prisma-client"
  output   = "./generated"
}

model User {
  id        Int      @id @default(autoincrement())
  createdAt DateTime @default(now())
  email     String   @unique
  name      String?
  role      Role     @default(USER)
  posts     Post[]
}

model Post {
  id        Int      @id @default(autoincrement())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  published Boolean  @default(false)
  title     String   @db.VarChar(255)
  author    User?    @relation(fields: [authorId], references: [id])
  authorId  Int?
}

enum Role {
  USER
  ADMIN
}
```

</TabItem>
<TabItem value="MongoDB">

```prisma
datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  createdAt DateTime @default(now())
  email     String   @unique
  name      String?
  role      Role     @default(USER)
  posts     Post[]
}

model Post {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  published Boolean  @default(false)
  title     String
  author    User?    @relation(fields: [authorId], references: [id])
  authorId  String   @db.ObjectId
}

enum Role {
  USER
  ADMIN
}
```

</TabItem>
</TabbedContent>

## Syntax

Prisma Schema files are written in Prisma Schema Language (PSL). See the [data sources](/orm/prisma-schema/overview/data-sources), [generators](/orm/prisma-schema/overview/generators), [data model definition](/orm/prisma-schema/data-model) and of course [Prisma Schema API reference](/orm/reference/prisma-schema-reference) pages for details and examples.

### VS Code

Syntax highlighting for PSL is available via a [VS Code extension](https://marketplace.visualstudio.com/items?itemName=Prisma.prisma) (which also lets you auto-format the contents of your Prisma schema and indicates syntax errors with red squiggly lines). Learn more about [setting up Prisma ORM in your editor](/orm/more/development-environment/editor-setup).

### GitHub

PSL code snippets on GitHub can be rendered with syntax highlighting as well by using the `.prisma` file extension or annotating fenced code blocks in Markdown with `prisma`:

````
```prisma
model User {
  id        Int      @id @default(autoincrement())
  createdAt DateTime @default(now())
  email     String   @unique
  name      String?
}
```
````

## Accessing environment variables from the schema

You can use environment variables to provide configuration options when a CLI command is invoked, or a Prisma Client query is run.

Hardcoding URLs directly in your schema is possible but is discouraged because it poses a security risk. Using environment variables in the schema allows you to **keep secrets out of the schema** which in turn **improves the portability of the schema** by allowing you to use it in different environments.

Environment variables can be accessed using the `env()` function:

```prisma
datasource db {
  provider = "postgresql"
}
```

You can use the `env()` function in the following places:

- A datasource url
- Generator binary targets

See [Environment variables](/orm/more/development-environment/environment-variables) for more information about how to use an `.env` file during development.

## Comments

There are three types of comments that are supported in Prisma Schema Language:

- `// comment`: This comment is for the reader's clarity and is not present in the abstract syntax tree (AST) of the schema.
- `/// comment`: These comments will show up in the abstract syntax tree (AST) of the schema as descriptions to AST nodes. Tools can then use these comments to provide additional information. All comments are attached to the next available node - [free-floating comments](https://github.com/prisma/prisma/issues/3544) are not supported and are not included in the AST.
- `/* block comment */`: These comments will show up in the abstract syntax tree, similarly to `///` comments.

Here are some different examples:

```prisma
/// This comment will get attached to the `User` node in the AST
model User {
  /// This comment will get attached to the `id` node in the AST
  id     Int   @default(autoincrement())
  // This comment is just for you
  weight Float /// This comment gets attached to the `weight` node
}

// This comment is just for you. It will not
// show up in the AST.

/// This comment will get attached to the
/// Customer node.
model Customer {
  /**
   * ...and so will this comment
   */
}
```

## Auto formatting

Prisma ORM supports formatting `.prisma` files automatically. There are two ways to format `.prisma` files:

- Run the [`prisma format`](/orm/reference/prisma-cli-reference#format) <span class="api"></span> command.
- Install the [Prisma VS Code extension](https://marketplace.visualstudio.com/items?itemName=Prisma.prisma) and invoke the [VS Code format action](https://code.visualstudio.com/docs/editor/codebasics#_formatting) - manually or on save.

There are no configuration options - [formatting rules](#formatting-rules) are fixed (similar to Golang's `gofmt` but unlike Javascript's `prettier`):

### Formatting rules

#### Configuration blocks are aligned by their `=` sign

```
block _ {
  key      = "value"
  key2     = 1
  long_key = true
}
```

#### Field definitions are aligned into columns separated by 2 or more spaces

```
block _ {
  id          String       @id
  first_name  LongNumeric  @default
}
```

#### Empty lines resets block alignment and formatting rules

```
block _ {
  key   = "value"
  key2  = 1
  key10 = true

  long_key   = true
  long_key_2 = true
}
```

```
block _ {
  id  String  @id
              @default

  first_name  LongNumeric  @default
}
```

#### Multiline field attributes are properly aligned with the rest of the field attributes

```
block _ {
  id          String       @id
                           @default
  first_name  LongNumeric  @default
}
```

#### Block attributes are sorted to the end of the block

```
block _ {
  key   = "value"

  @@attribute
}
```

---

title: 'Quickstart with Prisma ORM and Prisma Postgres'
'
---

import Prerequisites from '../../_components/_prerequisites.mdx'
import CreateProject from '../../_components/_create-project.mdx'
import ExploreData from '../../_components/_explore-data.mdx'
import NextSteps from '../../_components/_next-steps.mdx'

[Prisma Postgres](/postgres) is a fully managed PostgreSQL database that scales to zero and integrates smoothly with both Prisma ORM and Prisma Studio. In this guide, you will learn how to set up a new TypeScript project from scratch, connect it to Prisma Postgres using Prisma ORM, and generate a Prisma Client for easy, type-safe access to your database.

## Prerequisites

<Prerequisites />

## 1. Create a new project

<CreateProject />

## 2. Install required dependencies

Install the packages needed for this quickstart:

```terminal
npm install prisma @types/node @types/pg --save-dev 
npm install @prisma/client @prisma/adapter-pg pg dotenv
```

Here's what each package does:

- **`prisma`** - The Prisma CLI for running commands like `prisma init`, `prisma migrate`, and `prisma generate`
- **`@prisma/client`** - The Prisma Client library for querying your database
- **`@prisma/adapter-pg`** - The [`node-postgres` driver adapter](/orm/overview/databases/postgresql#using-the-node-postgres-driver) that connects Prisma Client to your database
- **`pg`** - The node-postgres database driver
- **`@types/pg`** - TypeScript type definitions for node-postgres
- **`dotenv`** - Loads environment variables from your `.env` file

## 3. Configure ESM support

Update `tsconfig.json` for ESM compatibility:

```json file=tsconfig.json
{
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "node",
    "target": "ES2023",
    "strict": true,
    "esModuleInterop": true,
    "ignoreDeprecations": "6.0"
  }
}
```

Update `package.json` to enable ESM:

```json file=package.json
{
  // add-start
  "type": "module",
  // add-end
}
```

## 4. Initialize Prisma ORM and create a Prisma Postgres database

You can now invoke the Prisma CLI by prefixing it with `npx`:

```terminal
npx prisma
```

Next, set up your Prisma ORM project by creating your [Prisma Schema](/orm/prisma-schema) file with the following command:

```terminal
npx prisma init --db --output ../generated/prisma
```

:::info

You'll need to answer a few questions while setting up your Prisma Postgres database. Select the region closest to your location and a memorable name for your database.

:::

This command does a few things:

- Creates a `prisma/` directory with a `schema.prisma` file containing your database connection and schema models
- Creates a new Prisma Postgres database (when using `--db` flag)
- Creates a `.env` file in the root directory for environment variables
- Creates a `prisma.config.ts` file for Prisma configuration

The generated `prisma.config.ts` file looks like this:

```typescript file=prisma.config.ts
import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
})
```

The generated schema uses [the ESM-first `prisma-client` generator](/orm/prisma-schema/overview/generators#prisma-client) with a custom output path:

```prisma file=prisma/schema.prisma
generator client {
  provider = "prisma-client"
  output   = "../generated/prisma"
}

datasource db {
  provider = "postgresql"
}
```

## 5. Define your data model

Open `prisma/schema.prisma` and add the following models:

```prisma file=prisma/schema.prisma
generator client {
  provider = "prisma-client"
  output   = "../generated/prisma"
}

datasource db {
  provider = "postgresql"
}

//add-start
model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
  posts Post[]
}

model Post {
  id        Int     @id @default(autoincrement())
  title     String
  content   String?
  published Boolean @default(false)
  author    User    @relation(fields: [authorId], references: [id])
  authorId  Int
}
//add-end
```

## 6. Create and apply your first migration

Create your first migration to set up the database tables:

```terminal
npx prisma migrate dev --name init
```

This command creates the database tables based on your schema.

Now run the following command to generate the Prisma Client:

```terminal
npx prisma generate
```

## 7. Instantiate Prisma Client

Now that you have all the dependencies installed, you can instantiate Prisma Client. You need to pass an instance of Prisma ORM's driver adapter to the `PrismaClient` constructor:

```typescript file=lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma/client'

const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

export { prisma }
```

:::tip

If you need to query your database via HTTP from an edge runtime (Cloudflare Workers, Vercel Edge Functions, etc.), use the [Prisma Postgres serverless driver](/postgres/database/serverless-driver#use-with-prisma-orm).

:::

## 8. Write your first query

Create a `script.ts` file to test your setup:

```typescript file=script.ts
import { prisma } from './lib/prisma'

async function main() {
  // Create a new user with a post
  const user = await prisma.user.create({
    data: {
      name: 'Alice',
      email: 'alice@prisma.io',
      posts: {
        create: {
          title: 'Hello World',
          content: 'This is my first post!',
          published: true,
        },
      },
    },
    include: {
      posts: true,
    },
  })
  console.log('Created user:', user)

  // Fetch all users with their posts
  const allUsers = await prisma.user.findMany({
    include: {
      posts: true,
    },
  })
  console.log('All users:', JSON.stringify(allUsers, null, 2))
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
```

Run the script:

```terminal
npx tsx script.ts
```

You should see the created user and all users printed to the console!

## 9. Explore your data with Prisma Studio

<ExploreData />

## Next steps

<NextSteps />

## More info

- [Prisma Postgres documentation](/postgres)
- [Prisma Config reference](/orm/reference/prisma-config-reference)
- [Database connection management](/orm/prisma-client/setup-and-configuration/databases-connections)
- [Cache your queries](/postgres/database/caching#setting-up-caching-in-prisma-postgres)
