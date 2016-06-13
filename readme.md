# <img src="media/logo.png" width="72">

> Tangible symlinks

Wml listens to changes in some folder (using [watchman](https://facebook.github.io/watchman/)) and copies changed files into another folder.

## Why?

todo

## Install

```sh
npm install -g wml
```

## Usage

```sh
# add the link to wml using `wml add <src> <dest>`
wml add ~/my-package ~/main-project/node_modules/my-package
# start watching all links added
wml start
```

## Commands

#### add

`wml add <src> <dest>` (or `wml a`)

Adds a link.

wml will not start listening to changes until you start it by running `wml start`.

Eace link is given an unique id, you can see all links and their ids by running `wml list`.

#### rm

`wml rm <linkId>`

Removes a link.

#### start

`wml start` (or `wml s`)

Starts wml.

It first copies all watched files from source to destination folder and then waits for new changes to happen.

#### list

`wml list` (or `wml ls`)

Lists all links.

Shows link's id, state and source/destination folders.

#### enable

`wml enable <linkId>` (or `wml en`)

Enables a link.

#### disable

`wml disable <linkId>` (or `wml d`)

Disables a link.

Great for re-using old links without having to type them over and over again.

## Developing

todo
