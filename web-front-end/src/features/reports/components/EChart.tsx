'use client'

import { useEffect, useRef } from 'react'
import type { ECharts, EChartsOption } from 'echarts'

interface EChartProps {
  option: EChartsOption
  height?: number
}

/**
 * Small wrapper around Apache ECharts.
 * - echarts is loaded inside useEffect, so it only runs in the browser
 *   (Next.js renders pages on the server first, where there is no window).
 * - The chart re-draws when the option content changes and resizes with its box.
 * - Options must be plain data (no functions), because we compare them as JSON.
 */
export default function EChart({ option, height = 280 }: EChartProps) {
  const boxRef = useRef<HTMLDivElement>(null)
  const optionKey = JSON.stringify(option)

  useEffect(() => {
    let disposed = false
    let chart: ECharts | undefined
    let observer: ResizeObserver | undefined

    import('echarts').then((echarts) => {
      if (disposed || !boxRef.current) return
      chart = echarts.init(boxRef.current)
      chart.setOption(JSON.parse(optionKey))
      observer = new ResizeObserver(() => chart?.resize())
      observer.observe(boxRef.current)
    })

    return () => {
      disposed = true
      observer?.disconnect()
      chart?.dispose()
    }
  }, [optionKey])

  return <div ref={boxRef} style={{ width: '100%', height }} />
}
