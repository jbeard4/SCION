import React from 'react'
import Link from 'gatsby-link'
import get from 'lodash/get'
import Helmet from 'react-helmet'
import SCHVIZ from '@jbeard/schviz2';
import scxml from 'scxml';
import lampScxml from './simple-lamp.scxml';

class TutorialsIndex extends React.Component {

  constructor(props){
    super(props);
    scxml.documentStringToModel(null, lampScxml, (err, model) => {
      if(err) throw err;
      model.prepare((err, modelFactory) => {
        if(err) throw err;
        this.sc = new scxml.scion.Statechart(modelFactory);

        let transitionsEnabled;
        this.sc.on('onBigStepBegin',() => {
          transitionsEnabled = new Map();
        })
        this.sc.on('onBigStepEnd',() => {
          this.setState({ 
            configuration : this.sc.getConfiguration(),
            transitionsEnabled 
          });
        })
        this.sc.on('onTransition',(transitionSourceId,targetIds,transitionIndex) => {
          if(transitionsEnabled.has(transitionSourceId)){
            const set = transitionsEnabled.get(transitionSourceId);
            set.add(transitionIndex);
          }else{
            const set = new Set();
            set.add(transitionIndex);
            transitionsEnabled.set(transitionSourceId, set);
          }
        });
        this.sc.start();
      });
    });
  }

  render(){
    return <div className="container">
      <h3> Light Switch Example </h3>

      <p>Let’s say we have a touch lamp. Whenever you touch it, it turns on if it was off and off if it was on.</p>

      <p>So we have two states: ‘on’ and ‘off’. We also have one event: ‘touch’. We can organize this into a statechart like so:</p>

      <div className="row">
        <div style={{height:'400px',position:'relative',width:'100%'}}>
          <SCHVIZ 
            scxmlDocumentString={lampScxml}
            disableAnimation={true}
            disableZoom={true}
            configuration={this.state && this.state.configuration}
            disableZoomAnimation={true}
            transitionsEnabled={this.state && this.state.transitionsEnabled} 
            />
        </div>
      </div>
      <div className="row">
        <div className="col-md-6">
          <div style={{height:'400px',position:'relative',width:'100%'}}>
            <LampSwitch sc={this.sc} configuration={this.state && this.state.configuration}/>
          </div>
        </div>
        <div className="col-md-6">
          <div style={{height:'400px',position:'relative',width:'100%'}}>
            <LampBulb configuration={this.state && this.state.configuration}/>
          </div>
        </div>
      </div>
    </div>
  }
}

const LampBulb = ({configuration}) => (
  <svg id="svg2598" version="1.0" viewBox="0 0 44 54" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
   <defs id="defs2601">
    <linearGradient id="linearGradient3401" x1="14.5" x2="27.625" y1="42" y2="42" gradientUnits="userSpaceOnUse">
     <stop id="stop3397" stopColor="#fff" offset="0"/>
     <stop id="stop3428" stopColor="#e3e3e3" offset=".5"/>
     <stop id="stop3399" offset="1"/>
    </linearGradient>
    <filter id="filter3407" x="-.078906" y="-.25042" width="1.1578" height="1.5008">
     <feGaussianBlur id="feGaussianBlur3409" stdDeviation="0.47487807"/>
    </filter>
    <radialGradient id="radialGradient3003" cx="17.922" cy="16.813" r="14.44" gradientTransform="matrix(1 0 0 1.238 .25 -4.8279)" gradientUnits="userSpaceOnUse">
     <stop id="stop3420" stopColor="#fff" offset="0"/>
     <stop id="stop3422" stopColor="#ffdc00" offset="1"/>
    </radialGradient>
   </defs>
   <path fillOpacity={configuration && configuration[0] === 'on' ? 0.7 : 0} id="path3415" d="m27.1 30.824c7.2231-3.3965 10.352-12.066 6.9851-19.352-3.3674-7.2857-11.963-10.442-19.186-7.0455-7.2231 3.3965-10.352 12.066-6.9851 19.352 1.4846 3.212 3.7334 5.4935 6.9091 7.0095l-0.1362-0.10018-0.5 5.75 5.375 2.375 3.5-0.125 3.875-2 0.16283-5.8638z" fill="url(#radialGradient3003)" fillRule="evenodd" style={{transition:'fill-opacity .5s ease-out'}}/>
   <path id="path3393" d="m14.5 36.75 5.625 1.875h2.625l4.875-2.375v9.125l-4.75 2.375-4.125-0.25-4.25-2.125v-8.625z" fill="url(#linearGradient3401)" fillRule="evenodd"/>
   <path id="path2609" transform="translate(-.67762 .3306)" d="m15.333 30.78c-7.4843-3.4891-10.727-12.395-7.2376-19.879 3.4891-7.4843 12.395-10.727 19.879-7.2376 7.4843 3.4891 10.727 12.395 7.2376 19.879-1.5382 3.2995-3.8683 5.6432-7.1589 7.2006l0.1461 14.331c-4.125 3.25-8.8666 2.875-12.867 0v-14.294z" fill="none" stroke="#000" strokeWidth="1.2"/>
   <path id="path3391" d="m27.5 45.375s6.125-0.75 8.375 1.125 1.125 3-1.75 3.25-11.5-1.25-11.5-1.25" fillRule="evenodd" filter="url(#filter3407)" opacity=".3"/>
   <path id="path3382" d="m27.411 42.362c-4.9053 3.4608-8.4916 2.9822-12.867 0" fill="none" stroke="#000" strokeWidth="1.2"/>
   <path id="path3384" d="m27.411 39.237c-4.9053 3.4608-8.4916 2.9822-12.867 0" fill="none" stroke="#000" strokeWidth="1.2"/>
   <path id="path3386" d="m27.411 36.3c-4.9053 3.4608-8.4916 2.9822-12.867 0" fill="none" stroke="#000" strokeWidth="1.2"/>
   <path id="rect3388" d="m23.5 48.102c0 0.4155-0.24085 0.75-0.54003 0.75h-3.5449c-0.29918 0-0.54003-0.3345-0.54003-0.75 1.4961 0.078934 3.2922 0.091081 4.625 0z" fill="none" stroke="#000" strokeWidth="1.2"/>
  </svg>
);

const LampSwitch = ({sc, configuration}) => (
  <svg  width="100%" height="100%" id="svg2" enableBackground="new 0 0 356.251 512" version="1.1" viewBox="0 0 356.25 512" xmlns="http://www.w3.org/2000/svg">
    <path id="path6" d="m178.39 100.6c9.886 0 17.973-8.088 17.973-17.965 0-9.965-8.087-17.965-17.973-17.965-9.965 0-18.053 8-18.053 17.965 0 9.877 8.088 17.965 18.053 17.965z" fill="#231f20"/>
    <path id="path8" d="m178.39 406.01c-9.965 0-18.053 7.991-18.053 17.965 0 9.877 8.088 17.965 18.053 17.965 9.886 0 17.973-8.088 17.973-17.965 0-9.974-8.086-17.965-17.973-17.965z" fill="#231f20"/>
    <path id="path10" d="m302.36 0h-248.46c-29.72 0-53.896 24.176-53.896 53.896v404.21c0 29.719 24.176 53.895 53.896 53.895h248.46c29.72 0 53.896-24.176 53.896-53.896v-404.21c-1e-3 -29.72-24.177-53.896-53.897-53.896zm35.931 458.1c0 19.817-16.114 35.93-35.93 35.93h-248.46c-19.812 0-35.93-16.114-35.93-35.93v-404.21c0-19.817 16.118-35.93 35.93-35.93h248.46c19.817 0 35.93 16.114 35.93 35.93v404.21z" fill="#231f20"/>
    <rect id="rect3019" x="131.8" y="148.61" width="91.119" height="203.93" rx="2.04" ry="1.875" fill="#231f20"/>
    <rect id="rect3032" transform="translate(-3.54e-6)" x="149.15" y="165.42" width="55.864" height="110.64" rx="2.04" ry="1.875" fillOpacity="0"/>
     <rect id="rect3034" transform={`translate(-3.54e-6, ${configuration && configuration[0] === 'on' ? 0 : 57})`} x="149.15" y="165.42" width="55.864" height="110.64" rx="2.04" ry="1.875" fill="#fff" style={{transition:'transform .5s ease-out'}} onClick={(e) => {e.stopPropagation(); e.preventDefault(); sc.gen('touch')}}/>
  </svg>
);


export default TutorialsIndex; 

