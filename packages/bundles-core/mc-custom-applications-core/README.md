# MC Custom Applications Core

React components and utilities for building Merchant Center custom applications

## Installation

This package is published to Github Packages.

```bash
npm install --save @commercetools/mc-custom-applications-core
```

### Configuration

[Create a Github access token](https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line#creating-a-token) with the `repo` and `read:packages` scopes. Use the token to [configure npm](https://help.github.com/en/packages/using-github-packages-with-your-projects-ecosystem/configuring-npm-for-use-with-github-packages#authenticating-with-a-personal-access-token) for authentication to Github Packages.

In the same directory as your `package.json` file, create or edit an `.npmrc` file to include a line specifying the commercetools GitHub Packages registry.

```text
registry=https://npm.pkg.github.com/commercetools
```

Note: If you are using `yarn`, create or edit a `.yarnrc` file to include the registry.

```text
"@commercetools:registry" "https://npm.pkg.github.com"
```

## Development

```jsx
import React from 'react';

import { PaginatedTable } from '@commercetools/mc-custom-applications-core';

const Example = props => ({
  <PaginatedTable />
});

export default Example;
```

### Linking

Use [yarn link](https://classic.yarnpkg.com/en/docs/cli/link/) to link this package to your dependant project.

#### Monorepos

Unfortunately, `yarn link` does not work well in a monorepo setup; therefore, [yalc](https://www.npmjs.com/package/yalc) is the recommended solution instead. After installing `yalc`, run `yalc publish` in this package and then use the `yalc link @commercetools/mc-custom-applications-core` command in your dependant project as it does not modify the `package.json` file.

## Building/Testing

* `npm run build` - build minified production artifacts
* `npm run build:dev` - build development artifacts
* `npm test` - runs tests
* `npm run test:coverage` - runs tests with coverage
