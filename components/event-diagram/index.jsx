import { Box } from "@chakra-ui/react";
import { ReactFlow, Background, Handle } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

const colors = [
  "purple.solid",
  "orange.solid",
  "teal.solid",
  "cyan.solid",
  "pink.solid",
  "gray.solid",
  "green.solid",
  "yellow.solid",
  "red.solid",
  "blue.solid",
];

function EventNode({ data }) {
  const style = {
    backgroundColor: `var(--chakra-colors-${data.color.replace(".", "-")})`,
    padding: "10px",
    borderRadius: "8px",
    textAlign: "center",
    width: "120px",
    color: "black",
  };

  return (
    <div style={style}>
      <div style={{ fontWeight: "bold" }}>{data.label}</div>
      <Handle type="source" position="right" />
      <Handle type="target" position="left" />
    </div>
  );
}

export default function EventDiagram({ events }) {
  const sorted = [...events].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const nodes = sorted.map((event, index) => ({
    id: event.id,
    type: "eventNode",
    data: {
      label: event.name,
      color: colors[index % colors.length],
    },
    position: { x: index * 180, y: 100 },
  }));

  const edges = sorted.slice(1).map((event, i) => ({
    id: `e-${sorted[i].id}-${event.id}`,
    source: sorted[i].id,
    target: event.id,
    type: "default",
    markerEnd: { type: "arrowclosed", color: "black" },
    style: { stroke: "black" },
  }));

  return (
    <div
      style={{
        height: 300,
        border: "1px solid #ccc",
        borderRadius: "8px",
        marginTop: "16px",
        backgroundColor: "white",
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={{ eventNode: EventNode }}
        fitView
      >
        <Background />
      </ReactFlow>
    </div>
  );
}
