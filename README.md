# Code Challenge: Authorizer

This application authorizes transactions for a specific account
following a set of predefined rules

## Run the project

### With Docker

```bash
$ docker build . -t authorize
$ docker run -i authorize < operations
```

### Without Docker

#### Prerequisites

- Node.js 16.12.0
- npm 8.1.0

1. Install dependencies.

```bash
$ npm install
```

2.  Build the project.

```bash
$ npm run build
```

3.  Run the script that receives the lines as input through stdin.

```bash
$ npm run start < operations
```

## Reasoning for language and dependencies choice

The programming language that I chose to develop the project is Typescript, which is a syntactical superset of Javascipt that adds static types to it.
The main reason I chose it is that it is a language that I already know and use on a daily basis and also because its types really help organizing the code and avoiding common mistakes.

About the used dependencies, I installed `ts-node` and `tsc`, both libraries that run and transpiles Typescript code respectively.
For the tests, I used the `jest` framework and a dependency called `mock-stdin` useful to run integration tests through stdin.

## Architectural decisions

As soon as I started solving the challenge, I noticed that the application I was starting to develop had three clear concerns: input, processing, and output. With that in mind, I thought the MVC architecture was the right choice for this application, structuring it around those three different responsibilities:

- Model: here I define the different objects that are part of the problem, like an Account that processes the user inputs and stores the state of the application or an Authorizer that handles the operations validation.

- Controller: I define an AccountController whose main responsabilities are starting and setting up the business rules, handle every user input and also leting the view know that a change was made in the Account model.

- View: I treated the application's I/O handling as a View. With this approach, everytime it get a new user input, it runs an AccountController method to change the Model and also observes every change in it to send an output to the user.

## Execution flow explanation

1. The AccountController receives an Account that has not yet been initialized and a View.
2. The AccountController starts the application adding the business rules to the Account and subscribing to the View.
3. The View receives an user input and tells the subscribed AccountController about it.
4. The AccountController validates the received input through the Account model. 
5. The Account model executes the validations setted up in step 2 and modifies its internal state accordingly.
6. Once the output is received by AccountController, it is send again to the View.
7. The View displays the ouput to the user.

## Other technical decisions

- Observer pattern