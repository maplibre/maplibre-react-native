import {
  AbstractAnimatedCoordinates,
  type AnimatedCoordinates,
} from "./AbstractAnimatedCoordinates";

interface CoordinatesState {
  coords: AnimatedCoordinates[];
  targetCoords: AnimatedCoordinates[];
}

export class AnimatedCoordinatesArray extends AbstractAnimatedCoordinates<CoordinatesState> {
  /**
   * Subclasses can override to calculate initial state
   *
   * @param {AnimatedCoordinates} coordinatesArray - to value from animate
   * @returns {object} - the state object
   */
  onInitialState(coordinatesArray: AnimatedCoordinates[]): CoordinatesState {
    return {
      coords: coordinatesArray.map((coordinates) => [
        coordinates[0],
        coordinates[1],
      ]),
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
  onGetValue(state: CoordinatesState): CoordinatesState["coords"] {
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
    const { coords, targetCoords } = state;
    const newF = progress;
    const origF = 1.0 - newF;

    // common
    const commonLen = Math.min(coords.length, targetCoords.length);
    const common = coords
      .slice(0, commonLen)
      .map((originalCoordinates, i): [number, number] => [
        originalCoordinates[0] * origF + (targetCoords[i]?.[0] ?? 0) * newF,
        originalCoordinates[1] * origF + (targetCoords[i]?.[1] ?? 0) * newF,
      ]);

    if (targetCoords.length > coords.length) {
      // only in new (adding)
      const addingOriginal =
        coords.length > 0 ? coords[coords.length - 1] : targetCoords[0];

      const adding = targetCoords
        .slice(commonLen, targetCoords.length)
        .map((newCoordinates): [number, number] => [
          (addingOriginal?.[0] ?? 0) * origF + newCoordinates[0] * newF,
          (addingOriginal?.[1] ?? 0) * origF + newCoordinates[1] * newF,
        ]);

      return { coords: [...common, ...adding], targetCoords };
    }

    if (coords.length > targetCoords.length) {
      // only in orig (disappearing)
      const disappearingNew =
        targetCoords.length > 0
          ? targetCoords[targetCoords.length - 1]
          : coords[0];
      const disappearing = coords
        .slice(commonLen, coords.length)
        .map((originalCoordinates): [number, number] => [
          originalCoordinates[0] * origF + (disappearingNew?.[0] ?? 0) * newF,
          originalCoordinates[1] * origF + (disappearingNew?.[1] ?? 0) * newF,
        ]);
      return { coords: [...common, ...disappearing], targetCoords };
    }

    return { coords: common, targetCoords };
  }

  /**
   * Subclasses can override to start a new animation
   *
   * @param {*} state - to value from animate
   * @param {*} toValue - the current coordinates array to start from
   * @returns {object} The state
   */
  onStart(
    state: CoordinatesState,
    toValue: AnimatedCoordinates[],
  ): CoordinatesState {
    const targetCoords = toValue.map(
      (coordinates): AnimatedCoordinates => [coordinates[0], coordinates[1]],
    );
    return {
      ...state,
      targetCoords,
    };
  }
}
