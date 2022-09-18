class CommonUtil {
  static getHIndex(h) {
    const hIndex = HorizontalSpaceIndex.getIndexByName(h);

    return Number(hIndex === null ? -1 : hIndex);
  }

  static getHIndexBySpace(space) {
    return CommonUtil.getHIndex(space.h);
  }

  static getHDiff(currentSpace, proposedSpace) {
    const currentHIndex = CommonUtil.getHIndexBySpace(currentSpace);
    const proposedHIndex = CommonUtil.getHIndexBySpace(proposedSpace);

    return proposedHIndex - currentHIndex;
  }

  static getVIndex(v) {
    const vIndex = VerticalSpaceIndex.getIndexByName(v);

    return Number(vIndex === null ? -1 : vIndex);
  }

  static getVIndexBySpace(space) {
    return CommonUtil.getVIndex(space.v);
  }

  static getVDiff(currentSpace, proposedSpace) {
    const currentVIndex = CommonUtil.getVIndexBySpace(currentSpace);
    const proposedVIndex = CommonUtil.getVIndexBySpace(proposedSpace);

    return proposedVIndex - currentVIndex;
  }
}
