# :pizza: pizza-delivery

[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![TypeScript](https://badgen.net/badge/-/typescript?icon=typescript&label)](https://typescriptlang.org)
[![tested with mocha](https://img.shields.io/badge/tested%20with-mocha-brown?color=8d684b)](https://mochajs.org)

## Overview

**[Getting Started](#getting-started)**  
**[Usage](#usage)**  
**[Development & Testing](#development-&-testing)**  
**[Built With](#built-with)**  
**[Contributing](CONTRIBUTING.md)**  
**[Todo List](TODO.md)**

## Getting Started

`pizza-delivery` is a simple Node.js program that models a pizza shop.

The project focuses on using object-oriented programming principles to answer
questions posed by the [Pizza Delivery Exercise][5].

## Usage

### Pizza Delivery Exercise

#### Part 1

> A delivery person is delivering pizzas to an infinite two-dimensional grid of
> houses. She begins by delivering a pizza to the house at her starting
> location; a dispatcher then calls via radio and tells her where to move next.
> Moves are always exactly one house to the north (`^`), south (`v`), east
> (`>`), or west (`<`). After each move, she delivers a pizza to the house at
> her new location. The dispatcher has been a little spacey lately, so she
> sometimes ends up delivering more than one pizza to the same house.
>
> Here are some examples:
>
> - `>` delivers pizzas to two houses: one to the house at the starting
>   location, and one to the house directly east of the starting location.
> - `^>v<` delivers pizzas to four houses in a square; the house at the
>   starting/ending location ends up with two pizzas.
> - `^v^v^v^v^v` delivers a bunch of pizzas to some very lucky people at only
>   two houses.
>
> Given the string of dispatcher inputs in [this file][6], how many houses
> receive at least one pizza?

To find out the answer to Part 1, run the following in your terminal:

```zsh
ts-node ./challenge
```

#### Part 2

> The next day, to speed up the process, the delivery person rents a
> pizza-delivering goat. She and the goat begin at the same starting location,
> and they both deliver a pizza to this starting house. She and the goat then
> take turns moving based on the dispatcher's instructions.
>
> Here are some examples:
>
> - `^v` now delivers pizzas to three houses; The delivery person goes north and
>   the goat goes south.
> - `^>v<` now delivers pizzas to three houses; The delivery person and the goat
>   both end up back where they started.
> - `^v^v^v^v^v` now delivers pizzas to 11 houses; The delivery person treks
>   north and the goat treks south.
>
> Given the same string of dispatcher inputs as in [Part 1](#part-1), how many
> houses receive at least one pizza?

To find out the answer to Part 2, run the following in your terminal:

```zsh
ts-node ./challenge --workers 2
```

#### Using Different Dispatcher Inputs

Are you a pizza dispatcher interested in finding how many houses _your_ workers
visited? Run the snippet below to find out:

```zsh
ts-node ./challenge --inputs <path-to-dispatcher-inputs-file> --workers <num-workers>
```

where:

- `<path-to-dispatcher-inputs-file>` is the path to your dispatcher inputs file
- `<num-workers>` is the total number of delivery workers on shift

### Pizza Delivery API

Interested in the `pizza-delivery` internals? Check out the docs:

#### `abstracts`

- [`Employee`](src/abstracts/employee.abstract.ts)

#### `models`

- [`DeliveryWorker`](src/models/delivery-worker.model.ts)
- [`Dispatcher`](src/models/dispatcher.model.ts)
- [`Location`](src/models/location.model.ts)
- [`Pizzeria`](src/models/pizzeria.model.ts)

## Development & Testing

See the [Contributing Guide](CONTRIBUTING.md) for details on contributing code
and running tests.

## Built With

- [`@flex-development/mango`][1]
- [`@flex-development/tutils`][2]
- [`@sindresorhus/is`][3]
- [`group-items`][4]

[1]: https://github.com/flex-development/mango
[2]: https://github.com/flex-development/tutils
[3]: https://github.com/sindresorhus/is
[4]: https://github.com/meyfa/group-items
[5]: #pizza-delivery-exercise
[6]: ./__fixtures__/dispatcher-inputs.txt
