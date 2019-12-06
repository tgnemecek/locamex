# Changelog:

## Version 2.3.5

-  Observations is now called Texts and is part of SceneHeader/Documents;
-  Proposals now have a customizable field inside observations called conditions;

## Version 2.3.4

-  Redone currency formatting to work on the server as well;
-  Fixed SceneItems/ManageItem changing items on-the-fly (before saving);

## Version 2.3.3

-  Pdf now gets descriptions from database, to avoid undefined product descriptions;

## Version 2.3.2

-  Added new flyer functionality, creating the pdf instead of uploading;

## Version 2.3.1

-  Added 'deny' to all mongo collections;

## Version 2.3.0

-  Fixed problem where contract pdf was showing the wrong expiryDate;

## Version 2.2.9

-  Fixed problem when saving Proposals/Contracts that printed previous version;

## Version 2.2.8

-  Added offset to Contracts;
-  Trying to add an existing series will show an error explaining;

## Version 2.2.7

-  Fixed error in Pdf;

## Version 2.2.6

-  Fixed generateTable in Pdf;

## Version 2.2.5

-  Fixed pdf bug;
-  Redone DatabaseStatus, allowing for easy state use on parent;

## Version 2.2.4

-  Added 'annotations' field on Billings;
-  Added option to exclude flyers from pdf (Proposal);
-  Improved phone format, adding a ' ' for cellphones after first digit;
-  Changed input/number functionality, allowing '' and '-' even with 'min' set;

## Version 2.2.3

-  Fixed Billing based on feedback;

## Version 2.2.2

-  Basic responsiveness added;

## Version 2.2.1

-  Added Billing functionality;
-  Added Agenda functionality;
-  Redone generateTable function in Pdf class;
-  Redone BillingSchedule in Contract;

## Version 2.2.0

-  FlyerUploader reformulated;
-  Fixed accessories and series image uploader;
-  Batch resaved accessories and series databases with new image urls;
-  Fixed HistoryTable bug;

## Version 2.1.9

-  ProposalsTable now allows search for client description;

## Version 2.1.8

-  Change in Contract text;
-  Partial implementation of aws for products:
    -  Series is complete, accessories/modules in progress;

## Version 2.1.7

-  Fixed error in proposal version display;

## Version 2.1.6

-  FlyerUploader now shows if the product has a flyer;

## Version 2.1.5

-  Added flyers functionality, including merging pdfs in proposal;
-  AWS integration redone without using Slingshot;
-  Create-pdf folder moved to helpers/Pdf class;
-  Pdf is now generated server-side;

## Version 2.1.4

-  Fixed address in proposal and contract pdf;

## Version 2.1.3

-  Fixed version number in pdf;

## Version 2.1.2

-  Fixed error in Contract generation;

## Version 2.1.1

-  Fixed how contracts are generated from proposals;

## Version 2.1.0

-  Proposals and Contracts have snapshots functionality;

## Version 2.0.8

-  Fixed pdf bug;

## Version 2.0.7

-  Proposal and Contract server error now print to console;

## Version 2.0.6

-  Added "clients" page to "sales" user-type;

## Version 2.0.5

-  Edited Proposal PDF text;

## Version 2.0.4

-  Fixed more pdf bugs;

## Version 2.0.3

-  Version number now written in history and shown in DatabaseHistory;
-  Fixed another generate-table bug in create pdf;
-  Fixed another version bug in proposal and contract;
-  Added Duplicate functionality in Proposal;

## Version 2.0.2

-  Changed SearchBar options for contracts, enabling search for client description and proposal number;
-  Print pdf: fixed canvas onscreen;
-  Fixed proposal texts;
-  Proposal pdf now shows user's name in signature;

## Version 2.0.1

-  Fix proposal pdf logo-loader throwing an error on second+ print;
-  Observations now show on proposal pdf;
-  Meteor calls for update in Proposal and Contract now check if any changes were made and if so, add +1 to version;
-  Fix generate-table in pdf erasing empty strings;
-  Create changelog.md;
-  Change texts in proposal pdf;

## Version 2.0.0

-  Added new module: Proposals, including pdf generation and transformation into Contract;
-  Created DatabaseStatus to show animation when Meteor methods are called in Contract, Shipping and Proposal;
-  Now its impossible to create a Contract without creating a Proposal first;

## Version 1.9.6

-  Fixed create-pdf/contract breaking email line, now if there are 2 phones, it breaks them instead;
-  Created Status component, to translate and paint status labels;

## Version 1.9.5

-  Because the RG field can be so unpredictable, no format is applied to it.
-  Create-pdf for contracts now exports both negociator phones if they exist;
-  Billing charges now have 'expiryDate', so it can be changed independently;

## Version 1.9.4

-  Fixed bug in RegisterSeries;

## Version 1.9.3

-  Created Help component;
-  Added Help component to Documents, explaining the contacts functionality;
-  Clients now can be registered with no contacts checking;
-  Now RegisterClients properly checks for just one: registryMU or registryES;
-  ErrorKeys now reset/change everytime the states are updated;

## Version 1.9.2

-  Swaped Documents & Billing buttons positions;
-  Removed Contract lock after activating it. Now you can change it anytime;
-  RG field now doesn't cut numbers after 12th digit, to allow international numbers;

## Version 1.9.1

-  Fixed Shipping/Receive not returning correctly;
-  RegisterAccessories now blocks place change if item is rented;
-  Fixed reseting INSS/ISS values when they were set to 0;
-  Fixed Calendar dates not changing in Billing;

## Version 1.9.0

-  Added create-excel functionality to save reports;
-  Contract/Documents now can only be opened if Billing is filled;
-  Special characters swaped for font-awesome icons, using a <Button/> component;
-  Cancel button in Contract:
    -  Only renders if contract is inactive AND if contract has id (is saved in db);
    -  Correctly updates database and client;

## Version 1.8.9

-  Fixed Create-pdf products bug;
-  Input/Currency and Digits now have perfect functionality, allowing blank and '-' values;
-  Forms now change border to normal when typing (after form error tinted it red);
-  Billing now correctly resets when adding/changing products;

## Version 1.8.8

-  Create-pdf:
    -  Now prints for person type;
    -  Now reads that the contract's timeUnit is in days and displays an 'events' version;
    -  Created page breaks for signatures/witnesses;
-  Contract now has timeUnit variable, inside dates;

## Version 1.8.7

-  Fixed select box in RegisterSeries, excluding modular containers;
-  Added title prop to ManageItem in Contract;
-  Fixed Observations in Contract and Shipping;
-  Users Database now display user type;
-  Now you can only access Shipping if contract is active;
-  Packs are temporarily disabled;
-  AppHeader now displays correctly for Contract and Shipping;
-  Fixed table layout in ShippingHistory;
-  Minor changes in pdf/contract;

## Version 1.8.6

-  Replaced FilterBar with an easier method of filtering, using Input and Array.filter in render;
-  Added another sort in Database/ContractsTable to ensure newly created contracts go on top;

## Version 1.8.5

-  Series now use serial as id, type now 'series' and serial field deleted;
-  Shipping scene complete, except for packs and stock rent/receive;
-  Users permissions now changed to use 'types', partial permissions now available;
-  Partial permissions created for Product and Contracts databases;

## Version 1.8.0

-  Contract restructured to work with new database logic (series, modules, containers);
-  Contract now has versions for each generated document;
-  ItemsList is now one single reusable component;
-  Contract now checks each billing for the correct final value before activation;
-  RegisterClients redone: removed 'code' input, now contacts with no name are erased;

## Version 1.7.6

-  Accessories now have the option to contain different types, that can be spread in different places (images not implemented yet);
-  StockVisualizer now checks for models and renders different children;
-  AccessoriesTable now updated to count inside models and outside (if doesn't have models);

## Version 1.7.5

-  Modules now allows multiple places for each module;

## Version 1.7.4

-  Now unauthorized users are automatically redirected out of a page, even if using the url address;
-  RegisterAccessories now allows multiple places for each Accessory;

## Version 1.7.3

-  Removed maintenance status from accessories;

## Version 1.7.2

-  New SearchBar and FilterBar;
-  Fixed bug by sending multiple images;

## Version 1.7.1

-  All RegisterX are now inside RegisterData parent;
-  All XTable are now inside DatabaseTable parent;
-  Fixed images not sending (server error);
-  Added Edit button to SeriesTable;

## Version 1.7.0

-  Containers now are fully restructured to be 'groups', tables fixed;
-  ImageVisualizer fixed for Containers, Accessories and Modules;

## Version 1.6.6

-  Changed MaintenanceTable to SeriesTable

## Version 1.6.5

-  Fixed StockVisualizer showing blank;

## Version 1.6.4

-  Fixed Containers now are 'groups' that contain the series inside;
-  ImageVisualizer disabled temporarily;

## Version 1.6.3

-  Restructured create-pdf api for flexible pdf assembly;
-  Implemented proposal number, discount and billingServices in Contract scene;

## Version 1.6.2

-  Fixed parsing error in Contract;

## Version 1.6.1

-  MaintenanceTable now shows all containers (not just status: maintenance);

## Version 1.6.0

-  Rollback from multiple places functionality (to be implemented later);
-  Temporary enabling of setting 'rented' from the fixed-container edit window (to be removed later);
-  Observations cell in MaintenanceTable now wraps for better visibility;
-  Fixed Database not rendering table header when no item is returned from publication;

## Version 1.5.2

- Added PlacesTable and places api functionality;
- Added HistoryTable and RegisterHistory;

## Version 1.5.0

- Implemented image visualizer/uploader using Amazon S3 for Modules, Containers and Accessories;
- Fixed weird structure in Database + child components;

## Version 1.4.1

- Api/Contracts: fixed server error;
- Api/create-pdf: fixed bug caused in tables (wrong columns number after removing id field);

## Version 1.4.0

- Contract/Billing: fixed totalValue multiplying services by duration;

## Version 1.3.9

- Contract, Database/Contracts: fixed totalValue that multiplied services for duration;
- Added warning in Documents component to let users know there's no support for pdf-export for person type of client;

## Version 1.3.8

- Readme:
    - Updated 1.3.7 changes;
    - Updated to-dos;
- RegisterClients, Contract: changed "Rua:" to "Endereço:";
- Dashboard: changed p tags to li;
- App: general CSS adjustments;
- Contract/ProductSelection: items are now inside scroll div, reorganized div blocks;

## Version 1.3.7

- Database: all tables now use withTracker and have consistent database tracking;
- SearchBar:
    - Added filter option, and including/excluding options;
    - Added Input component, fixed style;
- RegisterUsers:
    - Users now have two extra fields: firstName and lastName;
    - Table reorganized;
- MaintenanceTable: now sorted by place (not alphabetically, but in order of place index);
- Database: Tables now scroll;

## Version 1.3.6

- Readme: added correct indentation using double tabs;
- App: changed logos to better quality ones (and without clipping corners);

## Version 1.3.5

- Readme: Re-styled lists and removed double spaces;
- App:
    - Created and configured AWS S3;
    - Created and added a logo for the system (AppHeader and Login);
- Database/MaintenanceTable: Created a temporary table for printing purposes only (no functionality);


## Version 1.3.0

- Api:
    - All Apis now check for visible = true when finding in the db (except History);
    - All Apis now sort the database before sending, removed sorting in client;
    - Apis now check for visible = true on db.check() and throw error if item is not visible anymore;
- Contract:
    - ModularScreen: div is now scrolling;
    - Header: client now only shows Cancel button if contract is inactive;
- Readme: added double spaces as return;

## Version 1.2.5

- Database:
    - All tables are now alphabetically sorted by default using the description field as reference;
    - ContractsTable is the exception, being sorted in reverse order using the id field;

## Version 1.2.2

- RegisterContainers:
    - Layout now uses a table with a scroll and all modules now appear;
    - Fixed error that required modular containers to have a Serial;
- MongoDB: replaced old ids with new ObjectID generated strings;

## Version 1.2.1

- UserTable: temporary fix: if I'm updating the current user, the subscription won't update, instead it will unsubscribe.
The workaround is to check if the edited user is the one logged in and forcing the page to refresh;

## Version 1.2.0

- App: Restructured subscription to usersPub to fix AppHeader bug;
- Structure:
    - Restructured all collections, ids are now generated via ObjectID, with collections prefixes;
    - All tables now won't show the item's id, containers now have "Série" (serial);
    - Serial isn't unique yet, but it is created by the user and a required field;
- Contract/ProductSelection:
    - Now packs appear when selecting products to add to the contract;
    - Now packs can be correctly re-rented;
- AccessoriesTable: removed category column;

## Version 1.1.7

- AppHeader: fixed empty menu bug;

## Version 1.1.6

- App: fixed version number;
- App: fixed blank screen bug;

## Version 1.1.5

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

## Version 1.1.0

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

## Urgent Priority:

- CONTRACT-PDF IS NOT READY FOR PERSON TYPE:
    - Fix when using client of person type with NO additional contacts (it is currently checking it wrong);

## High Priority:

- Add 'events' version of contract;
- Contract is not verifying CEP on activation;
- When something gets deleted, the system must check all databases to see if the item is rented, or the place has things in it;

## Medium Priority:

- Add server-side security for meteor methods (simple-schema, required fields);
- Create better security for unauthorized users (like checking for userId in meteor methods);

## Low Priority: (future implementations)

- Add Settings scene for global changes (like the billing charges text);
- Add colors to tables for the different statuses (contracts and products);
- Make the app responsive and mobile friendly;
- Make the app compatible to other browsers;
- RegisterContainers:
    - Add 'select all' toggle in modular header;
    - Put SearchBar out of scroll div;



