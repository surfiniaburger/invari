import { expect, test } from 'vitest'
import { getProviderInfo } from '../lib/metacog'

/**
 * Canon TDD (Safeclaw Practice):
 * Starting with a simple test for label mapping.
 */
test('getProviderInfo returns correct label for Claude Opus', () => {
  const info = getProviderInfo('claude_opus')
  expect(info.label).toBe('Claude Opus 4.6')
})

test('getProviderInfo returns fallback for unknown model', () => {
  const info = getProviderInfo('unknown_model')
  expect(info.label).toBe('unknown_model')
  expect(info.provider).toBe('other')
})

import { formatResultsForPlotly } from '../lib/metacog'

test('formatResultsForPlotly transforms accuracy and m_ratio correctly', () => {
  const mockData = {
    claude_opus: {
      name: 'claude_opus',
      static: { accuracy: 0.9, m_ratio: 1.1 },
      multiturn_v2: { overall: { acc: 0.8, m_ratio: 0.7, sensitivity: 0.5 } }
    }
  }
  
  const plotlyData = formatResultsForPlotly(mockData, 'static')
  expect(plotlyData.x).toContain(0.9)
  expect(plotlyData.y).toContain(1.1)
  expect(plotlyData.text).toContain('Claude Opus 4.6')
})
