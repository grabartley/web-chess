class HorizontalSpaceIndex {
  static mapping = {
    0: '1',
    1: '2',
    2: '3',
    3: '4',
    4: '5',
    5: '6',
    6: '7',
    7: '8',
  };
  static keys = Object.keys(HorizontalSpaceIndex.mapping);

  static getNameByIndex(i) {
    return HorizontalSpaceIndex.mapping[i];
  }

  static getIndexByName(name) {
    return Number(HorizontalSpaceIndex.keys.find(key => HorizontalSpaceIndex.mapping[key] === name));
  }
}
