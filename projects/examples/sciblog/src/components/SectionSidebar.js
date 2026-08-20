import React from 'react'
import './SectionSidebar.css'

const SectionSidebar = ({ title, items }) => (
  <nav className="section-sidebar" aria-label={`${title} navigation`}>
    <h2 className="section-sidebar__title">{title}</h2>
    <ul className="section-sidebar__list">
      {items.map(item => (
        <li className="section-sidebar__item" key={item.href}>
          <a className="section-sidebar__link" href={item.href}>{item.label}</a>
          {
            item.items && item.items.length ?
              <ul className="section-sidebar__sublist">
                {item.items.map(child => (
                  <li className="section-sidebar__subitem" key={child.href}>
                    <a className="section-sidebar__sublink" href={child.href}>{child.label}</a>
                  </li>
                ))}
              </ul> :
              null
          }
        </li>
      ))}
    </ul>
  </nav>
)

export default SectionSidebar
