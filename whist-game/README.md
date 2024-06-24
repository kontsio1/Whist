### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

# Steps to recreate

*Frontend*: react
*Server/Backend*: node.js

Install: 
- dotenv (dev dependency)
- nodemon (dev dependency)
- pg (dev dependency) -> pSQL db framework
- express -> for api

Setup services:
- configure db in [ElephantSQL](https://www.elephantsql.com/)
- host api with [Render](https://render.com/)

Next steps:
- seed db by using suitable Object Relational Mapping (ORM) Framework ex:
  - [Node-postgres](https://node-postgres.com/features/connecting#environment-variables) 
  - [Prisma](https://www.prisma.io/docs/orm)
  - 
- create api.ts where I configure axios to point at the api (make sure to name .env.production and .env.development in full -not .env.prod etc)


Links to keep in mind:

- url: https://kontsio1.github.io/Whist/#/game
- Dashboard: https://dashboard.render.com/web/srv-cm8btten7f5s73dciusg/deploys/dep-cm8c2h0cmk4c7391cscg
- Api: https://whist-game-web-service.onrender.com/
- DB: [here](postgres://lsahubkw:DocupetHVC2NcF_LGA5CXJBIB-fwtqFN@mel.db.elephantsql.com/lsahubkw)
- new DB: https://tembo.io/

### To Do
- remove toast on adding player
- add toast on request success
- add back button
- add rules/form validation for starting game with no users