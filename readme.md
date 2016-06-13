# <img src="media/logo.png" width="72">

> Tangible symlinks

Wml listens to changes in some folder (using [watchman](https://facebook.github.io/watchman/)) and copies changed files into another folder.

## Why?

Sometimes symbolic linking just isn't enough. React native's packager [doesn't support them](http://webpack.github.io/docs/troubleshooting.html#npm-linked-modules-doesn-t-find-their-dependencies). Webpack [cannot find linked modules dependencies](http://webpack.github.io/docs/troubleshooting.html#npm-linked-modules-doesn-t-find-their-dependencies), and working around this has issues of its own. A lot of people resolve to working directly from the node_modules folder in these cases, but *a.* if your package is required by two projects on which you are working simultaneously, your stuck, and *b.* it just feels wrong.

Wml makes use of Facebook's ultra-fast Watchman to watch for changes in your source folder and copy them (and only them) into your destination folder.

Wml is a CLI tool that works pretty much like `ln -s`. You first set up your links by running the `wml add` command and then run the wml service (`wml start`) to start listening. That's it!

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
