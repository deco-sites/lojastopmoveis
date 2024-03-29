/**
 * This file takes care of global app side effects,
 * like clicking on add to cart and the cart modal being displayed
 */

import { signal } from "@preact/signals";

const displayCart = signal(false);
const displayMenu = signal(false);
const displaySearchbar = signal(false);
const displayBuyWarning = signal(false);
const displayTopBar = signal(true);
const headerHeight = signal("170px");

const state = {
  displayCart,
  displayMenu,
  displaySearchbar,
  displayBuyWarning,
  displayTopBar,
  headerHeight,
};

export const useUI = () => state;
