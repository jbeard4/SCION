---
title: SCION@5.0.0 Release Announcement
author: jacob-beard
date: 2018-09-21
template: article.jade
---

__Disclaimer__: If you are a new to programming with SCXML or SCION, please check out the [tutorials](/tutorials/fundamentals), which provide a gentle introduction to these topics. This blog post is written with an audience of existing users in mind, and is somewhat advanced.

## Introduction

__tl;dr This release of SCION includes new libraries which enable tools for advanced debugging, as well as the development of better online documentation (API docs, examples, and tutorials).__

When SCION started, it was basically a library implementing an interpreter/compiler for the SCXML standard in JavaScript, for node.js and the browser.

With the release of SCION@5.0.0, the scope of the project has expanded to be a complete system for developing SCXML in JavaScript. SCION is now a software _distribution_ which includes the following core libraries:

* interpreter ([core](https://www.npmjs.com/package/@scion-scxml/core))
* compiler ([scxml](https://www.npmjs.com/package/@scion-scxml/scxml))
* visualizer ([schviz](https://www.npmjs.com/package/@scion-scxml/schviz))
* linter ([scharpie](https://www.npmjs.com/package/@scion-scxml/scharpie))

These core libraries enable advanced debugging, as well as the development of better online documentation (API docs, examples, and tutorials). This is facilitated through the following new developer tools.

## SCION DevTools Overview

### Online documentation

There has been a dearth of learning resources for SCXML. Online documention (API docs, examples, and tutorials) is essential to enabling an open software ecosystem to flourish, and SCION attempts to provide libraries to facilitate the creation of this documentation. 

To start this off, you can find some tutorials written by my friend [@thure](http://github.com/thure) [here](/tutorials/fundamentals).  More examples will be forthcoming, and __I hope that opening these libraries to the community will allow people to develop and contribute their own online tutorials__.

### CLI tool

The SCION command-line tool allows you to visualize, lint, compile and interactively run SCXML files. You can also monitor SCXML sessions using the new monitor tool, described in the section below. 

You can install the CLI tool with `npm install -g @scion-scxml/cli`, and run it with command `scion`.

You can see an example of this in the video below:

<iframe width="560" height="315" src="https://www.youtube.com/embed/GbP3_b8GVbM" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

### Graphical debugging

The new [__sourcemap-plugin__](https://www.npmjs.com/package/@scion-scxml/sourcemap-plugin) module adds support for generating source maps to the SCION compiler. This enables a visual JavaScript debugger, like Chrome DevTools or VSCode, to read the sourcemap, set breakpoints in the SCXML source file, and inspect the SCXML datamodel. This works in Node.js and the Browser. 

Additionally, SCION includes a new [__monitor__](https://www.npmjs.com/package/@scion-scxml/monitor-middleware) utility, which provides a user interface to view a log of events processed by the state machine, and display debugging information, such as the datamodel, inner event queue, and session hierarchy, to visualize how the state changes over time.

Here is a video of these features in action:

<iframe width="560" height="315" src="https://www.youtube.com/embed/Pg9tYuJN6BI" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

### Visual Studio Code Integrations 

SCION integrates with the Visual Studio Code (VSCode) IDE in the following ways:
* linting, using VSCode's built-in support for eslint, and the eslint-plugin-scharpie package for linting SCXML
* visualization, using the new @scion-scxml/vscode-preview VSCode extension
* graphical debugging, using VSCode's built-in JavaScript debugger, and the new SCION sourcemap-plugin mentioned above.

You can see an example of this in the following video:

<iframe width="480" height="270" src="https://www.youtube.com/embed/G7ADiXTP-LM" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

## Creating a sustainable future for SCION

I am seeking an economic engine to sustain and fund the ongoing development of SCION.

I started SCION in 2011 as a research project toward the completion of my master’s thesis. When I created SCION, I was a student living in Kingston, Ontario, where cost of living was more affordable. 

In the USA, money is like oxygen — you need it to live. I make a living through consulting, typically building custom business applications for enterprises. SCION has had a lot to do with my success. Every project I have worked on has come through a direct referral. People have discovered SCION, and then sometimes years later, they remember me and reach out about a job opportunity. The indirect economic benefits of maintaining an open source project are real and significant.

Still, there are problems with this model. While consulting, I bill by the hour, and every minute I spend working on a client project is a minute I am not able to work on SCION. Likewise, every minute I spend working on SCION is a billable hour I am missing. This is a consequence of working on a purely voluntary basis.

Another problem is that some consulting contracts make it difficult to work on outside OSS projects, and then, it really is a choice between consulting or working on SCION.

I continue to work on SCION because I enjoy it. It’s a labor of love. I like thinking about how to create a more perfect, complete implementation of the SCXML standard, which fits more developer use cases. I love putting it into the hands of developers and seeing what they build. Even so, the current model is not one which is sustainable, and I am therefore seeking a different model to sustainably fund SCION.

### License Evolution

tl;dr the SCION license policy is as follows: 

* the core engine will remain Apache-2.0 (e.g., the scxml and core modules)
* if the module is forked from an existing project, then that module will have the same license as the project from which it was forked (e.g. eslint-plugin-scharpie) 
* the new development tools will be LicenseZero Parity 3.0 (e.g. the schviz module)
* finally, SCXML tutorials and examples will be released as Apache-2.0

Here is a complete list of all modules and their associated licenses at the time of this writing (note that all of the package names are prefixed with the @scion-scxml/ organization name):

<p>
<div style="height: 20em; overflow-y: scroll">
<table class="table table-striped">
  <thead>
    <th>
      Package name
    </th>
    <th>
      License
    </th>
    <th>
      Description
    </th>
    <th>
      Forked from
    </th>
  </thead>
  <tbody>
    <tr>
      <td  colspan="4" style="text-align:center; font-weight:bold"> Libraries </td>
    </tr>
    <tr><td> <a href="https://gitlab.com/scion-scxml/eslint"> eslint </a></td><td> MIT </td><td> An AST-based pattern checker for JavaScript. </td><td> <a href="https://github.com/eslint/eslint"> eslint/eslint </a> </td></tr>
    <tr><td> <a href="https://gitlab.com/scion-scxml/jsondiffpatch"> jsondiffpatch </a></td><td> MIT </td><td> Diff & Patch for Javascript objects </td><td> <a href="https://github.com/benjamine/jsondiffpatch"> benjamine/jsondiffpatch </a> </td></tr>
    <tr><td> <a href="https://gitlab.com/scion-scxml/sax-js"> sax-js </a></td><td> ISC </td><td> An evented streaming XML parser in JavaScript </td><td> <a href="https://github.com/isaacs/sax-js"> isaacs/sax-js </a> </td></tr>
    <tr><td> <a href="https://gitlab.com/scion-scxml/xmllint"> xmllint </a></td><td> MIT </td><td> Port of libxml to JavaScript using Emscripten </td><td> <a href="https://github.com/kripken/xml.js"> kripken/xml </a> </td></tr>
    <tr><td> <a href="https://gitlab.com/scion-scxml/react-collapsible"> react-collapsible </a></td><td> MIT </td><td> React component to wrap content in Collapsible element with trigger to open and close. </td><td> <a href="https://github.com/glennflanagan/react-collapsible"> glennflanagan/react </a> </td></tr>
    <tr><td> <a href="https://gitlab.com/scion-scxml/react-codemirror"> react-codemirror </a></td><td> MIT </td><td> Codemirror </td><td> <a href="https://github.com/JedWatson/react-codemirror"> JedWatson/react-codemirror </a> </td></tr>
    <tr><td> <a href="https://gitlab.com/scion-scxml/vm-browserify"> vm-browserify </a></td><td> MIT </td><td> vm module for the browser </td><td> <a href="http://github.com/substack/vm-browserify"> substack/vm </a> </td></tr>
    <tr><td> <a href="https://gitlab.com/scion-scxml/botbuilder-common-scxml-components"> botbuilder-common-scxml-components </a></td><td> MIT </td><td> A set of scripts to help integrate SCION with the Microsoft Botbuilder framework - to be included from within a &lt;script&gt; tag inside of an SCXML file </td><td>  </td></tr>
    <tr><td> <a href="https://gitlab.com/scion-scxml/botbuilder-common"> botbuilder-common </a></td><td> MIT </td><td> A set of scripts to help integrate SCION with the Microsoft Botbuilder framework </td><td>  </td></tr>
    <tr><td> <a href="https://gitlab.com/scion-scxml/core-base"> core-base </a></td><td> Apache-2.0 </td><td> Provide BaseInterpreter class and helper functions to modules that implement Statechart interface. </td><td>  </td></tr>
    <tr><td> <a href="https://gitlab.com/scion-scxml/core-legacy"> core-legacy </a></td><td> Apache-2.0 </td><td> Legacy semantics for SCION Statecharts </td><td> </td></tr>
    <tr><td> <a href="https://gitlab.com/scion-scxml/core-test-framework"> core-test-framework </a></td><td> Apache-2.0 </td><td> Test harness for modules that implement scion.Statechart interface. </td><td>  </td></tr>
    <tr><td> <a href="https://gitlab.com/scion-scxml/scxml"> scxml </a></td><td> Apache-2.0 </td><td> An implementation of SCXML in JavaScript. </td><td> <a href="https://github.com/jbeard4/SCION"> jbeard4/SCION </a> </td></tr>
    <tr><td> <a href="https://gitlab.com/scion-scxml/schviz-test-framework"> schviz-test-framework </a></td><td> Apache-2.0 </td><td> Test framework for SCHVIZ </td><td>  </td></tr>
    <tr><td> <a href="https://gitlab.com/scion-scxml/test-framework"> test-framework </a></td><td> Apache-2.0 </td><td> A set of SCXML tests, and an HTTP client test runner for testing against SCXML HTTP test servers. </td><td> <a href="https://github.com/jbeard4/scxml-test-framework"> jbeard4/scxml-test-framework </a> </td></tr>
    <tr><td> <a href="https://gitlab.com/scion-scxml/core"> core </a></td><td> Apache-2.0 </td><td> StateCharts Interpretation and Optimization eNgine (SCION) CORE is an implementation of Statecharts in JavaScript. </td><td> <a href="https://github.com/jbeard4/SCION-CORE"> jbeard4/SCION-CORE </a> </td></tr>
    <tr><td> <a href="https://gitlab.com/scion-scxml/scharpie"> scharpie </a></td><td> Apache-2.0 </td><td> Validate SCXML against the official W3C SCXML XML schema </td><td>  </td></tr>
    <tr><td> <a href="https://gitlab.com/scion-scxml/sourcemap-plugin"> sourcemap-plugin </a></td><td> L0-Parity-3.0 </td><td> SCION compiler plugin that adds support for generation of sourcemaps </td><td>  </td></tr>
    <tr><td> <a href="https://gitlab.com/scion-scxml/schviz"> schviz </a></td><td> L0-Parity-3.0 </td><td> SCXML visualization library </td><td>  </td></tr>
    <tr><td> <a href="https://gitlab.com/scion-scxml/dashboard"> dashboard </a></td><td> L0-Parity-3.0 </td><td> Web dashboard for SCION monitor </td><td>  </td></tr>
    <tr><td> <a href="https://gitlab.com/scion-scxml/monitor-middleware"> monitor-middleware </a></td><td> L0-Parity-3.0 </td><td> SCION monitor server </td><td>  </td></tr>
  </tbody>
  <tbody>
    <tr>
      <td  colspan="4" style="text-align:center; font-weight:bold"> Develper Tools </td>
    </tr>
    <tr><td> <a href="https://gitlab.com/scion-scxml/eslint-plugin-scharpie"> eslint-plugin-scharpie </a></td><td> ISC </td><td> A ESLint plugin to lint and fix inline scripts contained in SCXML files. </td><td> <a href="https://github.com/BenoitZugmeyer/eslint-plugin-html"> BenoitZugmeyer/eslint-plugin-html </a> </td></tr>
    <tr><td> <a href="https://gitlab.com/scion-scxml/redux-devtools-scion-monitor"> redux-devtools-scion-monitor </a></td><td> MIT </td><td> Redux monitor that adds support for visualization of SCXML model </td><td> <a href="https://github.com/gaearon/redux-devtools-log-monitor"> gaearon/redux-devtools-log-monitor </a> </td></tr>
    <tr><td> <a href="https://gitlab.com/scion-scxml/vscode-preview"> vscode-preview </a></td><td> MIT </td><td> Visual Studio Code extension to preview SCXML files. </td><td> <a href="https://github.com/EFanZh/Graphviz-Preview"> EFanZh/Graphviz </a> </td></tr>
    <tr><td> <a href="https://gitlab.com/scion-scxml/debug"> debug </a></td><td> L0-Parity-3.0 </td><td> Drop-in replacement for the scxml compiler module, that automatically enables the sourcemap-plugin and monitor client </td><td>  </td></tr>
    <tr><td> cli </td><td> L0-Parity-3.0 </td><td> A command-line interface to SCION </td><td>  </td></tr>
  </tbody>
  <tbody>
    <tr>
      <td colspan="4" style="text-align:center; font-weight:bold"> Examples </td>
    </tr>
    <tr><td> test-scharpie </td><td> ISC </td><td> Tests for scharpie (SCXML linter) </td><td> </td></tr>
    <tr><td> <a href="https://gitlab.com/scion-scxml/sciblog"> sciblog </a></td><td> MIT </td><td> Source code to website hosted at <a href="http://scion.scxml.io"> scion.scxml.io </a> </td><td> <a href="https://github.com/noahg/gatsby-starter-blog-no-styles"> noahg/gatsby </a> </td></tr>
    <tr><td> <a href="https://gitlab.com/scion-scxml/example-botbuilder"> botbuilder-sample-firstrun </a></td><td> MIT </td><td> Example of SCION Botbuilder integration, based on the botbuilder-sample-firstrun example </td><td>  </td></tr>
    <tr><td> <a href="https://gitlab.com/scion-scxml/example-botbuilder"> basics-menus </a></td><td> MIT </td><td> Example of SCION Botbuilder integration, based on the botbuilder-basics-menus example </td><td>  </td></tr>
    <tr><td> <a href="https://gitlab.com/scion-scxml/example-botbuilder"> botbuilder-hello-chatconnector </a></td><td> MIT </td><td> Example of SCION Botbuilder integration, based on the botbuilder-hello-chatconnector example </td><td>  </td></tr>
    <tr><td> <a href="https://gitlab.com/scion-scxml/example-botbuilder"> basics-multiturn </a></td><td> MIT </td><td> Example of SCION Botbuilder integration, based on the botbuilder-basics-multiturn example </td><td>  </td></tr>
    <tr><td> <a href="https://gitlab.com/scion-scxml/example-react-redux"> drag-and-drop-redux </a></td><td> Apache-2.0 </td><td> Redux integration example </td><td>  </td></tr>
    <tr><td> <a href="https://gitlab.com/scion-scxml/example-react-redux"> drag-and-drop-redux-with-devtools </a></td><td> Apache-2.0 </td><td> Redux integration example that includes redux devtools, as well as the redux-devtools-scion-monitor </td><td>  </td></tr>
    <tr><td> <a href="https://gitlab.com/scion-scxml/example-universal-morse-input-output"> umio </a></td><td> Apache-2.0 </td><td> Morse code parser implemented in SCXML </td><td> <a href="https://github.com/jbeard4/scxml-morse-input-out"> jbeard4/scxml-morse-input-out </a> </td></tr>
    <tr><td> <a href="https://gitlab.com/scion-scxml/example-vi"> vi-everywhere </a></td><td> Apache-2.0 </td><td> This is a project to create an executable model of the behaviour of the vi text editor using Statecharts. An SVG-based editing environment is also provided as a reference implementation of a scriptable editing environment. </td><td> <a href="https://github.com/jbeard4/vi-everywhere"> jbeard4/vi-everywhere </a>  </td></tr>
  </tbody>
</table>
</div>
</p>

I have thought a lot about this licensing scheme, and wanted to share my thoughts on how I arrived here.

### Funding Models

There are many different ways to make money from open source software.

One way is through donations. I created a project on [OpenCollective](https://opencollective.com/SCION#) in June, and so far have received $1,150 in donations from two backers. I am _extremely_ grateful for this support, and plan to invest this money back into the project. But donations are rarely a business model for sustainable development. Typically, only the most popular open source software projects can sustain development in this way. 

Another approach is through consulting for companies that do work related to SCION. Some companies have reached out for support, but the opportunity to do paid consulting work on SCION has never succeeded. I think that sometimes this is because the company is very large, and they have their own internal team of engineers, and would rather do the work entirely in-house. Or the company may be very small, and doesn't have the resources to pay for a consultant. It could also be because I spend most of my time talking to engineers within a company, who do not themselves have purchasing power or the ability to execute contracts. 

At the same time, some companies have adopted SCION and are using it successfully to run their applications. They have even made significant code contributions back to the project. I am grateful for these contributions. But these contributions have also created more work for me, as I need to test and maintain them when I add additional features to SCION going forward. Thus, they do not solve the problem of finding a funding model to sustain ongoing development.

A third approach to sustainable funding is through "dual licensing". This entails choosing an open source license that compels businesses to pay for a commercial license if they are using the software to develop closed-source applications. This is the model that I have chosen for the developer tools in the latest version of SCION, as this approach feels the most fair to me. If you are a $250-million corporation, and you are using SCION to develop closed applications which bring in a modicum of revenue, it is reasonable to request a few dollars to help pay for maintenance of that software infrastructure.

The challenge has been figuring how to ask large enterprises to pay for a license, without alienating the community of open source software developers, of which I consider myself a part.

I have decided to license the new developer tools under the LicenseZero Parity license, version 3.0. Parity is a public software license which is similar to the GNU Public License (GPL), in that if you use it to develop new software, the license says that you have to open source that code, or purchase a private license. I like this license because it is short, simple, expansive, and fair. Also, LicenseZero makes it convenient to purchase a private license through its command-line tool, or on its website. You can find more information about the LicenseZero Parity License [here](https://guide.licensezero.com/#public-licenses). 

I call this approach license “evolution”, rather than “revolution”, because the parts of the project that have been licensed as Apache-2.0 will continue to be published under the same license. If you are upgrading an existing application to the latest versions of SCION and SCION-CORE, you should be able to do so without needing to worry about the Parity license. Only the new SCION DevTools modules will be published under Parity. The new SCION DevTools are not necessary to build applications based on SCION, but I believe they will help developers a great deal.

### Concerns Around Contributions

My main concern is about how this will impact SCION's ability to build a community. For example, consider this tweet by @mikeal:

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">With dual licensing you either can&#39;t take external contributions or you have to require they sign over the IP.<br><br>It makes the original intention of Free Software, building a community, effectively impossible.<br><br>It&#39;s just freemium proprietary software at that point.</p>&mdash; Mikeal Rogers (@mikeal) <a href="https://twitter.com/mikeal/status/1032391259992682497?ref_src=twsrc%5Etfw">August 22, 2018</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>


It's true that contributors to SCION will now need to sign a Contributor License Agreement where they assign their copyright to Jacobean Research and Development. Contributions to SCION have historically not required users to assign their copyright to the project. _I am concerned that this will create a barrier for new contributors._ 

If you want to contribute to SCION, and you have concerns about licensing, please reach out to me on Gitter, or at [jake@jacobeanrnd.com](mailto:jake@jacobeanrnd.com), or leave a comment on this website. I sincerely look forward to having these conversations.

## Intention to migrate from Github to Gitlab

Last, I wanted to mention my intention to migrate from Github to Gitlab for hosting the SCION source code. Source code will be made available on Gitlab at a new organization [SCION-SCXML](https://gitlab.com/SCION-SCXML).

I intend to do this to protest Microsoft's (who recently purchased Github) contract with United States Immigration and Customs Enforcement (ICE). I signed a [petition](https://github.com/selfagency/microsoft-drop-ice) to this effect, and I have thought a lot about this in the months since.

On the one hand, I am not opposed to using Microsoft's open source technologies. I use a lot of it in SCION, for example integrating with the MS Botbuilder framework and VSCode IDE.  Also, I don't have any illusion that my action, as an individual developer, will have any effect on Microsoft's decision-making. It's only when it looks like the cost to Microsoft outweighs the benefit that any action will be taken. And Microsoft does a lot of business with the US government, so this will likely require a sea change among developers before they start to take notice.

On the other hand, software is speech, and I feel that, as a developer born in the US, I have a moral and ethical responsibility to use my voice to protest what I see as abuses committed by my government. Separating infant children from their parents for misdemeanor crimes, and detaining them indefinitely in cages, potentially causing permanent psychological trauma, is an abuse of power.

Github is a de facto standard platform for open source software development. Moving SCION to Gitlab will create some friction for SCION's users and contributors, and violate the principle of least surprise for new users. Normally, that is the opposite of what is desirable for an open source project, but in this case, it is the point. I want users and developers to momentarily consider the relationship between Microsoft and ICE, because the situation with ICE separating child immigrants from their parents and detaining them indefinitely is not normal, or acceptable, or business as usual. Anything that I can do to draw attention to this, and prevent it from becoming normalized and accepted, must be strongly considered.

Fortunately, this transition is facilitated by the fact that Gitlab is an excellent and complete product. It does pretty much everything that Github does and more, and the friction caused by migrating should be minimal.

## Next steps

So, that's it. Lots of new features, some changes, hopefully all for the best.

I will be publishing more examples, documentation, and tutorials over the coming weeks. If you want to receive updates, please sign up for the mailing list below, or [![Join the chat at https://gitter.im/SCION-SCXML/Lobby](https://badges.gitter.im/SCION-SCXML/Lobby.svg)](https://gitter.im/SCION-SCXML/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge):

<link href="//cdn-images.mailchimp.com/embedcode/horizontal-slim-10_7.css" rel="stylesheet" type="text/css">
<style type="text/css">
    #mc_embed_signup{background:#fff; clear:left; font:14px Helvetica,Arial,sans-serif; width:100%;}
    /* Add your own MailChimp form style overrides in your site stylesheet or in this style block.
       We recommend moving this block and the preceding CSS link to the HEAD of your HTML file. */
</style>
<div id="mc_embed_signup">
<form action="https://jacobeanrnd.us19.list-manage.com/subscribe/post?u=a7806227a1320bcc8f1d15da1&amp;id=59a5c5dc97" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" class="validate" target="_blank" novalidate>
    <div id="mc_embed_signup_scroll">
    
    <input type="email" value="" name="EMAIL" class="email" id="mce-EMAIL" placeholder="email address" required>
    <!-- real people should not fill this in and expect good things - do not remove this or risk form bot signups-->
    <div style="position: absolute; left: -5000px;" aria-hidden="true"><input type="text" name="b_a7806227a1320bcc8f1d15da1_59a5c5dc97" tabindex="-1" value=""></div>
    <div class="clear"><input type="submit" value="Subscribe" name="subscribe" id="mc-embedded-subscribe" class="button"></div>
    </div>
</form>
</div>

Thanks, and I look forward to receiving your feedback.

