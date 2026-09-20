import { P2PChainFigure } from './svgs/P2PChain'
import { SampleInvoiceFigure } from './svgs/SampleInvoice'
import { TransmissionTimelineFigure } from './svgs/TransmissionTimeline'
import type { FigureMap } from '../../types'

export const figures: FigureMap = {
  sample: SampleInvoiceFigure,
  p2p: P2PChainFigure,
  timeline: TransmissionTimelineFigure,
}
