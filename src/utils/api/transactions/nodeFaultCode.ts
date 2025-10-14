import * as t from "io-ts";

const NodeFaultCodeR = t.type({
  faultCodeCategory: t.string,
});

const NodeFaultCodeO = t.partial({
  faultCodeDetail: t.string,
});

export const NodeFaultCode = t.intersection(
  [NodeFaultCodeO, NodeFaultCodeR],
  "NodeFaultCode"
);

export type NodeFaultCode = t.TypeOf<typeof NodeFaultCode>;
