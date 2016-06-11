# wmlink

> Use wmlink when symlinks simply aren't enough

Wmlink listens to changes in some folder (using [watchman](https://facebook.github.io/watchman/)) and copies changed files to another folder.

## Why?

todo

## Install

```sh
npm install -g wmlink
```

## Usage

```sh
# add the link to wmlink using `wmlink add <src> <dest>`
wmlink add ~/my-package ~/main-project/node_modules/my-package
# start watching all links added
wmlink start
```

### Commands

#### add

`wmlink add <src> <dest>`

Adds a link.
wmlink will not start listening to changes until you start it by running `wmlink start`.
Eace link is given an unique id, you can see all links and their ids by running `wmlink list`.

#### rm

`wmlink rm <linkId>`

Removes a link.

#### start

`wmlink start`

Starts wmlink.

It first copies all watched files from source to destination folder and then waits for new changes to happen.

#### list

`wmlink list`

Lists all wmlink.
Shows link's id, state and source/destination folders.

#### enable

`wmlink enable <linkId>`

Enables a link.

#### disable

`wmlink disable <linkId>`

Disables a link.
Great for re-using old links without having to type them over and over again.

## Developing

todo
