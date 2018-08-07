import React from 'react'

const photos = []

for(var i = 0; i < 10; i++){
  photos.push(i);
}

const HistoryDemo = ({configuration, scPromise}) => (
  <div style={{width: '100%', height: '100%'}}>
    {
      (configuration && configuration[0] === 'gallery') && <Gallery scPromise={scPromise} />
    }
    {
      (configuration && configuration[0] === 'carousel') && <Carousel scPromise={scPromise} />
    }
    {
      (configuration && configuration[0] === 'modal-open') && <Modal scPromise={scPromise} />
    }
  </div>
)

const OpenModalButton = ({scPromise}) => (
  <button onClick={() => scPromise.then( (sc) => sc.gen('open-modal') )}> Open modal </button>
)

const Gallery = ({scPromise}) => (
  <div style={{width: '100%', height: '100%'}}>
    <button onClick={ () => scPromise.then( (sc) => sc.gen('go-to-carousel') )}> Go to carousel </button>
    <OpenModalButton scPromise={scPromise} />
    <div> Gallery </div>
    {
      photos.map( i => (
        <div key={i} style={{
            width: '50px',
            height: '50px',
            backgroundColor: 'lightgray',
            margin: '1em',
            display: 'inline-block'
          }}>
          {i}
        </div>
      ))
    }
  </div>
)

class Carousel extends React.Component {
  constructor(props){
    super(props)
    this.clickLeft = this.clickLeft.bind(this)
    this.clickRight = this.clickRight.bind(this)
    this.state = {index : 5}
  }

  clickLeft(){
    const index = this.state.index-1
    if(index > -1){
      this.setState({index})
    }
  }

  clickRight(){
    const index = this.state.index+1
    if(index < photos.length){
      this.setState({index})
    }
  }

  render(){
    return <div style={{width: '100%', height: '100%'}}>
      <button onClick={ () => this.props.scPromise.then( (sc) => sc.gen('go-to-gallery') )}> Go to gallery </button>
      <OpenModalButton scPromise={this.props.scPromise} />
      <div> Carousel </div>
      <button onClick={this.clickLeft} disabled={i === 0}>&larr;</button>
      <div style={{
          width: '50px',
          height: '50px',
          backgroundColor: 'lightgray',
          margin: '1em',
          display: 'inline-block'
        }}>
        {this.state.index}
      </div>
      <button onClick={this.clickRight} disabled={i === (photos.length - 1)}>&rarr;</button>
    </div>
  }
}

const Modal = ({scPromise}) => (
  <div style={{width: '100%', height: '100%'}}>
    <div style={{textAlign: 'right', backgroundColor: 'lightgray', border: '1px solid black'}}>
      <span style={{cursor: 'pointer'}} onClick={() => scPromise.then( (sc) => sc.gen('close-modal') )}> &times; </span>
    </div>
    <div style={{border: '1px solid black', height: '100px'}}> This is a modal dialog </div>
  </div>
)

export default HistoryDemo; 
