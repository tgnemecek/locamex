import { Proposals } from '/imports/api/proposals/index';
import { Contracts } from '/imports/api/contracts/index';
import { Series } from '/imports/api/series/index';
import { Accessories } from '/imports/api/accessories/index';
import tools from '/imports/startup/tools/index';
import schema from '/imports/startup/schema/index';

export default function updateReferences(id, type, changes) {
  function filterChanges(changes) {
    for (key in changes) {
      if (changes[key] === undefined || changes[key] === null) {
        delete changes[key];
      }
    }
    return changes;
  }

  const updateItemsInProposals = () => {
    Proposals.find(
      {status: "inactive"}
    ).forEach((proposal) => {
      proposal.snapshots.forEach((snapshot) => {
        snapshot[type] = snapshot[type].map((item) => {
          if (item._id === id) {
            return {
              ...item,
              ...changes
            }
          } else return item;
        })
      })
      Proposals.update({ _id: proposal._id }, proposal);
    })
  }

  const updateItemsInContracts = () => {
    Contracts.find(
      {status: "inactive"}
    ).forEach((contract) => {
      contract.snapshots.forEach((snapshot) => {
        snapshot[type] = snapshot[type].map((item) => {
          if (item._id === id) {
            return {
              ...item,
              ...changes
            }
          } else return item;
        })
      })
      Contracts.update({ _id: contract._id }, contract);
    })
  }

  const updateDescriptionInSeries = () => {
    Series.find(
      {containerId: id}
    ).forEach((series) => {
      series.description = changes.description;
      Series.update({ _id: series._id }, series);
    })
  }

  const updatePacks = () => {
    // For future reference
  }

  const insertPlaceInAccessories = () => {
    Accessories.find(
      {}
    ).forEach((accessory) => {
      accessory.variations.forEach((variation) => {
        variation.places.push({
          ...changes,
          inactive: 0,
          available: 0
        })
      })
      Accessories.update({ _id: accessory._id }, accessory);
    })
  }

  const updatePlacesInAccessories = () => {
    Accessories.find(
      {}
    ).forEach((accessory) => {
      accessory.variations.forEach((variation) => {
        variation.places = variation.places.map((place) => {
          if (place._id === id) {
            return {
              ...place,
              ...changes
            }
          } else return place;
        })
      })
      Accessories.update({ _id: accessory._id }, accessory);
    })
  }

  const updatePlacesInSeries = () => {
    Series.find(
      {placeId: id}
    ).forEach((series) => {
      series.placeId = changes._id;
      series.placeDescription = changes.description;
      Series.update({ _id: series._id }, series);
    })
  }

  changes = filterChanges(changes);
  switch (type) {
    case "client":
      updateItemsInContracts();
      return;
    case "containers":
      updateDescriptionInSeries();
    case "accessories":
    case "services":
      updateItemsInProposals();
      updateItemsInContracts();
      return;
    case "places.insert":
      insertPlaceInAccessories();
      return;
    case "places.update":
      updatePlacesInAccessories();
      updatePlacesInSeries();
  }
}