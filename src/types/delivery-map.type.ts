/**
 * @file Type Definitions - DeliveryMap
 * @module pizza-delivery/types/DeliveryMap
 */

import type Location from '@pizza-delivery/models/location.model'

/**
 * Maps houses to total number of pizzas delivered.
 */
type DeliveryMap = Map<Location, number>

export default DeliveryMap
