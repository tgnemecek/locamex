# Sistema Locamex

Version: 1.1.0

## Information:

-To push to locamex-test use "git push test _BRANCH_:master"
-To push to locamex use "git push production master" (using a branch is possible, but should use master instead);

## Changelog:

### Version 1.1.0

-Structure: App is now a scene;
-App: added version number to bottom of page;
-AppHeader/MenuItem: fixed bug in constructor, allowedPages was getting set to undefined;
-Contract:
  -Removed 'min' for duration (but blocked 0 time);
  -Restitution is now being saved and printing for modular containers;
-Contract/Documents: Set as requirement for pdf export Legal Representative and Contact;
-Contract, Database/Contracts, Database/Billing: Total Value fixed and now considers duration;
-RegisterPacks: Added 'blank' default option for place;
-RegisterAccessories: Added 'blank' default option for place and category;
-RegisterAccessories, RegisterModules: set as default destination "available", and put "-" as last;
-Api/pages: fixed Services page being saved twice;
-Api/create-pdf:
  -Filename now set correctly and contains contract id;
  -Improved margins;
  -Added footer with contract id and page count;


## To Dos: (in order of priority)

### Urgent Priority:

-Online: review Users Collection for who can access Dashboard, Users and Services;
-Set correct categories, ask which and create the db;
-Billing: make equalValue bool start as true;
-Enable temporarily the field 'id' for fixed containers (create meteor method for handling this temporary case);
-Fix table in RegisterPacks where it divides the table randomly;
-Create confirmation message for unmounting pack: "Desmontar pacote e retornar os componentes para o estoque?";
-Create new scene: Dashboard that is accessed by any logged user, redirect from login;
-Contract, ProductSelection: when selecting containers, the packs should appear, create functionality;
-Add 'person' version of contract;
-Fix Contract/Documents: when type == 'person', it should read the info from outside client/contacts[];

### High Priority:

-Check for bugs and errors (bugsnag);
-Add server-side security for meteor methods (simple-schema, required fields);
-Block URL navigation for unauthorized users (current method stops links, but not direct URL);
-Add 'events' version of contract;
-When trying to change page, warn of losing non-saved information;

### Medium Priority:

-Create better security for unauthorized users (like checking for userId in meteor methods);
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
-Make Documents save representatives in Contract;





