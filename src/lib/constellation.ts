/** Utilidades puras de la constelación de /areas (sin dependencias de servidor ni de React). */

export interface GraphEdge<Id extends string = string, Label = string> {
  from: Id;
  to: Id;
  label: Label;
}

export interface Neighbor<Id extends string = string, Label = string> {
  id: Id;
  label: Label;
}

/** Vecinos de un nodo, cada uno con la etiqueta (proyecto) de la conexión, en el orden de `edges`. */
export function neighbors<Id extends string, Label>(
  edges: readonly GraphEdge<Id, Label>[],
  id: Id,
): Neighbor<Id, Label>[] {
  return edges
    .filter((edge) => edge.from === id || edge.to === id)
    .map((edge) => ({ id: edge.from === id ? edge.to : edge.from, label: edge.label }));
}

/** `true` si la conexión toca el nodo activo. */
export function isEdgeActive(edge: GraphEdge, active: string): boolean {
  return edge.from === active || edge.to === active;
}
