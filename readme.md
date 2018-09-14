# Sistema Locamex

Version: 1.0

## Information:

-To push to locamex-test use "git push test _BRANCH_:master"
-To push to locamex use "git push production master" (using a branch is possible, but should use master instead);

## To Dos: (in order of priority)

### High Priority:

-Add 'person' version of contract;
-Check for bugs and errors (bugsnag);
-Add server-side security for meteor methods (simple-schema, required fields);
-Block URL navigation for unauthorized users (current method stops links, but not direct URL);
-Add 'events' version of contract;
-When trying to change page, warn of losing non-saved information;

### Medium Priority:

-Fix MenuItem inconsistencies inside AppHeader (sometimes they don't appear);
-Fix trim() tool and apply to Register classes (currently empty spaces count as filled);
-Add CategoryTable and PlacesTable in Database for future implementations;
-Change order of ContractsTable, recent first, adding date to the table;

### Low Priority: (future implementations)

-Insert Logo on Login scene;
-Add Settings scene for global changes (like the billing charges text);
-Remove display of "Código" from tables (especially UsersTable);
-Add colors to tables for the different statuses (contracts and products);
-Add name field for users;
-Add the possibility for accessories to be "qualitative" allowing only quantity of 1;





