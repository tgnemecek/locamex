# To-dos:

## High Priority:

- Add server-side security for meteor methods (simple-schema, required fields);
- Create better security for unauthorized users (like checking for userId in meteor methods);

## Medium Priority:

- When something gets deleted, the system must check all databases to see if the item is rented, or the place has things in it;
- Make Proposals and Contracts fully denormalized (an outdated copy that reflects old information);
- Make functionality to allow users to reset own password;

## Low Priority: (future implementations)

- Add Settings scene for global changes (like the billing charges text);
- Add colors to tables for the different statuses (contracts and products);
- Make the app responsive and mobile friendly;
- Make the app compatible to older browsers;