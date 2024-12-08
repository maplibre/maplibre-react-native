import { Fragment } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { colors } from "../styles/colors";

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: colors.grey,
  },

  touchable: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  touchableActive: {
    backgroundColor: colors.blue,
  },
  touchableText: {
    textAlign: "center",
    fontWeight: "bold",
  },
  touchableTextActive: {
    color: "#ffffff",
  },

  divider: {
    width: 2,
    backgroundColor: "#dedede",
  },
});

type ButtonGroupProps = {
  value?: number;
  options: string[];
  onPress: (index: number) => void;
  disabled?: boolean;
  scrollable?: boolean;
};

export function ButtonGroup({
  value,
  options,
  onPress,
  disabled,
  scrollable,
}: ButtonGroupProps) {
  const buttonGroup = (
    <View style={styles.root}>
      {options.map((option, index) => (
        <Fragment key={option}>
          {index > 0 && <View style={styles.divider} />}
          <TouchableOpacity
            style={[
              styles.touchable,
              value === index && styles.touchableActive,
            ]}
            onPress={() => {
              onPress(index);
            }}
            disabled={disabled}
          >
            <Text
              style={[
                styles.touchableText,
                value === index && styles.touchableTextActive,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        </Fragment>
      ))}
    </View>
  );

  return scrollable ? (
    <ScrollView horizontal style={{ flexGrow: 0 }}>
      {buttonGroup}
    </ScrollView>
  ) : (
    buttonGroup
  );
}
