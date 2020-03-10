# @loopback/apiconnect

This module extends LoopBack with ability to integrate with
[IBM API Connect](https://www.ibm.com/cloud/api-connect).

## Stability: ⚠️Experimental⚠️

> Experimental packages provide early access to advanced or experimental
> functionality to get community feedback. Such modules are published to npm
> using `0.x.y` versions. Their APIs and functionality may be subject to
> breaking changes in future releases.

## Installation

```sh
npm i @loopback/apiconnect --save
```

## Usage

The component should be loaded in the constructor of your custom Application
class.

Start by importing the component class:

```ts
import {ApiConnectComponent} from '@loopback/apiconnect';
```

In the constructor, add the component to your application:

```ts
this.component(ApiConnectComponent);
```

The component requires a configuration for API Connect extension for OpenAPI
spec:

```ts
const apiConnectOptions: ApiConnectSpecOptions = {
  targetUrl: 'http://localhost:3000/test-service',
};
app
  .configure(ApiConnectBindings.API_CONNECT_SPEC_ENHANCER)
  .to(apiConnectOptions);
```

## Contributions

- [Guidelines](https://github.com/strongloop/loopback-next/blob/master/docs/CONTRIBUTING.md)
- [Join the team](https://github.com/strongloop/loopback-next/issues/110)

## Tests

Run `npm test` from the root folder.

The acceptance test against fluentd is available as a separate package at
`acceptance/extension-logging-fluentd`.

## Contributors

See
[all contributors](https://github.com/strongloop/loopback-next/graphs/contributors).

## License

MIT
