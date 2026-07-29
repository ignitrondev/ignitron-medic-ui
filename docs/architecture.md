# Architecture

Ignitron Odontogram separates four concerns:

```text
Domain core
├── canonical tooth identity
├── numbering presentation
├── value validation
└── change event types

React renderer
├── accessible interaction
├── visual tooth representation
├── condition selection
└── edit, read-only, and print modes

Integrating application
├── patient and encounter context
├── authentication and authorization
├── persistence and audit storage
└── signatures and document finalization
```

The canonical tooth ID is independent of display notation. FDI, Universal, and Palmer values are generated for presentation and must not become the internal identity.

The component is controlled: the integrating application owns `value`; the component emits a new value plus a domain change event.
