import type { ReactFlowProps } from '@xyflow/react'
import type { ReactNode } from 'react'
import { Background, ReactFlow } from '@xyflow/react'
import '@xyflow/react/dist/style.css'

type CanvasProps = ReactFlowProps & {
  children?: ReactNode
}

export function Canvas({ children, ...props }: CanvasProps) {
  return (
    <ReactFlow
      deleteKeyCode={['Backspace', 'Delete']}
      fitView
      panOnDrag={false}
      panOnScroll
      selectionOnDrag={true}
      zoomOnDoubleClick={false}
      {...props}
    >
      <Background bgColor="var(--sidebar)" />
      {children}
    </ReactFlow>
  )
}
