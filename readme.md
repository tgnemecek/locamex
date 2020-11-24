# Locamex System

Version: 3.0.3

## About:

This is a complete web-app solution made specifically for a shipping container rental company (Locamex). It features functionality not available in other similar software, like the ability to have package-like products that you assemble using parts or modules, which is the base of what the company does.
It features pdf printing for contract and proposals, calendar displays of billing dates, stock managing, client registration and file uploads, all with custom access for different types of user.

## Technology:

This web-app was developed in Meteor using React and SASS. Other technologies were used such as pdfmake for pdf generation, Amazon Web Services SDK for file uploads (S3) and moment.js for time calculations and formatting.

## Main Information:

- To push to locamex-test use "git push test _BRANCH_:master";
- To push to locamex use "git push production master" (using a branch is possible, but should use master instead);
- To test run: "npm run start"

## Author:

Made by Thiago Nemecek.

## License:

Copyright 2019 Thiago Nemecek. All rights reserved.

## Changes:

[Change Log](changelog.md)

For every new version, version numbers must be changed at:

- readme.md
- changelog.md
- package.json

Commits do not have changes information, they are instead stored in the change log.
