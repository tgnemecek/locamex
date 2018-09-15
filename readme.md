# Sistema Locamex

Version: 1.2.1

## Information:

-To push to locamex-test use "git push test _BRANCH_:master"
-To push to locamex use "git push production master" (using a branch is possible, but should use master instead);

## Changelog:

### Version 1.2.1



### Version 1.2.0

-App: Restructured subscription to usersPub to fix AppHeader bug;
-Structure:
  -Restructured all collections, ids are now generated via ObjectID, with collections prefixes;
  -All tables now won't show the item's id, containers now have "Série" (serial);
  -Serial isn't unique yet, but it is created by the user and a required field;
-Contract/ProductSelection:
  -Now packs appear when selecting products to add to the contract;
  -Now packs can be correctly re-rented;
-AccessoriesTable: removed category column;

### Version 1.1.7

-AppHeader: fixed empty menu bug;

### Version 1.1.6

-App: fixed version number;
-App: fixed blank screen bug;

### Version 1.1.5

-AppHeader: Removed 'logged' functionality;
-App:
  -Blocked URL navigation for unauthorized users;
  -Fixed redirect bugs;
-Dashboard: created new scene;
-Structure: added Test to gitignore;
-Documents:
  -Now only visible contacts appear;
  -Title changed from 'Emitir Documentos' to 'Emitir Contrato';
  -Fixed only additional contacts appearing;
-Api/create-pdf: created differences for 'person' type of client;

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

-Check if cancelling the contract returns the items (should be able to cancel an active one? ask);
-Mongodb uses indexes and only shows the first 20 documents, see how to work with this!

### High Priority:

-Add 'events' version of contract;
-Contract is not verifying CEP on activation;
-Create confirmation message for unmounting pack: "Desmontar pacote e retornar os componentes para o estoque?";
-Check for bugs and errors (bugsnag);
-Billing: make equalValue bool start as true;
-When trying to change page, warn of losing non-saved information;

### Medium Priority:

-Pages are stored insinde 'profile' key in user object. The profile key is not safe and can be edited, fix this.
  The problem is that apparently publishing Meteor.users.find() won't cause Tracker.autorun to react (old way).
-Test Billing with broken values and long remainders, possible to encounter NaN.
-Add server-side security for meteor methods (simple-schema, required fields);
-Fix table in RegisterPacks where it divides the table randomly;
-Create better security for unauthorized users (like checking for userId in meteor methods);
-Create Tag Database;
-Add PlacesTable in Database for future implementations;
-Change order of ContractsTable, recent first, adding date to the table;

### Low Priority: (future implementations)

-Insert Logo on Login scene;
-Add Settings scene for global changes (like the billing charges text);
-Add colors to tables for the different statuses (contracts and products);
-Add name field for users;
-Add the possibility for accessories to be "qualitative" allowing only quantity of 1;
-Make Documents save representatives in Contract;
-Fix trim() tool and apply to Register classes (currently empty spaces count as filled);





