import React from 'react'

const LampBulbFill = ({configuration}) => (
  <path
    fillOpacity={configuration && configuration[0] === 'on' ? 0.7 : 0} 
    d="m27.1 30.824c7.2231-3.3965 10.352-12.066 6.9851-19.352-3.3674-7.2857-11.963-10.442-19.186-7.0455-7.2231 3.3965-10.352 12.066-6.9851 19.352 1.4846 3.212 3.7334 5.4935 6.9091 7.0095l-0.1362-0.10018-0.5 5.75 5.375 2.375 3.5-0.125 3.875-2 0.16283-5.8638z" 
    fill="url(#radialGradient3003)" 
    fillRule="evenodd" 
    style={{transition:'fill-opacity .5s ease-out'}}
    />
)

const LampBulb = ({configuration}) => (
  <svg version="1.0" viewBox="0 0 44 54" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
  <defs id="defs2601">
    <linearGradient id="linearGradient3401" x1="14.5" x2="27.625" y1="42" y2="42" gradientUnits="userSpaceOnUse">
      <stop stopColor="#fff" offset="0"/>
      <stop stopColor="#e3e3e3" offset=".5"/>
      <stop offset="1"/>
    </linearGradient>
    <filter id="filter3407" x="-.078906" y="-.25042" width="1.1578" height="1.5008">
      <feGaussianBlur id="feGaussianBlur3409" stdDeviation="0.47487807"/>
    </filter>
    <radialGradient id="radialGradient3003" cx="17.922" cy="16.813" r="14.44" gradientTransform="matrix(1 0 0 1.238 .25 -4.8279)" gradientUnits="userSpaceOnUse">
      <stop stopColor="#fff" offset="0"/>
      <stop stopColor="#ffdc00" offset="1"/>
    </radialGradient>
  </defs>
  <LampBulbFill configuration={configuration} />
  <path d="m14.5 36.75 5.625 1.875h2.625l4.875-2.375v9.125l-4.75 2.375-4.125-0.25-4.25-2.125v-8.625z" fill="url(#linearGradient3401)" fillRule="evenodd"/>
  <path transform="translate(-.67762 .3306)" d="m15.333 30.78c-7.4843-3.4891-10.727-12.395-7.2376-19.879 3.4891-7.4843 12.395-10.727 19.879-7.2376 7.4843 3.4891 10.727 12.395 7.2376 19.879-1.5382 3.2995-3.8683 5.6432-7.1589 7.2006l0.1461 14.331c-4.125 3.25-8.8666 2.875-12.867 0v-14.294z" fill="none" stroke="#000" strokeWidth="1.2"/>
  <path d="m27.5 45.375s6.125-0.75 8.375 1.125 1.125 3-1.75 3.25-11.5-1.25-11.5-1.25" fillRule="evenodd" filter="url(#filter3407)" opacity=".3"/>
  <path d="m27.411 42.362c-4.9053 3.4608-8.4916 2.9822-12.867 0" fill="none" stroke="#000" strokeWidth="1.2"/>
  <path d="m27.411 39.237c-4.9053 3.4608-8.4916 2.9822-12.867 0" fill="none" stroke="#000" strokeWidth="1.2"/>
  <path d="m27.411 36.3c-4.9053 3.4608-8.4916 2.9822-12.867 0" fill="none" stroke="#000" strokeWidth="1.2"/>
  <path d="m23.5 48.102c0 0.4155-0.24085 0.75-0.54003 0.75h-3.5449c-0.29918 0-0.54003-0.3345-0.54003-0.75 1.4961 0.078934 3.2922 0.091081 4.625 0z" fill="none" stroke="#000" strokeWidth="1.2"/>
  </svg>
);

export default LampBulb; 
