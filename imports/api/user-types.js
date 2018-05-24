import { Mongo } from 'meteor/mongo';

export const UserTypes = new Mongo.Collection('userTypes');

if(Meteor.isServer) {
    const userTypes = [
        {
            type: 'adm',
            label: 'Administrador'
        },
        {
            type: 'guest',
            label: 'Convidado'
        }
    ];

    Meteor.publish('getUserTypes', () => {
        return UserTypes.find();
    });

    //adds new userTypes
    if(UserTypes.find().count() < userTypes.length) {
        userTypes.forEach(userType => {
            if (UserTypes.find({ type: userType.type }).fetch().length === 0) {
                console.log('Inserted new user type: ' + userType.type);
                UserTypes.insert(userType);
            }
        });
    }

    //removes old userTypes
    if(UserTypes.find().count() > userTypes.length) {
        UserTypes.find().fetch().forEach(userType => {
            if (userTypes.filter(uType => uType.type === userType.type).length == 0) {
                console.log('Removed user type: ' + userType.type);
                UserTypes.remove({ type: userType.type });
            }
        });
    }
}
