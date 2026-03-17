import { Animated } from "react-native";

const AnimatedWithChildren = Object.getPrototypeOf(Animated.ValueXY);

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
   * @returns the state object
   */
  protected abstract onInitialState(coordinates: AnimatedCoordinates[]): State;

  /**
   * Calculates state based on startingState and progress, returns a new state
   *
   * @param state - state object from initialState and/or from calculate
   * @param progress - value between 0 and 1
   * @returns next state
   */
  protected abstract onCalculate(state: State, progress: number): State;

  /**
   * Subclasses can override getValue to calculate value from state.
   * Value is typically coordinates array, but can be anything
   *
   * @param state - either state from initialState and/or from calculate
   */
  protected abstract onGetValue(state: State): AnimatedCoordinates[];

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
