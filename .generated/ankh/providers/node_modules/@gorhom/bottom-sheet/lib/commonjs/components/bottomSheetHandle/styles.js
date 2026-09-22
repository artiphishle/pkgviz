"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.styles = void 0;
var _reactNative = require("react-native");
const styles = exports.styles = _reactNative.StyleSheet.create({
  container: {
    padding: 10,
    ..._reactNative.Platform.select({
      web: {
        cursor: 'pointer'
      },
      default: {}
    })
  },
  indicator: {
    alignSelf: 'center',
    width: 7.5 * _reactNative.Dimensions.get('window').width / 100,
    height: 4,
    borderRadius: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.75)'
  }
});
//# sourceMappingURL=styles.js.map