import { Series } from '/imports/api/series/index';
import { Proposals } from '/imports/api/proposals/index';
import { Contracts } from '/imports/api/contracts/index';
import tools from '/imports/startup/tools/index';

export default function updateReferences(newItem) {
  Series.update(
    {containerId: newItem._id},
    {$set: {containerDescription: newItem.description}},
    {multi: true}
  )
  Proposals.find(
    {$and: [
      {status: "inactive"},
      {snapshots: {$elemMatch: {'containers._id': newItem._id}}}
    ]}
  ).forEach((proposal) => {
    var _id = proposal._id;
    delete proposal._id;
    proposal.snapshots.forEach((snapshot) => {
      snapshot.containers.forEach((container) => {
        if (container._id === newItem._id) {
          container.description = newItem.description;
          container.restitution = newItem.restitution;
        }
      })
    })
    Proposals.update({ _id }, {$set: proposal})
  })
  Contracts.find(
    {snapshots: {$elemMatch: {'containers._id': newItem._id}}}
  ).forEach((contract) => {
    var _id = contract._id;
    delete contract._id;
    if (contract.status === "inactive") {
      contract.snapshots.forEach((snapshot) => {
        snapshot.containers.forEach((container) => {
          if (container._id === newItem._id) {
            container.description = newItem.description;
            container.restitution = newItem.restitution;
          }
        })
      })
    }
    // contract.shipping.forEach((shipping) => {
    //   shipping.series.forEach((fixed) => {
    //     if (fixed._id === newItem._id) {
    //       fixed.description = newItem.description;
    //     }
    //   })
    //   shipping.packs.forEach((pack) => {
    //     if (modularId === newItem._id) {
    //       fixed.description = newItem.description;
    //     }
    //   })
    // })

    Contracts.update({ _id }, {$set: contract})
  })
}