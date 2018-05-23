import { Mongo } from 'meteor/mongo';

export const UserTypes = new Mongo.Collection('userTypes');

const userTypes = [
    {
        type: 'adm',
        label: 'Administrador'
    }, {
        type: 'guest',
        label: 'Visitante'
    }
]

if(UserTypes.find().count() < userTypes.length) {
    userTypes.forEach(userType => {
        if (UserTypes.find({ type: userType.type }).fetch().length === 0) {
            console.log('Inserted new user type: ' + userType.type);
            UserTypes.insert(userType);
        }
    });
}