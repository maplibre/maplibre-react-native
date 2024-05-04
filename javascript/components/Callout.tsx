import React, {ReactElement} from 'react';
import {
  View,
  Text,
  Animated,
  requireNativeComponent,
  StyleSheet,
  ViewStyle,
  ViewProps,
  StyleProp,
} from 'react-native';

export const NATIVE_MODULE_NAME = 'RCTMLNCallout';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 180,
    zIndex: 9999999,
  },
  content: {
    backgroundColor: 'white',
    borderColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 3,
    borderWidth: 1,
    flex: 1,
    padding: 8,
    position: 'relative',
  },
  tip: {
    backgroundColor: 'transparent',
    borderBottomColor: 'transparent',
    borderBottomWidth: 0,
    borderLeftColor: 'transparent',
    borderLeftWidth: 8,
    borderRightColor: 'transparent',
    borderRightWidth: 8,
    borderTopColor: 'white',
    borderTopWidth: 16,
    elevation: 0,
    marginTop: -2,
    zIndex: 1000,
  },
  title: {
    color: 'black',
    textAlign: 'center',
  },
});

interface CalloutProps extends Omit<ViewProps, 'style'> {
  /**
   * String that get's displayed in the default callout.
   */
  title?: string;
  /**
   * Style property for the Animated.View wrapper, apply animations to this
   */
  style?: ViewStyle;
  /**
   * Style property for the native RCTMLNCallout container, set at your own risk.
   */
  containerStyle?: ViewStyle;
  /**
   * Style property for the content bubble.
   */
  contentStyle?: ViewStyle;
  /**
   * Style property for the triangle tip under the content.
   */
  tipStyle?: ViewStyle;
  /**
   * Style property for the title in the content bubble.
   */
  textStyle?: ViewStyle;
}

interface NativeProps extends Omit<CalloutProps, 'style'> {
  style: StyleProp<ViewStyle>;
}

/**
 *  Callout that displays information about a selected annotation near the annotation.
 */
class Callout extends React.PureComponent<CalloutProps> {
  get _containerStyle(): ViewStyle[] {
    const style = [
      {
        position: 'absolute',
        zIndex: 999,
        backgroundColor: 'transparent',
      } as ViewStyle,
    ];

    if (this.props.containerStyle) {
      style.push(this.props.containerStyle);
    }

    return style;
  }

  get _hasChildren(): boolean {
    return React.Children.count(this.props.children) > 0;
  }

  _renderDefaultCallout(): ReactElement {
    return (
      <Animated.View style={[styles.container, this.props.style]}>
        <View style={[styles.content, this.props.contentStyle]}>
          <Text style={[styles.title, this.props.textStyle]}>
            {this.props.title}
          </Text>
        </View>
        <View style={[styles.tip, this.props.tipStyle]} />
      </Animated.View>
    );
  }

  _renderCustomCallout(): ReactElement {
    return (
      <Animated.View {...this.props} style={this.props.style}>
        {this.props.children}
      </Animated.View>
    );
  }

  render(): ReactElement {
    const calloutContent = this._hasChildren
      ? this._renderCustomCallout()
      : this._renderDefaultCallout();
    return (
      <RCTMLNCallout style={this._containerStyle}>
        {calloutContent}
      </RCTMLNCallout>
    );
  }
}

const RCTMLNCallout = requireNativeComponent<NativeProps>(NATIVE_MODULE_NAME);

export default Callout;
