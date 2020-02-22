import { Meteor } from 'meteor/meteor';
import React from 'react';
import Company from './Company/index';
import Person from './Person/index';

export default function MainTab (props) {
  return (
    <>
      {props.item.type === 'company' ?
        <Company onChange={props.onChange} item={props.item} disabled={props.disabled}/>
        :
        <Person onChange={props.onChange} item={props.item} disabled={props.disabled}/>
      }
    </>
  )
}