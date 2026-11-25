# @flowfuse-certified-nodes/ffcn-kafka
[Node Red][1] for working with apache kafka, a streaming product.
First initial release using [kafka-node][4] .

* Kafka Broker
* Kafka Admin
* Kafka Commit
* Kafka Consumer
* Kafka ConsumerGroup
* Kafka Offset
* Kafka Producer
* Kafka Rollback

Has a test GUI which allows topics to be added.

Special features:
* Generic topic(s) for a consumer using regex which dynamically adds new topics as they are defined
* For consumer add/remove topics (not persisted)
* Convert "/" to "." to assist with interfaces to other queueing technologies

Note: all nodes run in debug mode for 111 messages then turns off.

------------------------------------------------------------

## Kafka Broker

Defines the client interface to kafka. One can add process.env for hosts with 

	process.env.atesthosts='[{"host":"atesthost1","port":1234},{"host":"atesthost2","port":4321}]';

in settings.js

![Kafka Broker](documentation/broker.JPG "Kafka Broker")
![Kafka Broker Options](documentation/brokerOptions.JPG "Kafka Broker Options")

------------------------------------------------------------

## Kafka Admin

Provide the ability to process administration tasks such as create and list topic. 

Following topics commnads or via GUI allowed:

*   describeCluster
*   describeDelegationToken
*   describeReplicaLogDirs
*   listConsumerGroups
*   listGroups
*   listTopics

Plus following topics commands allowed where paramaters are payload:
*   alterConfigs, alterReplicaLogDirs, createAcls,createDelegationToke
*   createPartitions, createTopics, deleteAcls, deleteConsumerGroups, deleteRecords
*   deleteTopics, describeAcls, describeConsumerGroups, describeGroups, describeLogDirs, describeTopics   *   electPreferredLeaders, expireDelegationToken, incrementalAlterConfigs, listConsumerGroupOffsets, renewDelegationToken


![Admin](documentation/admin.JPG "Admin")

------------------------------------------------------------

## Kafka Commit

If msg._kafka exists and the consumer associated with the message is not on autocommit, it issues commit for the consumer that had produced the message.  Sends to OK or Error port depending on state.
Note, as Kakfa keeps giving messages to consumer regardless if commit being outstanding, the commit may commit many in-flight messages.  Haven't identified a method of readily preventing this behavour without complications.

------------------------------------------------------------

## Kafka Consumer

Consumer of topic messages in kafka which are generated into node-red message. 
Provides types of base and high level.
If wildcard selected then topics are regex patterns which are dynamically made active (or removed) when available.
A check is performed once every minute for chanaes to topics.

![Kafka Consumer](documentation/consumer.JPG "Kafka Consumer")
![Kafka Consumer Options](documentation/consumerOptions.JPG "Kafka Consumer Options")
![Kafka Consumer Fetch](documentation/consumerFetch.JPG "Kafka Consumer Fetch")
![Kafka Consumer Encoding](documentation/consumerEncoding.JPG "Kafka Consumer Encoding")
------------------------------------------------------------

## Kafka Consumer Group

Consumer of topic messages in kafka which are generated into node-red message. 

![Kafka Consumer Group](documentation/consumerGroup.JPG "Kafka Consumer Group")
![Kafka Consumer Group Options](documentation/consumerGroupOptions.JPG "Kafka Consumer Options Group")

------------------------------------------------------------

## Kafka Offset

Get various offsets from Kafka. Which type are set via msg.action or msg.topic.  msg.payload states the types of options.



![Kafka Offset](documentation/offset.JPG "Kafka Offset")

------------------------------------------------------------

## Kafka Producer

Converts a node-red message into a kafka messages.
Provides types of base and high level.

![Kafka Producer](documentation/producer.JPG "Kafka Producer")


------------------------------------------------------------

## Kafka Rollback

If msg._kafka exists and the consumer associated with the message is not on autocommit, it closes the consumer.  This effectively rolls back the message in Kafka plus ensures the message cannot be automatically handed to the the consumer.  It is expected that the message or problem is fixed and the consumer opened again for processing.

------------------------------------------------------------

## Simple Web Admin Panel

Simple Web page monitor and admin panel 

![Web](documentation/webAdmin.JPG "Web")


------------------------------------------------------------

# Install

Run the following command in the root directory of your Node-RED install or via GUI install

    npm install node-red-contrib-kafka-manager


# Tests

Test/example flow in test/generalTest.json

![Tests](documentation/tests.JPG "Tests")


------------------------------------------------------------

# Version

1.0.0 Forked for FlowFuse Certified Nodes

0.6.1 Major change in compression and add deadletter q

0.5.0 add consumer wildcard topics + topics / to . along with fix on to/from/json


# Release process

In this project, the [Release Please](https://github.com/googleapis/release-please) is used to automatically determine the next release version based on the commit messages in the codebase.

By using the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/), the project adheres to a standardized format for commit messages, which `Release Please` uses to determine whether the next release should be a major, minor, or patch release.

## Components

1. The `Prepare release` GitHub Action workflow:

    * A Release Please action that analyzes commit messages to determine the type of release required (major, minor, patch) based on the Conventional Commits specification
    * Creates a pre-release pull request with the proposed version bump and changelog
    * Once merged, automatically updates the version number in `package.json` and creates a new release on GitHub with the appropriate changelog

2. The `Lint Pull Request Title` GitHub Action workflow:

    * A workflow that runs on pull request creation and uses the `amannn/action-semantic-pull-request` action to validate that pull request titles follow the Conventional Commits format
    * Together with adjusted default merge commit message, this ensures that all commits merged into the main branch adhere to the expected format, allowing Release Please to function correctly

3. The `Release Published` GitHub Action workflow:

    * A workflow that runs when a new git tag in `v*.*.*` format is pushed and is responsible for publishing the new version of the package to the FlowFuse Certified Nodes registry using the `JS-DevTools/npm-publish` action

## Pull Request Title Format

The Conventional Commits preset expects pull request titles to be in the following format:

```
<type>(<scope>): <subject>
```

* Type: Describes the category of the commit. Examples include:
    * `feat`: A new feature (triggers a minor version bump).
    * `fix`: A bug fix (triggers a patch version bump).
    * `perf`: A code change that improves performance (triggers a patch version bump).
    * `refactor`: A code change that neither fixes a bug nor adds a feature (does not trigger a release unless it's accompanied by a BREAKING CHANGE).
    * `docs`: Documentation-only changes (does not trigger a release).
    * `chore`: Changes to the build process or auxiliary tools and libraries (does not trigger a release).
* Scope: An optional part that provides additional context about what was changed (e.g., module, component).
* Subject: A brief description of the changes.

## Handling Breaking Changes

To indicate a breaking change, the exclamation mark `!` should be used immediately after the type/scope:

* `feat!:`
* `fix!:`
* `refactor!:`


# Origin

Forked from the [`node-red-contrib-kafka-manager`][2] node written by [Peter Prib][3]

[1]: http://nodered.org "node-red home page"

[2]: https://www.npmjs.com/package/node-red-contrib-kafka-manager "source code"

[3]: https://github.com/peterprib "base github"

[4]: https://github.com/SOHU-Co/kafka-node "npm kafka-node"
