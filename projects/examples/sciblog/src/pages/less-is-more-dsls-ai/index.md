---
title: "Less Is More: DSLs in the Age of AI"
author: jacob-beard
date: 2026-06-26
template: article.jade
---

AI systems are very good at generating code, but that does not mean every
problem should be handed to them as an open-ended programming task. Sometimes
the most useful thing we can do is make the language smaller.

Domain-specific languages are valuable because they restrict what can be said.
That sounds like a limitation, but it is often the point. A DSL gives a system
designer a smaller semantic surface area: fewer constructs, fewer execution
paths, and fewer ways for an automated system to produce something that is
syntactically valid but behaviorally unbounded.

This is especially important in the age of AI.

## Limited semantics

General-purpose programming languages are powerful because they are
Turing-complete. That expressive power is useful, but it also means that many
interesting questions about a program cannot be answered in the general case.
The halting problem is the classic example: for arbitrary programs, there is no
general algorithm that can always decide whether the program will terminate.

DSLs can avoid some of that hardness by being less expressive. A restricted
state machine language, for example, may describe a system with finite states,
explicit transitions, and no arbitrary recursion or unbounded computation. In
that smaller world, some questions become tractable. You can ask whether a
state is reachable, whether a terminal state is guaranteed, or whether every
event path eventually exits a workflow.

The point is not that every state machine automatically solves termination. The
point is that a smaller language can make formal reasoning possible in places
where a general-purpose language would make it impossible or impractical.

For AI-generated systems, that matters. If an AI is asked to generate arbitrary
JavaScript, the result may be hard to analyze. If it is asked to generate a
state machine in a constrained DSL, the result can be checked against the DSL's
rules.

Less expressive power can mean more confidence.

## Specialized instrumentation

DSLs also make instrumentation easier. A runtime for a DSL can know what the
important events are because the language defines them.

With SCXML, the runtime can observe events, transitions, active states, entry
actions, exit actions, and datamodel changes. That telemetry is not an
afterthought. It is a natural consequence of the execution model.

That is why SCION tooling can trace a path through a system. A statechart is
already structured around the questions a developer wants to ask:

* What event happened?
* Which transition did it trigger?
* Which state did we leave?
* Which state did we enter?
* What data changed?
* Why did this path happen instead of another one?

The same program written as arbitrary application code may require custom
logging, conventions, or debugger work to reconstruct that path. A DSL runtime
can capture the path directly.

## Easier traces for AI

This also changes what an AI system has to understand.

An execution trace from a general-purpose program may include stack frames,
callbacks, promises, library internals, and application code all mixed
together. That can be useful, but it is noisy.

A statechart trace is closer to the domain model. It can say: event `submit`
caused transition `editing -> validating`, which entered `checkingServer`, then
event `done.invoke.validation` caused transition `checkingServer -> complete`.

That kind of trace is easier for a human to read, and it should be easier for
an AI to summarize, explain, compare, and debug. The trace is already expressed
in terms of states, events, transitions, and data. Those are the concepts the
system designer cares about.

## Smaller languages, stronger tools

The future of AI-assisted software will not only be better prompts for
general-purpose code generation. It will also be better languages.

A good DSL narrows the possible outputs, makes behavior easier to inspect, and
gives tools a reliable structure to build on. In that sense, "less is more" is
not just an aesthetic preference. It is an engineering strategy.

SCXML is one example of that strategy. It is not a replacement for ordinary
programming languages, and it should not try to be. Its value is that it gives
stateful behavior a constrained shape: events, states, transitions, actions,
and a defined execution semantics.

That constraint is what makes tooling possible. It is what makes traces
meaningful. And, increasingly, it may be what makes AI-generated behavior safe
enough to understand.
