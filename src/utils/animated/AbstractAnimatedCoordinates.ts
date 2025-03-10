import { Animated } from "react-native";

// https://github.com/facebook/react-native/blob/main/packages/react-native/Libraries/Animated/nodes/AnimatedWithChildren.js
const AnimatedWithChildren = Object.getPrototypeOf(Animated.ValueXY);

if (__DEV__) {
  if (AnimatedWithChildren.name !== "AnimatedWithChildren") {
    console.error(
      "AnimatedCoordinatesArray could not obtain AnimatedWithChildren base class",
    );
  }
}

export type AnimatedCoordinates = [number, number];

const defaultConfig = {
  useNativeDriver: false,
};

export abstract class AbstractAnimatedCoordinates<
  State,
  ToValue = AnimatedCoordinates[],
> extends AnimatedWithChildren {
  constructor(coordinates: AnimatedCoordinates[]) {
    super();

    this.state = this.onInitialState(coordinates);
  }

  /**
   * Subclasses can override to calculate initial state
   *
   * @returns {object} - the state object
   * @param coordinates
   */
  abstract onInitialState(coordinates: AnimatedCoordinates[]): State;
  /**
   * Calculates state based on startingState and progress, returns a new state
   *
   * @param {object} state - state object from initialState and/or from calculate
   * @param {number} progress - value between 0 and 1
   * @returns {object} next state
   */
  abstract onCalculate(state: State, progress: number): State;

  animate(
    progressValue: Animated.Value,
    progressAnimation: Animated.CompositeAnimation,
    config: Omit<
      | Animated.TimingAnimationConfig
      | Animated.SpringAnimationConfig
      | Animated.DecayAnimationConfig,
      "toValue"
    > & { toValue: ToValue },
  ): Animated.CompositeAnimation {
    const onAnimationStart = (animation: Animated.CompositeAnimation): void => {
      if (this.animation) {
        const actProgress = this.progressValue.__getValue();
        this.animation.stop();
        this.state = this.onCalculate(this.state, actProgress);
        this.progressValue.__removeChild(this);
        this.progressValue = null;
        this.animation = null;
      }

      this.progressValue = progressValue;
      this.progressValue.__addChild(this);
      this.animation = animation;
      this.state = this.onStart(this.state, config.toValue);
    };

    const origAnimationStart = progressAnimation.start;
    const newAnimation = progressAnimation;
    newAnimation.start = function start(...args): void {
      onAnimationStart(progressAnimation);
      origAnimationStart(...args);
    };
    return newAnimation;
  }

  timing(
    config: Omit<
      Animated.TimingAnimationConfig,
      "toValue" | "useNativeDriver"
    > & {
      toValue: ToValue;
    },
  ): Animated.CompositeAnimation {
    const progressValue = new Animated.Value(0.0);
    return this.animate(
      progressValue,
      Animated.timing(progressValue, {
        ...defaultConfig,
        ...config,
        toValue: 1.0,
      }),
      {
        ...defaultConfig,
        ...config,
      },
    );
  }

  spring(
    config: Omit<Animated.SpringAnimationConfig, "toValue"> & {
      toValue: ToValue;
    },
  ): Animated.CompositeAnimation {
    const progressValue = new Animated.Value(0.0);
    return this.animate(
      progressValue,
      Animated.spring(progressValue, {
        ...defaultConfig,
        ...config,
        toValue: 1.0,
      }),
      config,
    );
  }

  decay(
    config: Omit<Animated.DecayAnimationConfig, "toValue"> & {
      toValue: ToValue;
    },
  ): Animated.CompositeAnimation {
    const progressValue = new Animated.Value(0.0);
    return this.animate(
      progressValue,
      Animated.decay(this.progressValue, {
        ...defaultConfig,
        ...config,
      }),
      config,
    );
  }

  __getValue(): AnimatedCoordinates[] {
    if (!this.progressValue) {
      return this.onGetValue(this.state);
    }
    return this.onGetValue(
      this.onCalculate(this.state, this.progressValue.__getValue()),
    );
  }
}
