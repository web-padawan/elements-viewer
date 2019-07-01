/**
 * DO NOT EDIT
 *
 * This file was automatically generated by
 *   https://github.com/Polymer/gen-typescript-declarations
 *
 * To modify these typings, edit the source file(s):
 *   app-route-converter-behavior.html
 */

/// <reference path="../polymer/types/polymer.d.ts" />

declare namespace Polymer {

  /**
   * Provides bidirectional mapping between `path` and `queryParams` and a
   * app-route compatible `route` object.
   *
   * For more information, see the docs for `app-route-converter`.
   */
  interface AppRouteConverterBehavior {

    /**
     * A model representing the deserialized path through the route tree, as
     * well as the current queryParams.
     *
     * A route object is the kernel of the routing system. It is intended to
     * be fed into consuming elements such as `app-route`.
     */
    route: object|null|undefined;

    /**
     * A set of key/value pairs that are universally accessible to branches of
     * the route tree.
     */
    queryParams: object|null;

    /**
     * The serialized path through the route tree. This corresponds to the
     * `window.location.pathname` value, and will update to reflect changes
     * to that value.
     */
    path: string|null|undefined;
    created(): void;

    /**
     * Handler called when the path or queryParams change.
     */
    _locationChanged(): void;

    /**
     * Handler called when the route prefix and route path change.
     */
    _routeChanged(): void;

    /**
     * Handler called when the route queryParams change.
     *
     * @param queryParams A set of key/value pairs that are
     * universally accessible to branches of the route tree.
     */
    _routeQueryParamsChanged(queryParams: object|null): void;
  }

  const AppRouteConverterBehavior: object;
}