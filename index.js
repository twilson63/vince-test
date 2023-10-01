import { of, fromPromise, Rejected, Resolved } from 'hyper-async'

export function findAndWriteSeqTxWith({ findSequencerTx, writeSequencerTx, logger }) {
  function maybeSequencerTx(tx) {
    return of(tx.id)
      .chain(fromPromise(findSequencerTx))
      .bichain(Resolved(tx), Rejected)
  }

  function writeTx(tx) {
    return of(tx.data)
      .chain(fromPromise(writeSequencerTx))
  }

  return (tx) => {
    return of(tx)
      .bichain(Rejected, maybeSequencerTx)
      .bichain(writeTx, Resolved)
      .map(logger.tap('wrote tx to sequencer'))
  }
}