import { useEffect, useRef } from 'react'
import { Network } from 'vis-network/standalone'
import type { TopicEdge, TopicNode } from '../../utils/graph'

interface Props {
  nodes: TopicNode[]
  edges: TopicEdge[]
  onSelectTopic(topic: string): void
}

/** vis-network로 그리는 주제 연관 그래프. 확대·이동은 라이브러리 기본 동작 */
export default function TopicGraph({ nodes, edges, onSelectTopic }: Props) {
  const container = useRef<HTMLDivElement>(null)
  // 클릭 핸들러가 바뀌어도 그래프를 다시 만들지 않도록 ref로 들고 있는다
  const onSelect = useRef(onSelectTopic)
  useEffect(() => {
    onSelect.current = onSelectTopic
  })

  useEffect(() => {
    if (!container.current) return
    const style = getComputedStyle(document.documentElement)
    const text = style.getPropertyValue('--text').trim()
    const accent = style.getPropertyValue('--accent').trim()
    const border = style.getPropertyValue('--border').trim()

    const network = new Network(
      container.current,
      {
        nodes: nodes.map((n) => ({ id: n.id, label: n.id, value: n.count, title: `${n.id} (${n.count}건)` })),
        edges: edges.map((e) => ({ from: e.from, to: e.to, value: e.weight, title: `공유 키워드 ${e.weight}개` })),
      },
      {
        nodes: { shape: 'dot', color: accent, font: { color: text }, scaling: { min: 10, max: 30 } },
        edges: { color: border, scaling: { min: 1, max: 6 } },
        interaction: { hover: true },
      },
    )
    network.on('click', (params: { nodes: string[] }) => {
      if (params.nodes[0]) onSelect.current(params.nodes[0])
    })
    return () => network.destroy()
  }, [nodes, edges])

  return <div ref={container} className="topic-graph" />
}
