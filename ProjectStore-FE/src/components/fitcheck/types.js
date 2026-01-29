/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Type definitions converted to JSDoc
 */

/**
 * @typedef {Object} WardrobeItem
 * @property {string} id
 * @property {string} name
 * @property {string} url
 */

/**
 * @typedef {Object} OutfitLayer
 * @property {WardrobeItem | null} garment - null represents the base model layer
 * @property {Record<string, string>} poseImages - Maps pose instruction to image URL
 */

// Export empty object to make this a module
export {};
