# Contributing

PRs are most welcome! This doc covers some basic things you'll need to know to set up
your dev environment and streamline the review process. 

## Environment Setup

This project includes `.nvmrc`. You should use nvm so that you're always developing for the correct
version of Node.

This project uses `yarn` as a package manager. DO NOT install `yarn` using `npm` as that will install
the outdated 1.x branch. Full instructions are in the [yarn docs](https://yarnpkg.com/getting-started/install),
but here's the quick checklist at the time of this writing.

1. `corepack enable`
2. `corepack prepare yarn@stable --activate`
3. On first install, the above may change your yarn config away from `pnp`; check your git working copy for changes and revert if necessary.
4. `yarn install`

## Testing

The metro bundler under `/example` is set up to use the libraries files under root.  
Which means, when you change something within `javascript/components/UserLocation.js`  
it will be reflected in any scene in example that uses that component.

TODO: A better overview of how we use jest, detox, etc. (issue #22)

## Optional: Local development with yalc

It is often desirable to test in the context of an external project (for example,
if you have a complex application using a map and want to test your changes directly).
While it's not easy to do this out of the box with `yarn` or `npm`.
[`yalc`](https://www.viget.com/articles/how-to-use-local-unpublished-node-packages-as-project-dependencies/)
can mitigate some of the pain with this.


## Best practices for PRs

- If you add a feature, make sure you add it to the documentation
- If you add an objective-c or java method, make sure you update the declaration file: `index.d.ts`.
- Make sure to use small concise commits
- Use meaningful commit messages
- Make sure to update/ add new tests for your changes
- If you add a new feature, make sure to add a scene in `/example` for others to see/ test it

## Documentation

Documentation is generated from code blocks and comments.  
It will be auto-generated when you commit changes.  
If any changes are generated from your edits, the changed files will need to be added using `git add` before attempting the commit again.  
To manually generate the changes, run `yarn generate`.  

Notice, that changing the documentation in the individual <COMPONENT>.md within `/docs` will not suffice.  
The correct way is the above described
