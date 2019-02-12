# Sistema Locamex

Version: 1.6.4

## Information:

- To push to locamex-test use "git push test _BRANCH_:master";
- To push to locamex use "git push production master" (using a branch is possible, but should use master instead);

## Changelog:

### Version 1.6.4

-  Fixed Containers now are 'groups' that contain the series inside;
-  ImageVisualizer disabled temporarily;

### Version 1.6.3

-  Restructured create-pdf api for flexible pdf assembly;
-  Implemented proposal number, discount and billingServices in Contract scene;

### Version 1.6.2

-  Fixed parsing error in Contract;

### Version 1.6.1

-  MaintenanceTable now shows all containers (not just status: maintenance);

### Version 1.6.0

-  Rollback from multiple places functionality (to be implemented later);
-  Temporary enabling of setting 'rented' from the fixed-container edit window (to be removed later);
-  Observations cell in MaintenanceTable now wraps for better visibility;
-  Fixed Database not rendering table header when no item is returned from publication;

### Version 1.5.2

- Added PlacesTable and places api functionality;
- Added HistoryTable and RegisterHistory;

### Version 1.5.0

- Implemented image visualizer/uploader using Amazon S3 for Modules, Containers and Accessories;
- Fixed weird structure in Database + child components;

### Version 1.4.1

- Api/Contracts: fixed server error;
- Api/create-pdf: fixed bug caused in tables (wrong columns number after removing id field);

### Version 1.4.0

- Contract/Billing: fixed totalValue multiplying services by duration;

### Version 1.3.9

- Contract, Database/Contracts: fixed totalValue that multiplied services for duration;
- Added warning in Documents component to let users know there's no support for pdf-export for person type of client;

### Version 1.3.8

- Readme:
    - Updated 1.3.7 changes;
    - Updated to-dos;
- RegisterClients, Contract: changed "Rua:" to "Endereço:";
- Dashboard: changed p tags to li;
- App: general CSS adjustments;
- Contract/ProductSelection: items are now inside scroll div, reorganized div blocks;

### Version 1.3.7

- Database: all tables now use withTracker and have consistent database tracking;
- SearchBar:
    - Added filter option, and including/excluding options;
    - Added Input component, fixed style;
- RegisterUsers:
    - Users now have two extra fields: firstName and lastName;
    - Table reorganized;
- MaintenanceTable: now sorted by place (not alphabetically, but in order of place index);
- Database: Tables now scroll;

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

- Implement images;
- CONTRACT-PDF IS NOT READY FOR PERSON TYPE:
    - Contract should get and SAVE the client info in some way (but update when the user changes the registry of it);
    - Currently it is only saving the ID, which is good for updating, but after saving it is bad because the info will update later;
    - Fix when using client of person type with NO additional contacts (it is currently checking it wrong);
    - Find a way that representatives are saved in some way (because if the user decides to print a contract later they have to remember who were the reps);

### High Priority:

- Put AWS keys in settings.json (safer), and remove from api/images;
- RegisterContainers:
    - Add 'select all' toggle in modular header;
    - Put SearchBar out of scroll div;
- Remove id fields from view;
- Replace all trackers with withTracker;
- Add 'events' version of contract;
- Contract is not verifying CEP on activation;
- Create confirmation message for unmounting pack: "Desmontar pacote e retornar os componentes para o estoque?";
- Billing: make equalValue bool start as true;
- When trying to change page, warn of losing non-saved information;

### Medium Priority:

- Make RegisterContainers/Modular SearchBar to be outside the scrolling div;
- Test Billing with broken values and long remainders, possible to encounter NaN.
- Add server-side security for meteor methods (simple-schema, required fields);
- Fix table in RegisterPacks where it divides the table randomly;
- Create better security for unauthorized users (like checking for userId in meteor methods);
- Create Tag Database;
- Add PlacesTable in Database for future implementations;

### Low Priority: (future implementations)

- Add Settings scene for global changes (like the billing charges text);
- Add colors to tables for the different statuses (contracts and products);
- Add the possibility for accessories to be "qualitative" allowing only quantity of 1;
- Make Documents save representatives in Contract;
- Fix trim() tool and apply to Register classes (currently empty spaces count as filled);
- Make the app responsive and mobile friendly;
- Make the app compatible to other browsers;

### Server security:

- Contract:
    - Block cancelling of contract if status !== from inactive;
- Everything that writes in database (meteor methods) should check for userId, and if the user has access to that functionality;



