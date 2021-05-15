import * as React from "react";
import TutorialPageWrapper from '../../components/TutorialPageWrapper'
import { HistoryExample } from '../../examples/history-example'

const Introduction = ({sectionName, by}) => (
  <div className="container">
  <h1>{sectionName}</h1>
  <h6>{by}</h6>

<p>The <code>initial</code> attribute/node is great for specifying a default internal state inside a compound state, but it falls short of one major scenario: resuming where it left off.</p>

<p>We have a lot of interaction scenarios where users essentially pause and resume the task at hand. Games, appliances, and UIs all often have this type of behavior, and it even manifests similarly.</p>

<p>Imagine we have a simple photo gallery app with three views: gallery (all-up), carousel (one-up), and a sharing modal where users can share the album at any time.</p>

<h2> <code>&lt;history&gt;</code>, a link to the past </h2>

<p>Since the app should return to whichever view it was in before the user invoked the modal, initial states aren’t enough. Instead, when the modal closes, we point to a history ‘state’, which is essentially a shortcut to the substate that was most recently active. That statechart looks like this:</p>

<HistoryExample />

<p>Since the interpreter always begins in the gallery, <code>&lt;history&gt;</code> will point there unless the user visited the carousel most recently.</p>

</div>
)

const WrappedIntroduction = ({location}) => (
  <TutorialPageWrapper Component={Introduction} pathname={location.pathname} />
);

export default WrappedIntroduction;


