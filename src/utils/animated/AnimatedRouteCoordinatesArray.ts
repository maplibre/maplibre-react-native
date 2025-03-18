import distance from "@turf/distance";
import {
  convertLength,
  type Coord,
  lineString,
  point,
  type Units,
} from "@turf/helpers";
import length from "@turf/length";
import nearestPointOnLine from "@turf/nearest-point-on-line";

import {
  AbstractAnimatedCoordinates,
  type AnimatedCoordinates,
} from "./AbstractAnimatedCoordinates";

interface AnimatedRouteToValue {
  end: /**
   * Animate to this point on the coordinates array
   */
  | { point: Coord | AnimatedCoordinates }
    /**
     * Animate to this length of the coordinates array
     */
    | {
        along: number;
        units?: Units;
      };

  /**
   * @deprecated Use `end.units` in conjunction with `end.along` instead
   */
  units?: Units;
}

interface AnimatedRouteState {
  actRoute?: AnimatedCoordinates[];
  fullRoute: AnimatedCoordinates[];
  end: {
    from: number;
    current?: number;
    to: number;
  } & ({ point?: Coord | AnimatedCoordinates } | { along?: number });
}

export class AnimatedRouteCoordinatesArray extends AbstractAnimatedCoordinates<
  AnimatedRouteState,
  AnimatedRouteToValue
> {
  /**
   * Calculate initial state
   *
   * @param {AnimatedCoordinates[]} coordinatesArray
   * @returns {AnimatedRouteState}
   */
  onInitialState(coordinatesArray: AnimatedCoordinates[]): AnimatedRouteState {
    return {
      fullRoute: coordinatesArray.map(
        (coordinates): AnimatedCoordinates => [coordinates[0], coordinates[1]],
      ),
      end: { from: 0, to: 0 },
    };
  }

  /**
   * Calculate value from state
   *
   * @param {AnimatedRouteState} state Previous state
   * @returns {AnimatedCoordinates[]}
   */
  onGetValue(state: AnimatedRouteState): AnimatedCoordinates[] {
    return state.actRoute || state.fullRoute;
  }

  /**
   * Calculates state based on startingState and progress, returns a new state
   *
   * @param {AnimatedRouteState} state Previous state
   * @param {number} progress Value between 0 and 1
   * @returns {AnimatedRouteState}
   */
  onCalculate(state: AnimatedRouteState, progress: number): AnimatedRouteState {
    const { fullRoute, end } = state;
    const currentEnd = end.from * (1.0 - progress) + progress * end.to;

    let prevSum = 0;
    let actSum = 0;
    let i = fullRoute.length - 1;
    while (actSum < currentEnd && i > 0) {
      prevSum = actSum;
      const start = fullRoute[i];
      const end = fullRoute[i - 1];
      actSum +=
        start && end ? distance(point(start), point(end), this.distconf) : 0;
      i -= 1;
    }
    if (actSum <= currentEnd) {
      const actRoute = [...fullRoute.slice(0, i + 1)];
      return { fullRoute, end: { ...end, current: currentEnd }, actRoute };
    }
    const r = (currentEnd - prevSum) / (actSum - prevSum);
    const or = 1.0 - r;

    const actRoute = [
      ...fullRoute.slice(0, i + 1),
      [
        (fullRoute[i]?.[0] ?? 0) * r + (fullRoute[i + 1]?.[0] ?? 0) * or,
        (fullRoute[i]?.[1] ?? 0) * r + (fullRoute[i + 1]?.[1] ?? 0) * or,
      ] as AnimatedCoordinates,
    ];
    return { fullRoute, end: { ...end, current: currentEnd }, actRoute };
  }

  /**
   * Subclasses can override to start a new animation
   *
   * @param {AnimatedRouteState} state
   * @param {*} toValue - to value from animate
   * @returns {object} The state
   */
  onStart(
    state: AnimatedRouteState,
    toValue: AnimatedRouteToValue,
  ): AnimatedRouteState {
    const { fullRoute, end } = state;
    const fullRouteLineString = lineString(fullRoute);

    let to: number | undefined = undefined;

    if ("along" in toValue.end) {
      const { units } = toValue;

      if (units !== undefined) {
        console.warn(
          "RouteCoordinatesArray: `toValue.units` is deprecated, use `toValue.end.units` instead.",
        );
      }

      to =
        length(fullRouteLineString) -
        convertLength(toValue.end.along, toValue.end.units ?? units);
    } else {
      const nearest = nearestPointOnLine(
        fullRouteLineString,
        toValue.end.point,
      );
      to = length(fullRouteLineString) - nearest.properties.location!;
    }

    return {
      fullRoute,
      end: {
        ...end,
        from: end.current ?? end.from,
        to,
      },
    };
  }

  get originalRoute(): AnimatedCoordinates[] {
    return this.state.fullRoute;
  }
}
