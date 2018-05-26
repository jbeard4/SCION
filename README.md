
# Overview

This module provides an abstract class BaseInterpreter, which can be extended
to provide interpreters that implement custom Statecharts semantics. 

Currently, BaseInterpreter is extended into two concrete realizations,
scion-core and scion-core-legacy, which provide interpreters that implement the
semantics for the algorithm described in Appendix D of the SCXML
implementation, and the semantics described in Jacob Beard's master's thesis,
respectively.
