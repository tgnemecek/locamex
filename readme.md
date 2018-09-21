# Sistema Locamex

Version: 1.3.6

## Information:

- To push to locamex-test use "git push test _BRANCH_:master";
- To push to locamex use "git push production master" (using a branch is possible, but should use master instead);

## Changelog:

### Version 1.3.6

- Readme: added correct indentation using double tabs;
- App: changed logos to better quality ones (and without clipping corners);

### Version 1.3.5

- Readme: Re-styled lists and removed double spaces;
- App:
    - Created and configured AWS S3;
    - Created and added a logo for the system (AppHeader and Login);
- Database/MaintenanceTable: Created a temporary table for printing purposes only (no functionality);


### Version 1.3.0

- Api:
    - All Apis now check for visible = true when finding in the db (except History);
    - All Apis now sort the database before sending, removed sorting in client;
    - Apis now check for visible = true on db.check() and throw error if item is not visible anymore;
- Contract:
    - ModularScreen: div is now scrolling;
    - Header: client now only shows Cancel button if contract is inactive;
- Readme: added double spaces as return;

### Version 1.2.5

- Database:
    - All tables are now alphabetically sorted by default using the description field as reference;
    - ContractsTable is the exception, being sorted in reverse order using the id field;

### Version 1.2.2

- RegisterContainers:
    - Layout now uses a table with a scroll and all modules now appear;
    - Fixed error that required modular containers to have a Serial;
- MongoDB: replaced old ids with new ObjectID generated strings;

### Version 1.2.1

- UserTable: temporary fix: if I'm updating the current user, the subscription won't update, instead it will unsubscribe.
The workaround is to check if the edited user is the one logged in and forcing the page to refresh;

### Version 1.2.0

- App: Restructured subscription to usersPub to fix AppHeader bug;
- Structure:
    - Restructured all collections, ids are now generated via ObjectID, with collections prefixes;
    - All tables now won't show the item's id, containers now have "Série" (serial);
    - Serial isn't unique yet, but it is created by the user and a required field;
- Contract/ProductSelection:
    - Now packs appear when selecting products to add to the contract;
    - Now packs can be correctly re-rented;
- AccessoriesTable: removed category column;

### Version 1.1.7

- AppHeader: fixed empty menu bug;

### Version 1.1.6

- App: fixed version number;
- App: fixed blank screen bug;

### Version 1.1.5

- AppHeader: Removed 'logged' functionality;
- App:
    - Blocked URL navigation for unauthorized users;
    - Fixed redirect bugs;
- Dashboard: created new scene;
- Structure: added Test to gitignore;
- Documents:
    - Now only visible contacts appear;
    - Title changed from 'Emitir Documentos' to 'Emitir Contrato';
    - Fixed only additional contacts appearing;
- Api/create-pdf: created differences for 'person' type of client;

### Version 1.1.0

- Structure: App is now a scene;
- App: added version number to bottom of page;
- AppHeader/MenuItem: fixed bug in constructor, allowedPages was getting set to undefined;
- Contract:
    - Removed 'min' for duration (but blocked 0 time);
    - Restitution is now being saved and printing for modular containers;
- Contract/Documents: Set as requirement for pdf export Legal Representative and Contact;
- Contract, Database/Contracts, Database/Billing: Total Value fixed and now considers duration;
- RegisterPacks: Added 'blank' default option for place;
- RegisterAccessories: Added 'blank' default option for place and category;
- RegisterAccessories, RegisterModules: set as default destination "available", and put "-" as last;
- Api/pages: fixed Services page being saved twice;
- Api/create-pdf:
    - Filename now set correctly and contains contract id;
    - Improved margins;
    - Added footer with contract id and page count;

## To Dos: (in order of priority)

### Urgent Priority:

- SearchBar is not looking for 'place' key, check options argument and allow for this option;
- RegisterContainers:
    - Add 'select all' toggle in modular header;
    - Put SearchBar out of scroll div;
- Tables: put them inside scroll div (SearchBar outside);

### High Priority:

- Add 'events' version of contract;
- Contract is not verifying CEP on activation;
- Create confirmation message for unmounting pack: "Desmontar pacote e retornar os componentes para o estoque?";
- Check for bugs and errors (bugsnag);
- Billing: make equalValue bool start as true;
- When trying to change page, warn of losing non-saved information;

### Medium Priority:

- Make RegisterContainers/Modular SearchBar to be outside the scrolling div;
- Make All lists sort by description, contracts sorts by id (or date);
- Test Billing with broken values and long remainders, possible to encounter NaN.
- Add server-side security for meteor methods (simple-schema, required fields);
- Fix table in RegisterPacks where it divides the table randomly;
- Create better security for unauthorized users (like checking for userId in meteor methods);
- Create Tag Database;
- Add PlacesTable in Database for future implementations;
- Change order of ContractsTable, recent first, adding date to the table;

### Low Priority: (future implementations)

- Insert Logo on Login scene;
- Add Settings scene for global changes (like the billing charges text);
- Add colors to tables for the different statuses (contracts and products);
- Add name field for users;
- Add the possibility for accessories to be "qualitative" allowing only quantity of 1;
- Make Documents save representatives in Contract;
- Fix trim() tool and apply to Register classes (currently empty spaces count as filled);

### Server security:

- Contract:
    - Block cancelling of contract if status !== from inactive;
- Everything that writes in database (meteor methods) should check for userId, and if the user has access to that functionality;



