# <img src="media/logo.png" width="72">

> Tangible symlinks

Wml listens to changes in some folder (using [Watchman](https://facebook.github.io/watchman/)) and copies changed files into another folder.

## Why?

Let's face it, sometimes symbolic links just aren't enough. Github has more than [10K issues](https://github.com/search?utf8=✓&q=support+for+symlinks&type=Issues) with the words "support for symlinks" in them. 

Two examples I've encountered so far were: React Native's packager [lack of support for them](https://github.com/facebook/react-native/issues/637) and Webpack's [inability to find linked modules dependencies](http://webpack.github.io/docs/troubleshooting.html#npm-linked-modules-doesn-t-find-their-dependencies) (working around this has issues of its own). A lot of people resolve to working directly from the node_modules folder in these cases, but *a.* if your package is required by two projects on which you are working simultaneously, you're screwed, and *b.* it just feels wrong.

Wml makes use of Facebook's ultra-fast Watchman to watch for changes in your source folder and copy them (and only them) into your destination folder.

Wml is a CLI tool that works pretty much like `ln -s`. You first set up your links by using the `wml add` command and then run the wml service (`wml start`) to start listening. That's it!

Note that since Wml is based on Watchman it **does not support symlinks**. lol.

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

Each link is given an unique id, you can see all links and their ids by running `wml list`.
Links are saved to `src/links.json` in your `wml` install directory, meaning that 
your configuration is specific to that `wml` install.

#### rm

`wml rm <linkId>`

Removes a link. Passing `all` as linkId removes all links.

#### start

`wml start` (or `wml s`)

Starts wml.

It first copies all watched files from source to destination folder and then waits for new changes to happen.

#### list

`wml list` (or `wml ls`)

Lists all links.

Shows each link's id, state and source/destination folders.

#### enable

`wml enable [linkId]` (or `wml en`)

Enables a link. Passing `all` as linkId enables all links.

If you don't specify a linkId wml will open in interactive mode.

#### disable

`wml disable [linkId]` (or `wml d`)

Disables a link. Passing `all` as linkId disabled all links.

If you don't specify a linkId wml will open in interactive mode.

Great for re-using old links without having to type them over and over again.

## Miscellaneous

#### Ignored folders

When adding a new link Wml will try to detect if your source folder is a git repository or an npm package, it will then offer to ignore the ".git" and "node_modules" folders for you.

If you want to add more folders to your ignored folders first create a file named `.watchmanconfig` in your source folder, this file should contain Watchman's configuration for this folder. See example below to learn how populate it or check out the [Watchman docs](https://facebook.github.io/watchman/docs/config.html) to learn more about Watchman configurations. 

In the following example we are ignoring the ".git" and "node_modules" folders:

```json
{
    "ignore_dirs": [
        ".git",
        "node_modules"
    ]
}
```

## Contributing

See the [Contributing page](CONTRIBUTING.md).

## License

Copyright (c) 2016 Wix. Licensed under the MIT license.
