import * as React from "react";
import PrismCode from 'react-prism';
import TutorialPageWrapper from '../../components/TutorialPageWrapper'
import MicrowaveExample from '../../examples/microwave-example'
import microwaveScxml1 from '../../examples/microwave-example/microwave1.scxml';
import microwaveScxml2 from '../../examples/microwave-example/microwave2.scxml';
import microwaveScxml3 from '../../examples/microwave-example/microwave3.scxml';
import { ToggleableSchviz } from '../../examples/common'

const Introduction = ({sectionName, by}) => (
  <div className="container">
  <h1>{sectionName}</h1>
  <h6>{by}</h6>

<p>You might have noticed in the introduction our example included <code>&lt;state&gt;</code> nodes nested inside of other <code>&lt;state&gt;</code> nodes. A <code>&lt;state&gt;</code> node that has child states is known as a <strong>compound state</strong>.</p>

<p>Compound states are immensely useful. They’re a fantastic means of specifying that a group of states are themselves a state out of which a transition is possible. As in the vampire example: it doesn’t matter if the character is intact, in smithereens, or even in torpor; if the character is burned then the character dies.</p>

<p>The tricky bit is this: if the character were reconstituted from the ashes, what state would he be in? Intact? Torpor? If we were to add <code>&lt;transition event="reconstituted" target="alive"/&gt;</code> inside the <code>dead</code> state, it’s not clear.</p>

<p>There are two ways around this problem: always specify non-compound states (‘simple’ states) as transition targets, or specify an <code>initial</code> state for compound states. If you want your project to scale and you don’t have a specific reason not to point to an initial state, we think you should do the latter.</p>

<h2> <code>@initial</code>, <code>&lt;initial&gt;</code>, or first child </h2>

<p>The SCXML standard is extremely consistent everywhere but here. Such is the way of a W3C standard, but that’s part of W3C’s strange beauty. You can specify the first sub-state to go to in a compound state in one of three ways: </p>

<ul>
  <li> an <code>initial</code> attribute on the compound state, or </li>
  <li> an <code>&lt;initial&gt;</code> node with a single <code>&lt;transition target="…"&gt;</code> child, or </li>
  <li> if neither an initial attribute nor <code>&lt;initial&gt;</code> node are specified in the compound state, then the first child state will be the initial state </li>
</ul>

<p>Here are three statecharts for a microwave that use compound states to describe how the microwave behaves when it’s plugged in:</p>

<h6> <code>@initial</code> </h6>

<ToggleableSchviz scxmlDocumentString={microwaveScxml1} id="microwave1" />

<h6> <code>&lt;initial&gt;</code> </h6>

<ToggleableSchviz scxmlDocumentString={microwaveScxml2} id="microwave2" />

<h6> First child state </h6>

<ToggleableSchviz scxmlDocumentString={microwaveScxml3} id="microwave3" />

<h6> Example </h6>

<p>This example uses <code>&lt;initial&gt;</code>:</p>

<MicrowaveExample microwaveScxml={microwaveScxml2} />

<p>Naturally you wouldn’t want a microwave that’s lost power to just keep cooking the moment it’s plugged in again, so we’ve specified <code>"idle"</code> as the state to go to once it’s plugged in.</p>

<p>The <code>initial</code> attribute occupies less space and is arguably more straightforward, especially since you’re not actually allowed to do anything else with the <code>&lt;transition&gt;</code> inside <code>&lt;initial&gt;</code>, but as long as you only use one of these two syntaxes you can decide for yourself which to use.</p>

<p>Using <code>initial</code> or <code>&lt;initial&gt;</code>, you can specify compound interactions that have a default starting point. Later, we’ll introduce a few other ways to jump to a state inside a compound state too, but now you have the tools you need to create a huge range of state machines.</p>

</div>
)

const WrappedIntroduction = ({location}) => (
  <TutorialPageWrapper Component={Introduction} pathname={location.pathname} />
);

export default WrappedIntroduction;
