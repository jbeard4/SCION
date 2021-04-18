module.exports = typeof window !== 'undefined' && window.scion && window.scion.core ? window.scion.core : require('@scion-scxml/core');
