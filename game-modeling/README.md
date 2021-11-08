# Game modeling

During the course of a live real-world football game, actual player stats are updated in real time (via polling). We want to display rankings of all teams live in real time. There are about 20 leagues and thousands of teams. The game runs on a distributed environment powered by multiple machines/pods.

## What would be an efficient way to model this?

This schema resume a high level view of such an infrastrucutre:

![alt text](https://github.com/typedef42/so-mk-game/blob/master/game-modeling/schema.png?raw=true)

### On an infrastructure point of view

I would split the deployment in four micro-services:

* Auth Service -> that handle accounts and authentification
* Collection Service -> that handle user collection of player cards, and profile settings
* Tournament Service -> that handle tournament creation and team declaration from users
* Scoring Service -> that retrieve player stats from external provider and compute score for teams

It would be interesting to have such separated deployments to handle charge. Auth and Collection service wouldn't be so much stressed and could have statical replicats, whereas Tournament and Scoring would benefit from horizontal pod autoscaling. Those last two service would have a surge in traffic at team creation when all users compose their teams, and of course during weekends and real football game.

There would be a few service to service events, mainly from the Tournament service to the Scoring service. To distribute that I would use a classic pubsub bus (google pubsub if on GCP for example). Events emitted by the Tournament service would typically be TournamentStarted or TeamCreated

### On an architecture point of view

I would definitively use clean-architecture in full, that's why I didn't reprensented a datamodel first hand, but rather focus on different domains that make sense at this stage (Collection, Tournament, Scoring)

I would also use GraphQL in all micro-services as an API, and place a GQL federation with a composed schema in front of the backends, to provide a unique point of entry and API to the frontend clients.

For most of the services (all but scoring), I would use straight forward CQS architecture (that fit well with GraphQL mutation/query), having a SQL datastore with an ORM.

For the scoring service, I would probably implement an event-sourcing architecture, to be able to easly build different read projections (team scoring / ranking, but maybe also football player ranking independantly etc). That event store would mainly be feed by the external PlayerStatProvider. Also event-sourcing would allow to easly replay an entire tournament team ranking, or have ranking at certain point in time, which could be a impactfull feature for users.

## What would be your strategy to update team rankings in real time?

To handle that, Event based (PlayerStatUpdated) Commands would trigger score computation. Volume of teams (thousands), to fetch impacted teams shouldn't be a bottleneck for a relational database such as Postgres, as long as the data model is carefully crafted (probably some indexation on the Player/Card relation of the Team table).

To have real time feedback to the frontend I would use graphql subscriptions from the client. Although GQL federation does not have support for subscriptions yet, a simple other subscription service could listen to a document store (such as redis), which itself would be fed by the Scoring service every time teams score evolve (or said differently, every time the Team Score projection is updated).

## What are the trade-offs of your approach?

On the architecture side, having a persistence layer (PGSQL) would probably slow things down a little bit compared to a memory store (although postgres must have a in-mem mode ?), but would provide some long term persistance and resilience in case of service restarting / pod disruption.
Also having real time feedback through subscription (so websockets) would be energy consuming for the user devices (specially battery life for mobile devices). This could be tempered with polling or other HTTP fake realtime system, at the cost of having a less smooth experience for the UI IMO.

On the infrastructure side, although a micro-service infrastructure could be more costly to setup and monitor at first sight, with not such a huge investment in a good CI/CD setup it would bring significant scaling flexibility over a more monolithic approach, especialy in a case where charge can easly vary between the differents domains (collection, tournament, scoring...).
It would also help engineering team scaling in my own experience, where squad can easly have their own business domain responsability (scoring could be a dedicated team...)