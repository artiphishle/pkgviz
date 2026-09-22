"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isFabricInstalled = isFabricInstalled;
/**
 * Checks if the Fabric renderer is installed in the current environment.
 *
 * @returns {boolean} `true` if Fabric is installed, otherwise `false`.
 */
function isFabricInstalled() {
  // @ts-expect-error
  return global?.nativeFabricUIManager != null;
}
//# sourceMappingURL=isFabricInstalled.js.map