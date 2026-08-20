import React from 'react'
import Link from 'gatsby-link'

const videos = [
  {
    title: 'SCION demo',
    id: 'GbP3_b8GVbM',
    start: 700,
  },
  {
    title: 'SCION demo',
    id: 'G7ADiXTP-LM',
  },
  {
    title: 'SCION demo',
    id: 'Pg9tYuJN6BI',
    start: 1025,
  },
  {
    title: 'SCION demo',
    id: 'zTGYmzVzW6M',
  },
  {
    title: 'SCION demo',
    id: 'IxAASoas1fY',
  },
  {
    title: 'Morse hardware demo',
    id: '7S-blsAqt_U',
  },
]

const embedUrl = video =>
  `https://www.youtube.com/embed/${video.id}${video.start ? `?start=${video.start}` : ''}`

const VideoEmbed = ({ video }) => (
  <div className="col-md-6" style={{ marginBottom: '2rem' }}>
    <h3>{video.title}</h3>
    <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', background: '#111' }}>
      <iframe
        title={`${video.title} ${video.id}`}
        src={embedUrl(video)}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  </div>
)

const ExampleVideos = () => (
  <div className="container">
    <h1 style={{ textAlign: 'center', padding: '1em 0' }}>Example Videos</h1>
    <p>
      A collection of SCION and SCXML example videos, including the Morse code hardware demo.
    </p>
    <p>
      <Link to="/examples">Back to examples</Link>
    </p>
    <div className="row">
      {videos.map(video => <VideoEmbed key={`${video.id}-${video.start || 0}`} video={video} />)}
    </div>
  </div>
)

export default ExampleVideos
