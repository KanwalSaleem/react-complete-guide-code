const initialState = {
  selectedBathrooms: [],
  unit: [],
  PurchaseType: 'rent',
  landArea: [],
  selectedBedrooms: [],
  price: [],
  selectedPropertyType: [],
  address: '',
  community: [],
  filterData: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'DASHBOARD': {
      return {
        ...state,
      };
    }
    case 'FILTER': {
      return {
        ...action.state,
      };
    }
  }
  return state;
};
