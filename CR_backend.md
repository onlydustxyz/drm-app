# CR backend sur l'utilisation de l'AI

### Context:
- from scratch
- j'ai codé 1,5 jours (jeudi soir, vendredi et vendredi soir) et je pense avoir codé l'équivalent de 3-4 jours de travail en java à qualités égale
- en typescript (pas touché depuis 5-6 ans) sur des frameworks que je ne connais pas
- un peu de front (pas mon expertise)
- avec cursor / vscode que je n'ai jamais utilisé et qui m'a bien ralenti au début

## Authentification

- un simple prompt pour l'authentification Supabase génère une page de login et le code pour s'authentifier
- ce prompt sans la cursor rule de Supabase ne fonctionne pas, même en itérant
- avec la cursor rule de Supabase, en un prompt ça fonctionne : https://supabase.com/docs/guides/getting-started/ai-prompts/nextjs-supabase-auth
- je n'arrive pas facilement à lui faire gérer les redirections sur la page de login / logout, j'ai l'impression qu'il se perd entre l'authentification frontend client et backend serveur => je ne maîtrise pas encore les bonnes pratiques de prompts et la méthode
- en deux prompts, j'ai pu modifier toutes les routes API pour récupérer le user authentifié (Cf. marketplace-api):
  - ajoute un `authenticationService` dans les routes API avec une méthode `getAuthenticatedUser()` mocké 
  - retirer le mock pour implémenter un service qui utilise Supabase
  - j'avais essayé en un prompt, mais il me génèrait du code trop couplé à Supabase qui m'empécher de mocker l'utilisateur connecté dans les tests d'intégrations

## Architecture du code
On a perdu beaucoup de temps sur cette partie:
- on aurait du prendre une entité "REST" pour coder le CRUD du front jusqu'à la DB pour architecturer le code une première fois :
- ensuite cursor avec Claude3.7-thinking est très fort pour reproduire la même architecture sur les autres features
- pertes de temps: 
  - on a commencé par faire du front mocké avec Paco et on a dû repasser dessus mais en même temps qu'on repassé dessus, on a mélanger plein de sujets car je n'étais pas au clair sur la méthode de travail => on a mélangé de l'architecture de code, du refacto de code et des choix techniques de lib
  - j'ai beaucoup itéré sur l'architecture du code car je ne savais pas quel ratio qualité était pertinent pour un projet TS en next.js avec Cursor et Claude

✅ Comme discuté avec la team : setup un template js (ex: [symeo-js-template](https://github.com/symeo-io/symeo-js-template) pour partir avec une architecture OD et utiliser des cursor rules OD

## Bonnes pratiques de dev
C'est le point sur lequel j'ai été le plus bluffé avec Claude3.7-thinking et Cursor:
- est capable de suivre une architecture de code type clean archi (j'ai pas testé archi hex) sans générer un boilerplate overkill
- génère automatiquement les bonnes pratiques courantes sans qu'on lui demande : gestion des erreurs, checker les nulls, etc
- est capable de mocké puis de retirer les mocks avec une pseudo injection de dépendance (spécifique à TS ici)
- est capable d'ajouter automatique des tests d'intégration **si des premiers tests ont été setup**
- est capable de générer des mocks de test trés pertinents

## Expertise technique

Certains points nécessite de faire plusieurs prompts très précis (je pense que je vais devoir faire ça pour fixer l'authentification). En effet, un point intéressant: je n'ai pas réussi facilement à lui faire faire le `__tests___/setup.ts` de manière à démarrer Postgres avec test-container et injecter la configuration dynamique du container dans le code de production du serveur.

### Explications
#### Code de base

Dans `lib/drizzle/init.ts`, le client Drizzle Postgres est initialisé de manière statique :
```
export const db = drizzle(client);
```
et le setup des tests d'intégration l'importe pour run les ITs :
```
import { db } from "@/lib/drizzle";
import { PostgreSqlContainer, StartedPostgreSqlContainer } from "@testcontainers/postgresql";

...
beforeAll(async () => {
	// Start PostgreSQL container
	container = new PostgreSqlContainer()
		.withDatabase("test_db")
		.withUsername("test_user")
		.withPassword("test_password");

	startedContainer = await container.start();

	// Set environment variables for database connection
	process.env.DATABASE_URL = startedContainer.getConnectionUri();

	// Wait for and verify database connection
	try {
		// Perform a query to ensure the database is ready and migrations have applied
		const result = await db.execute(sql`SELECT to_regclass('contributor_sublists')`);
		console.log("Database initialized and ready for testing");

		// If we need to add any additional setup for tests
		// such as clearing tables, it can be done here
		await db.execute(sql`TRUNCATE contributor_sublists CASCADE`);
	} catch (error) {
		console.error("Error verifying database connection:", error);
		throw error;
	}
});
```

Ce code ne peut pas fonctionner car test-container démarre les containers avec des ports aléatoires pour éviter les effets de bords d'overlap de data / schema sur une même DB.

Prompts:
1. ❌ Le plus abstrait possible : `Testcontainer is starting a container with a dynamic port for every container, fix that.`
2. ❌ Moins abstrait : `Modify the test setup and the index.js to be able to pass the dynamic port of the postgres container to the Drizzle client`
3. ❌ Moins abstrait : `Use dependency injection or pass a dynamic configuration` ou `use a factory pattern to provide a drizzle client that could be override to support dynamic configuration`
4. ❌ Moins abstrait dans le context du fichier `index.ts` : `use a factory pattern to provide a drizzle client that could be override to support dynamic configuration`
5. ✅ En plusieurs prompts : 
   6. Dans le fichier `index.ts` : `Modify the code to implement a factory which contains the drizzle client. This class is a singleton. This class provide a getClient method to return the client. It also provides a setClient method to override the client. Refactor all the code using the old client.`
   7. Dans le fichier `setup.ts` : `Use dbFactory to set the dynamic testing database config and use the factory in the integration tests`

Résultat nickel :

```
class DatabaseClientFactory {
	private static instance: DatabaseClientFactory;
	private client: PostgresJsDatabase | null = null;

	private constructor() {
		// Private constructor to enforce singleton pattern
	}

	public static getInstance(): DatabaseClientFactory {
		if (!DatabaseClientFactory.instance) {
			DatabaseClientFactory.instance = new DatabaseClientFactory();
		}
		return DatabaseClientFactory.instance;
	}

	public getClient(): PostgresJsDatabase {
		if (!this.client) {
			// Ensure database URL is available
			if (!process.env.DATABASE_URL) {
				throw new Error("DATABASE_URL is not defined in .env.local");
			}

			// Create a postgres.js client
			const postgresClient = postgres(process.env.DATABASE_URL);
			
			// Create a drizzle client
			this.client = drizzle(postgresClient);
		}
		
		return this.client;
	}

	public setClient(databaseUrl: string): PostgresJsDatabase {
		// Create a postgres.js client with the provided URL
		const postgresClient = postgres(databaseUrl);
		
		// Create and set the drizzle client
		this.client = drizzle(postgresClient);
		
		return this.client;
	}
}

// Export the factory instance
export const dbFactory = DatabaseClientFactory.getInstance();
```

et

```
	startedContainer = await container.start();
	// Set timeout for container startup
	jest.setTimeout(5000);

	// Set up database client with container URL
	const databaseUrl = startedContainer.getConnectionUri();
	dbFactory.setClient(databaseUrl);
```

## Optimisation du flow
- méthodologie de travail à améliorer: setup toute l'archi du projet et ensuite se répartir les tâches sur les différentes features
- maitriser VsCode avec les bonnes extensions pour supporter le language, le debug, le run en local, voir le thème de couleur pour s'y retrouver
- partir d'un template de code définie dans un AI agent et utiliser des cursor rules OnlyDust

On peut imaginer:
- un AI agent "designer" qui permet de faire l'UI/UX mocké
- un AI agent "frontend" qui permet de cleaner le front et de mettre en place nos choix technologiques (authentification, react-query, etc))
- un AI agent "backend" qui permet de dev le backend
- un AI agent "QA" qui permet de faire de la QA?
- des règles cursor associées
- des templates pour ne plus boostrapper de manière différente
=> Paco part d'un template et utilise l'agent "designer", on récupère les features mockées et on utilise les agents "frontend" et "backend", voir Paco les utilise et fait toute la feature dans la mesure de la complexité de la feature.

Mes suppositions:
- l'uniformisation du code et des pratiques augmentent la pertinence des résultats de l'AI => on a intérêt à standardiser un maximum comme on a pu le faire jusqu'à maintenant
- la puissance des AI agents et des rules sont clefs
- un bon niveau de qualité est primordial pour produire le minimum de code bien rangé/organisé => des bonnes pratiques de prompts / rules pour gérer ça

## Conclusion

Enormes gains de temps:
- Le point le plus important pour moi est que le setup Cursor + Claude3.7-thinking est très fort pour reproduire une architecture de code de qualité avec des bonnes pratiques si elle ont déjà été initialisées dans le projet (ils lisent l'architecture des répertoires et du code avec des `tree` et `grep`)
- très fort pour toutes les features classiques sur lesquelles on a très peu de valeur: gestion des erreurs, gérer des sorts/filters du front jusqu'à la DB, faire du mapping, etc

Très peu de pertes de temps:
- plein de petites/moyennes optimisations comme décrit précédemment
- l'attente entre les prompts 🤷‍♂️
- il faut quand même faire attention au code qu'il génère, Claude3.7 aime bien faire de l'overengineering qui peut-être facilement évité en faisant des reviews systématiques

On peut aller 2-3 fois plus vite dans le context qui était le miens avec un niveau de qualité quasiment égale. A voir si peut aller encore plus vite avec les différentes optimisations et si ça marche aussi sur des grosses codebase avec de la logique complexe type indexer ou accounting. Ce n'est pas magique, avec un bon flow de travail, une bonne méthode de pompt (comment agencer uen suite de prompt en fonction de la complexité de la feature et comment écrire les prompts) et un bon setup (IDE + template + rules + agents), on peut vraiment aller beaucoup plus vite.



 
