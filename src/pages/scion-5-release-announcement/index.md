---
title: SCION@5.0.0 Release Announcement
author: jacob-beard
date: 2018-08-27
template: article.jade
---

Since 2006, I’ve dreamt of releasing  a fully integrated framework for SCXML/Statecharts in JavaScript. What I mean by "fully integrated" is: you have model visualization, visual debugging, and basic language tools, such as linting. Everything needed to do real work with SCXML/Statecharts in the JavaScript ecosystem.

When SCION started, it was basically a library implementing an interpreter/compiler for the SCXML standard in JavaScript, for node.js and the browser.

With the release of SCION@5.0.0, the scope of the project has expanded to be a complete system for developing SCXML in JavaScript. SCION is now a software _distribution_ which includes the following core libraries:

* interpreter (core)
* compiler (scxml)
* visualizer (schviz)
* linter (scharpie)

These core libraries enable advanced debugging, as well as the development of better online documentation (API docs, examples, and tutorials). This is facilitated through the following new developer tools.

## SCION DevTools Overview

### Online documentation

There has been a dearth of learning resources for SCXML. Online documention (API docs, examples, and tutorials) is essential to enabling an open software ecosystem to flourish, SCION attempts to provide libraries to facilitate the creation of this documentation. 

To start this off, you can find some tutorials written by my friend [@thure](http://github.com/thure) [here](/tutorials/fundamentals).  More examples will be forthcoming, and I hope that opening these libraries to the community will allow people to develop and contribute their own online tutorials.

### CLI tool

The SCION command-line tool allows you to visualize, lint, compile and interactively run SCXML files. You can also monitor SCXML sessions using the new monitor tool, described in the section below. You can see an example of this in the video below:

<iframe width="560" height="315" src="https://www.youtube.com/embed/GbP3_b8GVbM" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

### Graphical debugging

The new __sourcemap-plugin__ module adds support for generating source maps to the SCION compiler. This enables a visual JavaScript debugger, like Chrome DevTools or VSCode, to read the sourcemap, set breakpoints in the SCXML source file, and inspect the SCXML datamodel. This works in Node.js and the Browser. 

Additionally, SCION includes a new __monitor__ utility, which provides a user interface to view a log of events processed by the state machine, and display debugging information, such as the datamodel, inner event queue, and session hierarchy, to visualize how the state changes over time.

Here is a video of these features in action:

<iframe width="560" height="315" src="https://www.youtube.com/embed/Pg9tYuJN6BI" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

### Visual Studio Code Integrations 

SCION integrates with the Visual Studio Code (VSCode) IDE in the following ways:
* linting, using VSCode's built-in support for eslint, and the eslint-plugin-scharpie package for linting SCXML
* visualization, using the new @scion-scxml/vscode-preview VSCode extension
* graphical debugging, using VSCode's built-in JavaScript debugger, and the new SCION sourcemap-plugin mentioned above.

You can see an example of this in the following video:

<iframe width="480" height="270" src="https://www.youtube.com/embed/G7ADiXTP-LM" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

## Availability 

I am starting to roll out this new work in a private beta. If you want to try it, please sign up for the mailing list below, or join the chat on Gitter:

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

Source code will be made available on Gitlab at a new organization [SCION-SCXML](https://gitlab.com/SCION-SCXML) (more on this below).

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

Here is a complete list of all modules and their associated licenses at the time of this writing:

<Table of modules and licenses.>

I have thought a lot about this licensing scheme, and wanted to share my thoughts on how I arrived here.

### Funding Models

There are many different ways to make money from open source software.

One way is through donations. I created a project on [OpenCollective](https://opencollective.com/SCION#) in June, and so far have received $1,150 in donations from two backers. I am _extremely_ grateful for this support, and plan to invest this money back into the project. But donations are rarely a business model for sustainable development. Typically, only the most popular open source software projects can sustain development in this way. 

Another approach is through consulting for companies that do work related to SCION. Some companies have reached out for support, but the opportunity to do paid consulting work on SCION has never succeeded. I think that sometimes this is because the company is very large, and they have their own internal team of engineers, and would rather do the work entirely in-house. Or the company may be very small, and doesn't have the resources to pay for a consultant. It could also be because I spend most of my time talking to engineers within a company, who do not themselves have purchasing power or the ability to execute contracts. 

At the same time, some companies have adopted SCION and are using it successfully to run their applications. They have even made significant code contributions back to the project. I am grateful for these contributions. But these contributions have also created more work for me, as I need to test and maintain them when I add additional features to SCION going forward. Thus, they do not solve the problem of finding a funding model to sustain ongoing development.

A third approach to sustainable funding is through "dual licensing". This entails choosing an open source license that compels businesses to pay for a commercial license if they are using the software to develop closed-source applications. This is the model that I have chosen for the developer tools in the latest version of SCION, as this approach feels the most fair to me. If you are a $250-million corporation, and you are using SCION to develop closed applications which bring in a modicum of revenue, it is reasonable to request a few dollars to help pay for maintenance of that software infrastructure.

The challenge has been figuring how to ask large enterprises to pay for a license, without alienating the community of open source software developers, of which I consider myself a part.

I have decided to license the new developer tools under the LicenseZero Parity license, version 3.0. Parity is a public software license which is similar to the GNU Public License (GPL), in that if you use it to develop new software, the license says that you have to open source that code, or purchase a private license. I like this license because it is short, simple, expansive, and fair. Also, LicenseZero makes it convenient to purchase a private license through its command-line tool, or on its website. You can find more information about the LicenseZero Parity License [here](https://guide.licensezero.com/#public-licenses). 

I call this approach license “evolution”, rather than “revolution”, because the parts of the project that have been licensed as Apache-2.0 will continue to be published under the same license. If you are upgrading an existing application to the latest versions of SCION and SCION-CORE, you should be able to do so without needing to worry about the Parity license. Only the new modules will be published under Parity. The new SCION DevTools are not necessary to build applications based on SCION, but I believe they will help developers a great deal.

### Concerns Around Contributions

My main concern is about how this will impact SCION's ability to build a community. For example, consider this tweet by @mikeal:

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">With dual licensing you either can&#39;t take external contributions or you have to require they sign over the IP.<br><br>It makes the original intention of Free Software, building a community, effectively impossible.<br><br>It&#39;s just freemium proprietary software at that point.</p>&mdash; Mikeal Rogers (@mikeal) <a href="https://twitter.com/mikeal/status/1032391259992682497?ref_src=twsrc%5Etfw">August 22, 2018</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>


It's true that contributors to SCION will now need to sign a Contributor License Agreement where they assign their copyright to Jacobean Research and Development. Contributions to SCION have historically not required users to assign their copyright to the project. _I am concerned that this will create a barrier for new contributors._ 

If you want to contribute to SCION, and you have concerns about licensing, please reach out to me on Gitter, or at [jake@jacobeanrnd.com](mailto:jake@jacobeanrnd.com), or leave a comment on this website. I sincerely look forward to having these conversations.

## Intention to migrate from Github to Gitlab

Last, I wanted to mention my intention to migrate from Github to Gitlab for hosting the SCION source code. I intend to do this to protest Microsoft's (who recently purchased Github) contract with the Department of Immigration and Customs Enforcement (ICE). I signed a [petition](https://github.com/selfagency/microsoft-drop-ice) to this effect, and I have thought a lot about this in the months since.

On the one hand, I am not opposed to using Microsoft's open source technologies. I use a lot of it in SCION, for example integrating with the MS Botbuilder framework and VSCode IDE.  Also, I don't have any illusion that my action, as an individual developer, will have any effect on Microsoft's decision-making. It's only when it looks like the cost to Microsoft outweighs the benefit that any action will be taken. And Microsoft does a lot of business with the US government, so this will likely require a sea change among developers before they start to take notice.

On the other hand, software is speech, and I feel that, as a developer born in the US, I have a moral and ethical responsibility to use my voice to protest what I see as abuses committed by the government. Separating infant children from their parents for misdemeanor crimes, and detaining them indefinitely in cages, potentially causing permanent psychological trauma, is an abuse of power.

Github is a de facto standard platform for open source development. Moving SCION to Gitlab will create some friction for SCION users and contributors, and violate the principle of least surprise for new users. Normally, that is the opposite of what is desirable for an open source project, but in this case, it is the point. I want users and developers to momentarily consider the relationship between Microsoft and ICE, because the situation with ICE separating child immigrants from their parents and detaining them indefinitely is not normal, or acceptable, or business as usual. Anything that I can do to draw attention to this, and prevent it from becoming normalized and accepted, must be strongly considered.

Fortunately, this transition is facilitated by the fact that Gitlab is an excellent and complete product. It does pretty much everything that Github does and more, and the friction caused by migrating should be minimal.

## Next steps

So, that's it. Lots of new features, some changes, hopefully all for the best.

I will be publishing more examples, documentation, and tutorials over the coming weeks. Thanks, and I look forward to receiving your feedback.
