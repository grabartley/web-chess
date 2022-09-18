class VerticalSpaceIndex {
  static mapping = {
    0: 'a',
    1: 'b',
    2: 'c',
    3: 'd',
    4: 'e',
    5: 'f',
    6: 'g',
    7: 'h',
  };
  static keys = Object.keys(VerticalSpaceIndex.mapping);

  static getNameByIndex(i) {
    return VerticalSpaceIndex.mapping[i];
  }

  static getIndexByName(name) {
    return Number(VerticalSpaceIndex.keys.find(key => VerticalSpaceIndex.mapping[key] === name));
  }
}
