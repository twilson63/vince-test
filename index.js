import { of, fromPromise, Rejected, Resolved } from 'hyper-async'

export function findAndWriteSeqTxWith({ findSequencerTx, writeSequencerTx, logger }) {
  const doFindSequencerTx = fromPromise(findSequencerTx)
  const doWriteSequencerTx = fromPromise(writeSequencerTx)

  const maybeSequencerTx = (tx) => doFindSequencerTx(tx.id)
    .bichain(_ => Resolved(tx), Rejected)

  const writeTx = (tx) => doWriteSequencerTx(tx.data)

  return (tx) => maybeSequencerTx(tx)
    .bichain(writeTx, Resolved)
    .map(logger.tap('wrote tx to sequencer'))
}