# @generative-music/fs-provider

An audio sample file provider for Node.

## Usage

This package exports a [factory function](#factory) which creates [`Provider`s](#provider). The factory requires a single object parameter which adheres to the schema defined in [@generative-music/sample-index-schema](https://github.com/generative-music/sample-index-schema) and contains file paths for audio sample files.

```javascript
const makeProvider = require('@generative-music/fs-provider');

const sampleIndex = {
  piano: {
    C4: 'path/to/c4.wav',
    C5: 'path/to/c5.wav',
  },
  drum: ['path/to/hit/1.wav', 'path/to/hit/2.wav'],
};

const provider = makeProvider(sampleIndex);
```

## Factory

The only export of this package is a factory function for creating [`Provider`s](#provider).

### `makeProvider()`

The factory function which returns a [`Provider`](#provider) of the specified audio samples.

#### Syntax

```javascript
const provider = makeProvider(sampleIndex);
```

##### Parameters

- **sampleIndex**: An object which adheres to the schema defined in [@generative-music/sample-index-schema](https://github.com/generative-music/sample-index-schema).

##### Return value

A [`Provider`](#provider) instance.

## `Provider`

A `Provider` provides audio samples from the local file system.

### `Provider.canProvide()`

The `canProvide` method of the provider interface returns a `Promise` that resolves to a `Boolean` indicating whether or not the provider is currently capable of providing the requested dependencies. The `Boolean` value will be `true` if all the samples exist and are readable.

#### Syntax

```javascript
provider.canProvide(sampleNames).then(function (result) {
  // Do something with the result
});
```

##### Parameters

- **sampleNames**: An array of strings which correspond to property names in the sample index that was used to create the provider.

##### Return value

A `Promise` that resolves to a `Boolean` indicating whether or not the provider is currently capable of providing the requested audio samples.

### `Provider.provide()`

The `provide` method of the provider interface returns a `Promise` that resolves to an object containing the requested audio samples as `AudioBuffer`s.

#### Syntax

```javascript
provider.provide(sampleNames, audioContext).then(function (result) {
  // Do something with the provided AudioBuffers
});
```

##### Parameters

- **sampleNames**: An array of strings which correspond to property names in the sample index that was used to create the provider.
- **audioContext**: An `AudioContext` object, used to decode the audio sample files.

##### Return value

A `Promise` that resolves to an object with the same structure as the sample index that was used to create the provider, but with each audio sample file path replaced by an `AudioBuffer` of that file.

## Example

This example creates a [Provider](#provider) and uses it to check the availability of some audio samples, and to create a [Tone.js](https://tonejs.github.io/) sampler if the samples can be provided.

```javascript
const Tone = require('tone');
const makeProvider = require('@generative-music/fs-provider');

const sampleIndex = {
  piano: {
    C4: 'path/to/c4.wav',
    C5: 'path/to/c5.wav',
  },
};

const provider = makeProvider(sampleIndex);

provider.canProvide(['piano']).then((isProvidable) => {
  if (isProvidable) {
    return provider.provide(['piano']).then((samples) => {
      const sampler = new Tone.Sampler(samples);
    });
  }
  // cannot provide samples!
});
```
