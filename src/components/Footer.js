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
        console.log('boundsCheckAndUpdate', position);
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
        right: 0
      }} 
      ref={ x => this.root = x }>
      SCION is professionally developed and maintained by Jacobean Research and Development, LLC.
    </footer>
  }
}
