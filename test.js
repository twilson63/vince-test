import test from 'node:test'
import assert from 'node:assert/strict'

import { findAndWriteSeqTxWith } from './index.js'

const findSequencerTx = () => Promise.resolve('1234')
const writeSequencerTx = () => Promise.resolve('ok')
const logger = {
  tap: (x) => _ => (console.log(x), x)
}
test('ok', async () => {
  const findTx = findAndWriteSeqTxWith({ findSequencerTx, writeSequencerTx, logger })
  const result = await findTx({ id: '1234' }).toPromise()
  console.log(result)
  assert.ok(true)
})