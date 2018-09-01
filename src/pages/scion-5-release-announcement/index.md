---
title: SCION@5.0.0 Release Announcement
author: jacob-beard
date: 2018-08-27
template: article.jade
---

It has been my dream since a long time (2006!) to release a fully integrated framework for SCXML/Statecharts in JavaScript. What I mean by "fully integrated" is: you have model visualization, visual debugging, and basic language tools, such as linting. Everything that you need to do real work with SCXML/Statecharts in the JavaScript ecosystem.

When SCION started, it was basically a library implementing an interpreter/compiler for the SCXML standard in JavaScript, for node.js and the browser.

With the release of SCION@5.0.0, the scope of the project has expanded to be a complete system for developing SCXML in JavaScript. SCION is now a software _distribution_ which includes the following core libraries:

* runtime (scion-core)
* compiler (scxml)
* visualizer (schviz)
* linter (scharpie)

These core libraries are used in the following new developer tools:

* scion-cli: command-line tool based on Electron to visualize and lint scxml files
* scion-monitor: visual debugger for SCION
* scion-monitor-middleware: plugin for SCION that connects a SCION node or browser client to the scion-monitor
* : IDE Integrations for VSCode
* : Visual debugging with chrome devtools debugger (thanks to SCXML support for sourcemaps)

Finally, these libraries enable the development of online documentation (API docs, examples, and tutorials), which is important for an open source software ecosystem to thrive. Some of these tuturials which can be seen [here](). I hope that opening these tools to the community will allow people to develop and contribute their own tutorials.

Today I am starting to release this new work, which should be considered beta, but useable. Please give it a try and send feedback.

## Overview

### Support for Debugging SCXML with Chrome DevTools 

scxml is a compiler. Generates js source code, which is then executed to produce a "model" object. 

Plugin to add support for generation of source maps. A visual JavaScript debugger, like Chrome DevTools, can read the sourcemap and allow you to set breakpoints in the SCXML source file. This works in Node.js and the Browser. Here is a vide of it in action.

<video - node>

<video - browser>

## Creating a sustainable future for SCION

I am seeking an economic engine to sustain and fund the ongoing development of SCION.

When I created SCION in 2012, I was a student living in Kingston, Ontario. I started SCION as a research project toward the completion of my master's thesis.

Today, I live in Manhattan. In the USA, money is like oxygen &mdash; you need it to live. 

I make a living through consulting, typically building custom business applications for enterprises. SCION has had a lot to do with my success. Every project I have worked on has come through a direct referral. People have discovered SCION, and then sometimes years later, they remember me and reach out about a job opportunity. The indirect economic benefits of maintaining an open source project are real and significant.

Still, there are problems with this model. While consulting, I bill by the hour, and every minute I spend working on a client project is a minute I am not able to work on SCION. Likewise, every minute I spend working on SCION is a billable hour I am missing. This is a consequence of working on a purely voluntary basis.

Another problem is that some consulting contracts make it difficult to work on outside OSS projects. And then it really is a choice between consulting and working on SCION.

I continue working on SCION because I enjoy it. It’s a labor of love. I like thinking about how to create a more perfect, complete implementation of the standard, which fits more developer use cases. I love putting it into the hands of developers and seeing what they will build. But the current model is not one which is sustainable, and I am therefore seeking a different model to sustainably fund SCION.

### License Evolution

tl;dr: ___SCION is fully Open Source Software. The license policy is: the core engine (SCXML and SCION-CORE modules) will remain Apache-2.0; and the new development tools will be RPL-1.5 (SCHVIZ), unless they are forked from an existing project (SCHARPIE), in which case they will have the same license as the project they were forked from.___

<Table of modules and licenses.>

If you need a commercial license for any of the RPL’d developer tools, please reach out to me at [jake@jacobeanrnd.com](mailto:jake@jacobeanrnd.com).

I have thought a lot about this licensing scheme, and wanted to share my thoughts on how I arrived here.

### Funding Models

There are many different ways to make money from open source software.

One way is through donations. I created a project on [OpenCollective](https://opencollective.com/SCION#) in June, and so far have received $1,150 in donations from two backers. I am extremely grateful for this support, and plan to invest this money back into the project. But donations are rarely a business model for sustainable development. Typically, only the most popular open source software projects can sustain development in this way. 

Another way is through consulting for companies that do work related to SCION. Some companies have reached out for support, but the opportunity to do paid consulting work on SCION has never succeeded. I think that sometimes this is because the company is very large, and they have their own internal team of engineers, and would rather do the work entirely in-house. Or the company may be very small, and don't have the resources to pay for a consultant. It could also be because I spend most of my time talking to engineers within a company, who do not themselves have purchasing power or the ability to execute contracts. 

At the same time, some companies have adopted SCION and are using it successfully to run their applications. They have even made significant code contributions back to the project. I am grateful for these contributions. But these contributions have also created more work for me, as I need to maintain them when I add additional features to SCION going forward. Thus, they do not solve the problem of finding a funding model to sustain ongoing development.

A third approach to sustainable funding is through choosing an open source license that compells businesses to pay for a commercial license if they are using the software in closed-source applications. This is known as "dual-licensing", and is the model that I have chosen for the developer tools in SCION@5.0.0. It feels the most fair to me. I think that if you are a $250mm corporation, and you are using SCION to bring in a nontrivial percentage of revenue, it is reasonable to request a few dollars to help pay for maintenance of that software infrastructure.

The challenge has been figuring how to ask large enterprises to pay for a license, without alienating the community of open source software developers, of which I consider myself a part.

I have decided to license the new developer tools under the Reciprocal Public License, version 1.5 (RPL-1.5). The RPL-1.5 is an open source software license approved by the Open Source Initiative. It is similar to the GPL, in that it is a strong copyleft license: if you use it with proprietary code, the license says that you have to open source that code. Unlike the GPL, the copyleft provision is invoked on any code that is “deployed”, rather than code that is “distributed” to end-users. This means that if you use RPL code on a server, in a proprietary SAAS application, you must open source that SAAS application, or request a commercial license. It also means that it should be fine to use the new RPL’d developer tools in the following scenarios: writing a set of tutorials which you release on Github; you are at university, and use it for research purposes (the license explicitly says that research and personal use is OK); or you are using the tools in development. It is only when you are deploying the code as part of a production application for non-personal, non-research use that the reciprocal license gets invoked. (Also, please note that I am not a lawyer. This is based on my imperfect understanding, having read the license.)

This is license “evolution”, rather than “revolution”, because the parts of the project that have been licensed as Apache-2.0 will continue to do so. If you are upgrading an existing application to the latest versions of SCION and SCION-CORE, you should be able to do so without needing to worry about license changes. Only the new components will be published under a different license. The new components are not necessary to build applications based on SCION, but I believe they will help developers a lot.

### Pricing

The cost structure of commercial licenses is to be determined. For inquiries around commercial licensing, please reach out to me at [jake@jacobeanrnd.com](mailto:jake@jacobeanrnd.com).


### Concerns around Contributions

My main concern is about how this will impact SCION's ability to build a community. For example, consider this tweet by @mikeal:

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">With dual licensing you either can&#39;t take external contributions or you have to require they sign over the IP.<br><br>It makes the original intention of Free Software, building a community, effectively impossible.<br><br>It&#39;s just freemium proprietary software at that point.</p>&mdash; Mikeal Rogers (@mikeal) <a href="https://twitter.com/mikeal/status/1032391259992682497?ref_src=twsrc%5Etfw">August 22, 2018</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>


It's true that contributors to SCION will need to sign a Contributor License Agreement where they assign their copyright to Jacobean Research and Development. Contributions to scion-core and scxml have historically not required users to assign their copyright to the project. I am concerned that this will create a barrier for new contributors. 

If you want to contribute to SCION, and you have concerns about licensing, please reach out to me on Gitter, or at [jake@jacobeanrnd.com](mailto:jake@jacobeanrnd.com), or leave a comment on this website. I look forward to having these conversations.

## Next steps

Source code for these projects can be found on Github at a new organization [SCION-SCXML](https://github.com/SCION-SCXML).

I will be publishing examples, documentation, and tutorials illustrating their use over the coming weeks.
