import * as React from "react";
import TutorialPageWrapper from '../../components/TutorialPageWrapper'
import { DragAndDropExample } from '../../examples/drag-and-drop-example'

const Introduction = ({sectionName}) => (
  <div className="container">
  <h1>{sectionName}</h1>

<p>Until now, we’ve written SCXML that doesn’t actually do anything. In the real world, when you transition to a new state UI elements need to be hidden or shown, or the appliance needs to sing a song, or the simulated character needs to use a different sprite. This chapter is about doing those things in SCXML.</p>

<p>There are a few nodes that make this happen, and we’ll introduce more later.</p>

<h2> <code>&lt;datamodel&gt;</code> & <code>&lt;data&gt;</code>, and <code>&lt;assign&gt;</code> & <code>&lt;script&gt;</code> </h2>

<p>The <code>&lt;datamodel&gt;</code> node with its children the <code>&lt;data&gt;</code> nodes are used to define the namespaces the statechart can use to store information and functions. The statechart can then use <code>&lt;assign&gt;</code> nodes to give those namespaces values and <code>&lt;script&gt;</code> nodes to do something with those values.</p>

<p>In this example we’ll focus only on using <code>&lt;assign&gt;</code> and <code>&lt;script&gt;</code> nodes inside <code>&lt;transition&gt;</code> nodes, though later we’ll describe other ways they can be used.</p>

<p>Here’s a statechart that defines how the user can drag and drop an object:</p>

<DragAndDropExample />

<p>It’s important to mention that any scripting in SCXML is ECMAScript (a.k.a. JavaScript).</p>

<p><code>&lt;assign&gt;</code> uses two attributes, <code>location</code> and <code>expr</code>, which define *in which name* to store *what*, respectively. All <code>expr</code> attributes have to be expressions in ECMAScript, as if you were writing the right side of <code>position = …</code>. Notice here the <code>expr</code> attribute is used to define the initial value of the <code>"position"</code> <code>&lt;data&gt;</code> node as well as the values of both names in the <code>&lt;assign&gt;</code> nodes.</p>

<p>The SCXML interpreter makes one more namespace available to us, <code>_event</code>. When an event is fired on the interpreter, you can also pass a payload as <code>data</code> (which is accessed through <code>_event.data</code>), so in this case we expect <code>mousedown</code> and <code>mousemove</code> to come with a payload that has two properties, <code>x</code> and <code>y</code>, and we expect <code>mousedown</code> to also include <code>el</code>.</p>

</div>
)

const WrappedIntroduction = ({location}) => (
  <TutorialPageWrapper Component={Introduction} pathname={location.pathname} />
);

export default WrappedIntroduction;

