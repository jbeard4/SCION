import * as React from 'react'
import Prism from 'prismjs'
import PrismCode from 'react-prism'
import TutorialPageWrapper from '../../../components/TutorialPageWrapper'
import QtFtpClientExample, { ftpClientScxml } from '../../../examples/qt-ftp-client-example'

const FtpClient = ({ sectionName, by }) => (
  <div>
    <h1>{sectionName}</h1>
    <h6>{by}</h6>

    <p>
      This ports the state structure described in Qt&apos;s SCXML FTP Client example into a browser simulation.
      The panel stands in for the FTP control channel by sending server reply events and recording commands
      emitted by the statechart.
    </p>

    <QtFtpClientExample />

    <h2>SCXML source</h2>
    <PrismCode component="pre" className="language-xml">
      {ftpClientScxml}
    </PrismCode>
  </div>
)

const WrappedFtpClient = ({ location }) => (
  <TutorialPageWrapper Component={FtpClient} pathname={location.pathname} />
)

export default WrappedFtpClient
