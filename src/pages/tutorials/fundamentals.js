import * as React from "react";
import TutorialPageWrapper from '../../components/TutorialPageWrapper'
import { LightSwitchExample, lampScxml } from './light-switch-example'
import { TwoButtonLightSwitchExample } from './two-button-lamp'
import Prism from 'prismjs'
import PrismCode from 'react-prism'
import SCHVIZ from '@jbeard/schviz2';
import { vampireScxml, VampireExample } from './vampire-example';

const Fundamentals = ({sectionName}) => (
  <div className="container">
  <h1>{sectionName}</h1>

<blockquote>
States. The final frontier. These are the voyages of an enterprising developer. Her eternal mission: to explore strange new techniques, to seek out better ways to engineer for mental models and new design patterns. To boldly go where a few awesome devs have gone before.
</blockquote>

<p>So you’ve found our poignant guide to SCXML and surely you’re wondering “Why should I want to go out of my way to use formal state machines?” or something like that. Hopefully this introduction addresses that kind of question.</p>

<h2> An example: Nancy’s RPG </h2>

<h3> The problem </h3>

<p>Nancy Drew is authoring a fantasy RPG, and some of the NPCs are vampires, for example. Vampires are complicated: if they’re alive, you can chop them to smithereens, but eventually they’ll come back; if they’re impaled by a wooden stake, that puts them in torpor; and if they’re alive or in fleshy smithereens or in torpor, and you burn them, they’ll die forever.</p>

<p>She wonders what the best way to represent those states of being are so that it can also scale. This has to run in the browser, so her options are limited. She likes React, but components’ <code>state</code> property is static. For vampires, <code>state</code> could have the values <code>intact</code>, <code>disabled</code>, <code>torpor</code>, or <code>dead</code>, though it’s the transitions between those states that are complex. Other agents will be able to change a vampire’s state, but only certain transitions between those states are valid.</p>

<p>Vampire components could have a <code>changeState</code> method, though for this use-case it becomes a complex dispatcher with one big <code>switch</code> block full of <code>if</code> blocks:</p>

<PrismCode component="pre" className="language-javascript">
{`
function changeState (action) {
  switch (action) {
    case DMG_THRESHOLD_STAKED:
      if(this.state === 'intact' || this.state === 'disabled'){
        this.state.set('torpor');
      }
      break;
    case DMG_THRESHOLD_DISABLED:
      if(this.state === 'intact') {
        this.state.set('disabled');
      }
      break;
    case HEAL_THRESHOLD_FULL:
      if(this.state === 'disabled' || this.state === 'torpor'){
        this.state.set('intact');
      }
      break;
    case DMG_THRESHOLD_BURNED:
      if(this.state === 'intact' || this.state === 'disabled' || this.state === 'torpor'){
        this.state.set('dead');
      }
      break;
  }
}
`}
</PrismCode>

<p>This, Nancy decides, (and for the sake of this tutorial,) is ugly. It won’t scale well if different states are introduced, and in general this pattern doesn’t represent the true, complex nature of a character’s abledness. She certainly doesn’t want to deal with dispatch trees like this when she needs to represent many different types of characters and their diverse states.</p>

<h3> Enter state machines </h3>

<p>A character’s status in general is more accurately represented by nested categories. Are they alive or dead? If they’re alive, can they move? If not, what will rehabilitate them? What kills an angel? A werewolf? An elf?</p>

<p>She decides state machines are the best way to represent these conditions. Since state machines interpret statecharts, and those can be represented both visually and in machine-readable SCXML she’ll have an easier time both designing and developing the different types of characters.</p>

<p>Instead of the ugly dispatch tree, the vampires’ conditions are represented by this SCXML document:</p>

<PrismCode component="pre" className="language-xml">
{vampireScxml}
</PrismCode>

<p>Nancy can visualize this in the following diagram:</p>

<div style={{height: '400px', width: '100%', position: 'relative'}}>
  <SCHVIZ 
    expandAllStatesByDefault={true}
    scxmlDocumentString={vampireScxml}
    disableAnimation={true}
    disableZoom={true}
    id="vampire"
    />
</div>

<p> Nancy can create a small environment to run the state machine, with buttons to send events as input, and pictures to illustrate the current state: </p>

<VampireExample />

<p>This, Nancy feels, is more elegant, scalable, and easier to read, talk about, and modify. It’s also event-driven, which gels well with the rest of the RPG which has, so far, been developed around events.</p>

<h2> So what are state machines good for? </h2>

<p>At this point you’re probably thinking “Alright, state machines work well for Nancy Drew’s problems, but will they work well for mine?” Good question.</p>

<p>‘State’ is a pretty good name for the phenomena SCXML can describe – when you’re developing software for discrete objects whose behaviors can be described in discrete groups, and those groups change depending on how the object is acted upon or what the object encounters, then you’re looking at an ideal use-case for statecharts.</p>

<p>Users are themselves complicated and stochastic, but they like it when their appliances and applications operate in simple, clearly defined ways. This applies to many facets of those appliances/applications: the way users interact with them, the way they provide feedback to the user, and the tasks they help the user accomplish.</p>

<p>All of that is a pretty abstract description, but you’ll find plenty of examples throughout this guide that should help illustrate how useful state machines can be.</p>

</div>
)


const WrappedFundamentals = ({location}) => (
  <TutorialPageWrapper Component={Fundamentals} pathname={location.pathname} />
);

export default WrappedFundamentals;
