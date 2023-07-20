import AbstractAnimatedCoordinates, {
  AnimatedCoordinates,
} from './AbstractAnimatedCoordinates';

interface CoordinatesState {
  coords: AnimatedCoordinates[];
  targetCoords: AnimatedCoordinates[];
}

class AnimatedCoordinatesArray extends AbstractAnimatedCoordinates<CoordinatesState> {
  constructor(coords: AnimatedCoordinates[]) {
    super(coords);
  }

  /**
   * Subclasses can override to calculate initial state
   *
   * @param {AnimatedCoordinates} coordinatesArray - to value from animate
   * @returns {object} - the state object
   */
  onInitialState(coordinatesArray: AnimatedCoordinates[]): CoordinatesState {
    return {
      coords: coordinatesArray.map(coord => [coord[0], coord[1]]),
      targetCoords: [],
    };
  }

  /**
   * Subclasses can override getValue to calculate value from state.
   * Value is typically coordinates array, but can be anything
   *
   * @param {object} state - either state from initialState and/or from calculate
   * @returns {object}
   */
  onGetValue(state: CoordinatesState): CoordinatesState['coords'] {
    return state.coords;
  }

  /**
   * Calculates state based on startingState and progress, returns a new state
   *
   * @param {object} state - state object from initialState and/or from calculate
   * @param {number} progress - value between 0 and 1
   * @returns {object} next state
   */
  onCalculate(state: CoordinatesState, progress: number): CoordinatesState {
    const {coords, targetCoords} = state;
    const newF = progress;
    const origF = 1.0 - newF;

    // common
    const commonLen = Math.min(coords.length, targetCoords.length);
    const common = coords
      .slice(0, commonLen)
      .map((origCoord, i): [number, number] => [
        origCoord[0] * origF + targetCoords[i][0] * newF,
        origCoord[1] * origF + targetCoords[i][1] * newF,
      ]);

    if (targetCoords.length > coords.length) {
      // only in new (adding)
      const addingOrig =
        coords.length > 0 ? coords[coords.length - 1] : targetCoords[0];
      const adding = targetCoords
        .slice(commonLen, targetCoords.length)
        .map((newCoord): [number, number] => [
          addingOrig[0] * origF + newCoord[0] * newF,
          addingOrig[1] * origF + newCoord[1] * newF,
        ]);
      return {coords: [...common, ...adding], targetCoords};
    }

    if (coords.length > targetCoords.length) {
      // only in orig (dissapearing)
      const dissapearingNew =
        targetCoords.length > 0
          ? targetCoords[targetCoords.length - 1]
          : coords[0];
      const dissapearing = coords
        .slice(commonLen, coords.length)
        .map((origCoord): [number, number] => [
          origCoord[0] * origF + dissapearingNew[0] * newF,
          origCoord[1] * origF + dissapearingNew[1] * newF,
        ]);
      return {coords: [...common, ...dissapearing], targetCoords};
    }

    return {coords: common, targetCoords};
  }

  /**
   * Subclasses can override to start a new animation
   *
   * @param {*} toValue - to value from animate
   * @param {*} actCoords - the current coordinates array to start from
   * @returns {object} The state
   */
  onStart(
    state: CoordinatesState,
    toValue: AnimatedCoordinates[],
  ): CoordinatesState {
    const targetCoords = toValue.map(
      (coord): AnimatedCoordinates => [coord[0], coord[1]],
    );
    return {
      ...state,
      targetCoords,
    };
  }
}

export default AnimatedCoordinatesArray;
