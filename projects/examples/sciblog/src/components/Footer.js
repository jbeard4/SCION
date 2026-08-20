import React from 'react'
import $ from 'jquery'

export default class Footer extends React.Component {

  constructor(props){
    super(props);
  
    this.state = {
      position: this.getPosition()
    }
  }

  static contextTypes = {
    router: React.PropTypes.object
  }

  getPosition(){
    return this.boundsCheck() ? 'absolute' : 'relative';
  }

  boundsCheck(){
    return typeof document !== 'undefined' && typeof window !== 'undefined' &&
      document.getElementById('___gatsby').offsetHeight < window.innerHeight;
  } 

  boundsCheckAndUpdate(){
    window.requestAnimationFrame(() => {
      setTimeout(() => {
        const position = this.getPosition()
        this.setState({position});
      }, 0);
    });
  }

  componentDidMount(){
    this.boundsCheckAndUpdate();  
    $(window).resize(this.boundsCheckAndUpdate.bind(this));
    this.context.router.history.listen(this.boundsCheckAndUpdate.bind(this));
  }

  render(){
    return <footer 
      style={{
        backgroundColor: '#f5f5f5',
        position: this.state.position,
        bottom: 0,
        left: 0,
        right: 0,
        padding: '0.75rem 1rem'
      }} 
      ref={ x => this.root = x }>
      <div style={{ marginBottom: '0.35rem' }}>
        SCXML.IO is maintained by <a href="https://minnow.io">Minnow Software, LLC</a>.
      </div>
      <div style={{ display: 'inline-flex', alignItems: 'center', color: '#555', fontSize: '0.9rem' }}>
        <span style={{ marginRight: '0.4rem' }}>Powered by SCION</span>
        <img
          src="/scion-scxml-logo.png"
          alt="SCION SCXML"
          style={{ width: '28px', height: '28px' }}
        />
      </div>
    </footer>
  }
}
